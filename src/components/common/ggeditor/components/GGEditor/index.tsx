import React, { CSSProperties } from 'react';
import isArray from 'lodash/isArray';
import { pick, cloneDeep } from 'lodash';
import { addListener } from '../../utils';
import Global from '../../common/Global';
import { GraphState, LabelState, SelectBehaviorState, EditorEvent, GraphCommonEvent } from '../../common/constants';
import {
  Graph,
  CommandEvent,
  GraphStateEvent,
  LabelStateEvent,
  EventHandle,
  ContextMenuEvent,
  WorkflowTemplateData
} from '../../common/interface';
import commandManager from '../../common/commandManager';
import EditorContext from '../../common/context/EditorContext';
import EditorPrivateContext, { EditorPrivateContextProps, CustomModalProps } from '../../common/context/EditorPrivateContext';

interface GGEditorProps {
  className?: string;
  style?: CSSProperties;
  [EditorEvent.onBeforeExecuteCommand]?: EventHandle<CommandEvent>;
  [EditorEvent.onAfterExecuteCommand]?: EventHandle<CommandEvent>;
}

interface GGEditorState extends EditorPrivateContextProps { }

class GGEditor extends React.Component<GGEditorProps, GGEditorState> {
  static setTrackable(trackable: boolean) {
    Global.setTrackable(trackable);
  }

  lastMousedownTarget: EventTarget | null;

  constructor(props: GGEditorProps) {
    super(props);

    this.state = {
      graph: null,
      graphState: GraphState.CanvasSelected,
      labelState: LabelState.Hide,
      brushState: SelectBehaviorState.Move,
      contextMenuState: { visible: false, clientX: 0, clientY: 0 },
      setGraph: this.setGraph,
      setGraphState: this.setGraphState,
      setLabelState: this.setLabelState,
      canExecuteCommand: this.canExecuteCommand,
      executeCommand: this.executeCommand,
      setContextMenuState: this.setContextMenuState,
      setBrushState: this.setBrushState,

      designId: null,
      designName: null,
      workflowTemplateData: { name: "", stopFunction: {}, sequence: [], withGrid: true },
      setDesignId: this.setDesignId,
      setDesignName: this.setDesignName,
      setWorkflowTemplateData: this.setWorkflowTemplateData,

      customModalProps: {
        flowTempModal: { visible: false, onOk: () => { } },
        designTempModal: { visible: false, onOk: () => { } },
        promptModal: { visible: false, onOk: () => { } },
      },
      setCustomModalProps: this.setCustomModalProps,
    };

    this.lastMousedownTarget = null;
  }

  bindEvent(graph: Graph) {
    const { props } = this;

    addListener<EventHandle<CommandEvent>>(
      graph,
      EditorEvent.onBeforeExecuteCommand,
      props[EditorEvent.onBeforeExecuteCommand],
    );

    addListener<EventHandle<CommandEvent>>(
      graph,
      EditorEvent.onAfterExecuteCommand,
      props[EditorEvent.onAfterExecuteCommand],
    );

    addListener<EventHandle<GraphStateEvent>>(graph, EditorEvent.onGraphStateChange, ({ graphState }) => {
      if (graphState === this.state.graphState) {
        return;
      }

      this.setState({
        graphState,
      });
    });

    addListener<EventHandle<LabelStateEvent>>(
      graph,
      EditorEvent.onLabelStateChange,
      ({ graphState = GraphState.NodeSelected, labelState }) => {
        if (labelState === this.state.labelState) {
          return;
        }

        this.setState({
          graphState,
          labelState,
        });
      },
    );

    addListener<EventHandle<ContextMenuEvent>>(
      graph,
      EditorEvent.onContextMenuStateChange,
      (param: ContextMenuEvent) => {
        this.setContextMenuState(param);
      },
    );
  }

  bindShortcut(graph: Graph) {
    window.addEventListener(GraphCommonEvent.onMouseDown, e => {
      this.lastMousedownTarget = e.target;
    });

    graph.on(GraphCommonEvent.onKeyDown, (e: any) => {
      const canvasElement = graph.get('canvas').get('el');

      if (this.lastMousedownTarget !== canvasElement) {
        return;
      }

      Object.values(commandManager.command).some(command => {
        const { name, shortcuts } = command;

        const flag = shortcuts.some((shortcut: string | string[]) => {
          const { key } = e;

          if (!isArray(shortcut)) {
            return shortcut === key;
          }

          return shortcut.every((item, index) => {
            if (index === shortcut.length - 1) {
              return item === key;
            }

            return e[item];
          });
        });

        if (flag) {
          if (this.canExecuteCommand(name)) {
            this.executeCommand(name);
            return true;
          }
        }

        return false;
      });
    });
  }

  setGraph = (graph: Graph) => {
    this.setState({
      graph,
    });

    this.bindEvent(graph);
    this.bindShortcut(graph);
  };

  setGraphState = (graphState: GraphState) => {
    this.setState({
      graphState,
    });
  };

  setLabelState = (labelState: LabelState) => {
    this.setState({
      labelState,
    });
  };

  setContextMenuState = (param: ContextMenuEvent) => {
    const { contextMenuState } = param;
    this.setState({
      contextMenuState,
    });
  };

  setBrushState = (brushState: string) => {
    this.setState({
      brushState,
    });
  };

  setDesignId = (designId: string | null) => {
    this.setState({
      designId,
    });
  };

  setDesignName = (designName: string | null) => {
    this.setState({
      designName,
    });
  };

  setWorkflowTemplateData = (workflowTemplateData: WorkflowTemplateData) => {
    this.setState({
      workflowTemplateData,
    });
  };

  setCustomModalProps = (modalType: string, modalProps: CustomModalProps) => {
    const { customModalProps } = this.state;
    let fakeModalProps = cloneDeep(customModalProps);
    Object.assign(fakeModalProps[modalType], modalProps);
    this.setState({
      customModalProps: fakeModalProps,
    });
  };

  canExecuteCommand = (name: string) => {
    const {
      graph,
      executeCommand,
      setGraphState,
      brushState,
      setBrushState,
      contextMenuState,

      designId,
      designName,
      workflowTemplateData,
      setDesignId,
      setDesignName,
      setWorkflowTemplateData,

      customModalProps,
      setCustomModalProps,
    } = this.state;

    if (graph) {
      return commandManager.canExecute({
        graph,
        executeCommand,
        setGraphState,
        brushState,
        setBrushState,
        contextMenuState,

        designId,
        designName,
        workflowTemplateData,
        setDesignId,
        setDesignName,
        setWorkflowTemplateData,

        customModalProps,
        setCustomModalProps,
      }, name);
    }

    return false;
  };

  executeCommand = (name: string, params?: object) => {
    const {
      graph,
      executeCommand,
      setGraphState,
      brushState,
      setBrushState,
      contextMenuState,

      designId,
      designName,
      workflowTemplateData,
      setDesignId,
      setDesignName,
      setWorkflowTemplateData,

      customModalProps,
      setCustomModalProps,
    } = this.state;

    if (graph) {
      commandManager.execute({
        graph,
        executeCommand,
        setGraphState,
        brushState,
        setBrushState,
        contextMenuState,

        designId,
        designName,
        workflowTemplateData,
        setDesignId,
        setDesignName,
        setWorkflowTemplateData,

        customModalProps,
        setCustomModalProps,
      }, name, params);
    }
  };

  render() {
    const { children } = this.props;
    const {
      graph,
      executeCommand,
      setGraphState,
      brushState,
      setBrushState,

      designId,
      designName,
      workflowTemplateData,
      setDesignId,
      setDesignName,
      setWorkflowTemplateData,

      customModalProps,
      setCustomModalProps,
    } = this.state;

    return (
      <EditorContext.Provider
        value={{
          graph,
          setGraphState,
          executeCommand,
          brushState,
          setBrushState,

          designId,
          designName,
          workflowTemplateData,
          setDesignId,
          setDesignName,
          setWorkflowTemplateData,

          customModalProps,
          setCustomModalProps,
        }}
      >
        <EditorPrivateContext.Provider value={this.state}>
          <div {...pick(this.props, ['className', 'style'])}>{children}</div>
        </EditorPrivateContext.Provider>
      </EditorContext.Provider>
    );
  }
}

export default GGEditor;
