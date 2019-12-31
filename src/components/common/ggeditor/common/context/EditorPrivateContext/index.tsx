import React from 'react';
import { GraphState, LabelState } from '../../constants';
import { ContextMenuEvent, ContextMenuState, Graph, CustomUserData } from '../../interface';

export interface CustomModalProps {
  visible: boolean;
  modalTitle?: string;
  formTitle?: string;
  schema?: any;
  onOk?: (data?: any) => void;
}

export interface EditorPrivateContextProps extends CustomUserData {
  graph: Graph | null;
  graphState: GraphState;
  labelState: LabelState;
  setGraph: (graph: Graph) => void;
  setGraphState: (graphState: GraphState) => void;
  setLabelState: (labelState: LabelState) => void;
  executeCommand: (name: string, params?: object) => void;
  canExecuteCommand: (name: string) => boolean;
  contextMenuState: ContextMenuState;
  setContextMenuState: (contextMenuEvent: ContextMenuEvent) => void;
}

const EditorPrivateContext = React.createContext({} as EditorPrivateContextProps);

export const withEditorPrivateContext = function <P extends EditorPrivateContextProps>(
  WrappedComponent: React.ComponentClass<P>,
) {
  type WrappedComponentInstance = InstanceType<typeof WrappedComponent>;
  type WrappedComponentProps = Omit<P, keyof EditorPrivateContextProps>;
  type WrappedComponentPropsWithForwardRef = WrappedComponentProps & {
    forwardRef: React.Ref<WrappedComponentInstance>;
  };

  const InjectEditorContext: React.FC<WrappedComponentPropsWithForwardRef> = props => {
    const { forwardRef, ...rest } = props;

    return (
      <EditorPrivateContext.Consumer>
        {context => <WrappedComponent ref={forwardRef} {...(rest as any)} {...context} />}
      </EditorPrivateContext.Consumer>
    );
  };

  return React.forwardRef<WrappedComponentInstance, WrappedComponentProps>((props, ref) => (
    <InjectEditorContext forwardRef={ref} {...props} />
  ));
};

export default EditorPrivateContext;