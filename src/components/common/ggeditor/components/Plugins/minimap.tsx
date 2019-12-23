import React from 'react';
import { uuid } from '../../utils';
import { FLOW_CONTAINER_ID } from '../../common/constants';
import { EditorPrivateContextProps, withEditorPrivateContext } from '../../common/context/EditorPrivateContext';
import pick from 'lodash/pick';
import { Minimap as G6Minimap } from '@antv/g6/plugins';

interface MinimapProps extends EditorPrivateContextProps {
  container: string;
  width?: number;
  height?: number;
  className?: string;
  viewportClassName?: string;
}

interface MinimapState {}

class Minimap extends React.Component<MinimapProps, MinimapState> {
  minimap = null;
  containerId: string;

  constructor(props: MinimapProps) {
    super(props);

    this.containerId = props.container || `${FLOW_CONTAINER_ID}_Minimap_${uuid()}`;
  }

  componentWillUpdate(newProps: MinimapProps) {
    if(newProps.graph && newProps.graph !== this.props.graph)
      this.init(newProps);
  }

  init(props: any) {
    const {
      graph,
      width,
      height,
      className,
      viewportClassName,
    } = props;

    const canvasWidth = graph.get('width');
    const canvasHeight = graph.get('height');
    const rate = canvasHeight / canvasWidth;

    const { clientWidth } = document.getElementById(this.containerId);

    this.minimap = new G6Minimap({
      container: this.containerId,
      size: [width || clientWidth, height || clientWidth * rate],
      className,
      viewportClassName,
    });

    graph.addPlugin(this.minimap)
  }

  render() {
    return <div id={this.containerId} {...pick(this.props, ['style'])} />;
  }
}

export default withEditorPrivateContext<MinimapProps>(Minimap);
