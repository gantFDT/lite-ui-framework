import React from 'react';
import { Graph, CustomUserData } from '../../interface';
import { GraphState } from '../../constants';

export interface EditorContextProps extends CustomUserData {
  graph: Graph | null;
  setGraphState: (graphState: GraphState) => void;
  executeCommand: (name: string, params?: object) => void;
}

const EditorContext = React.createContext({} as EditorContextProps);

export const withEditorContext = function <P extends EditorContextProps>(WrappedComponent: React.ComponentClass<P>) {
  type WrappedComponentInstance = InstanceType<typeof WrappedComponent>;
  type WrappedComponentProps = Omit<P, keyof EditorContextProps>;
  type WrappedComponentPropsWithForwardRef = WrappedComponentProps & {
    forwardRef: React.Ref<WrappedComponentInstance>;
  };

  const InjectEditorContext: React.FC<WrappedComponentPropsWithForwardRef> = props => {
    const { forwardRef, ...rest } = props;

    return (
      <EditorContext.Consumer>
        {context => <WrappedComponent ref={forwardRef} {...(rest as any)} {...context} />}
      </EditorContext.Consumer>
    );
  };

  return React.forwardRef<WrappedComponentInstance, WrappedComponentProps>((props, ref) => (
    <InjectEditorContext forwardRef={ref} {...props} />
  ));
};

export default EditorContext;
