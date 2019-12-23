import React, { createRef, RefObject } from 'react';
import { pick, debounce } from 'lodash';
import elementResizeDetectorMaker from 'element-resize-detector';
import { addListener, getSelectedNodes, getSelectedEdges, isMind } from '../../utils';
import { track } from '../../helpers';
import Global from '../../common/Global';
import {
  GraphType,
  GraphState,
  EditorEvent,
  GraphCommonEvent,
  GraphNodeEvent,
  GraphEdgeEvent,
  GraphCanvasEvent,
  GraphCustomEvent,
} from '../../common/constants';
import {
  Graph,
  GraphNativeEvent,
  GraphReactEvent,
  GraphReactEventProps,
  GraphEvent,
  CommandEvent,
  EventHandle,
} from '../../common/interface';
import { withEditorPrivateContext } from '../../common/context/EditorPrivateContext';

import './command';
import './behavior';

interface EditorGraphProps extends GraphReactEventProps {
  containerId: string;
  data: any;
  mode?: string;
  width?: number;
  height?: number;
  parseData(data: object): object;
  initGraph(width: number, height: number): Graph;
}

interface EditorGraphState { }

class EditorGraph extends React.Component<EditorGraphProps, EditorGraphState> {
  graph: Graph | null;
  observer: MutationObserver | null;
  ref: RefObject<HTMLElement>;

  constructor(props: EditorGraphProps) {
    super(props);

    this.graph = null;
    this.observer = null;
    this.ref = createRef();
  }

  componentDidMount() {
    this.initGraph();
    this.bindEvent();

    this.listenBoxSizeChange();
  }

  componentWillUnmount() {
    const { observer, ref: { current } } = this;
    observer && observer.uninstall(current)
    this.observer = null;
  }

  listenBoxSizeChange() {
    const { graph, ref: { current } } = this;

    if (graph && current) {
      this.observer = elementResizeDetectorMaker();
      this.observer.listenTo(current, debounce((element: any) => {
        var width = element.offsetWidth;
        var height = element.offsetHeight;

        graph && graph.changeSize(width, height);
      }, 200));
    }
  }

  componentDidUpdate(prevProps: EditorGraphProps) {
    const { data } = this.props;

    if (data !== prevProps.data) {
      this.changeData(data);
    }
  }

  getGraphState = () => {
    const { graph } = this;

    let graphState: GraphState = GraphState.CanvasSelected;

    if (!graph) {
      return graphState;
    }

    const selectedNodes = getSelectedNodes(graph);
    const selectedEdges = getSelectedEdges(graph);

    if (selectedNodes.length === 1 && !selectedEdges.length) {
      graphState = GraphState.NodeSelected;
    }

    if (selectedEdges.length === 1 && !selectedNodes.length) {
      graphState = GraphState.EdgeSelected;
    }

    if (selectedNodes.length > 1 || selectedEdges.length > 1) {
      graphState = GraphState.MultiSelected;
    }

    return graphState;
  };

  initGraph() {
    const { containerId, parseData, initGraph, setGraph, mode } = this.props;
    const { clientWidth = 0, clientHeight = 0 } = document.getElementById(containerId) || {};

    // 解析数据
    const data = parseData(this.props.data);

    // 初始画布
    this.graph = initGraph(clientWidth, clientHeight);

    this.graph.read(data);

    if (mode && mode !== 'default') {
      this.graph.setMode(mode);
    } else {
      setTimeout(() => this.graph.fitView(20))
    }

    setGraph(this.graph);

    // 发送埋点
    if (Global.getTrackable()) {
      const graphType = isMind(this.graph) ? GraphType.Mind : GraphType.Flow;

      track(graphType);
    }
  }

  bindEvent() {
    const { graph, props } = this;

    if (!graph) {
      return;
    }

    const events: {
      [propName in GraphReactEvent]: GraphNativeEvent;
    } = {
      ...GraphCommonEvent,
      ...GraphNodeEvent,
      ...GraphEdgeEvent,
      ...GraphCanvasEvent,
      ...GraphCustomEvent,
    };

    (Object.keys(events) as GraphReactEvent[]).forEach(event => {
      addListener<EventHandle<GraphEvent>>(graph, events[event], props[event]);
    });

    // Add listener for the selected status of the graph
    const { setGraphState, setContextMenuState } = this.props;

    addListener<EventHandle<CommandEvent>>(graph, EditorEvent.onAfterExecuteCommand, () => {
      setTimeout(() => setGraphState(this.getGraphState()),1);
      setContextMenuState({
        contextMenuState:{
          visible: false,
          clientX: 0,
          clientY: 0
        }
      })
    });

    addListener<EventHandle<GraphEvent>>(graph, GraphNodeEvent.onNodeClick, () => {
      setTimeout(() => setGraphState(this.getGraphState()),1);
    });

    addListener<EventHandle<GraphEvent>>(graph, GraphEdgeEvent.onEdgeClick, () => {
      setTimeout(() => setGraphState(this.getGraphState()),1);
    });

    addListener<EventHandle<GraphEvent>>(graph, GraphNodeEvent.onNodeContextMenu, () => {
      setTimeout(() => setGraphState(this.getGraphState()),1);
    });

    addListener<EventHandle<GraphEvent>>(graph, GraphEdgeEvent.onEdgeContextMenu, () => {
      setTimeout(() => setGraphState(this.getGraphState()),1);
    });

    addListener<EventHandle<GraphEvent>>(graph, GraphCanvasEvent.onCanvasClick, () => {
      setGraphState(GraphState.CanvasSelected);
    });
  }

  changeData(data: any) {
    const { graph } = this;
    const { parseData } = this.props;

    if (!graph) {
      return;
    }

    parseData(data);

    graph.changeData(data);
  }

  render() {
    const { containerId, children } = this.props;

    return (
      <div ref={this.ref} id={containerId} style={{ height: '100%', width: '100%' }} {...pick(this.props, ['className'])}>
        {children}
      </div>
    );
  }
}

export default withEditorPrivateContext<EditorGraphProps>(EditorGraph);
