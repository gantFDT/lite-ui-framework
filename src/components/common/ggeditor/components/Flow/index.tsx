import React from 'react';
import G6 from '@antv/g6';
import { uuid } from '../../utils';
import { isEmpty, clone } from 'lodash';
import { notification } from 'antd';
import { FLOW_CONTAINER_ID, ShapeClassName, LabelState, SelectBehaviorState } from '../../common/constants';
import { GraphReactEventProps, GraphConfig } from '../../common/interface';
import { withEditorPrivateContext } from '../../common/context/EditorPrivateContext';
import Graph from '../Graph';

import './shape';
import './behavior';
import { GraphEvent } from '../../common/interface';

interface FlowProps extends GraphReactEventProps {
  className?: string;
  style?: React.CSSProperties;
  data: any;
  mode?: string;
  width?: number;
  height?: number;
  graphConfig?: Partial<GraphConfig>;
  customModes?: (mode: string, behaviors: any) => object;
}

interface FlowState {}

class Flow extends React.Component<FlowProps, FlowState> {
  containerId: string;

  static defaultProps = {
    graphConfig: {
      minZoom: 0.25,
      maxZoom: 2,
      autoPaint: true,
      groupType: 'rect'
    },
  };

  constructor(props: FlowProps) {
    super(props);

    this.containerId = `${FLOW_CONTAINER_ID}_${uuid()}`;
  }

  canDragCanvas = () => {
    const { labelState, brushState } = this.props;

    return brushState === SelectBehaviorState.Move;
  };

  canZoomCanvas = () => {
    const { labelState } = this.props;

    return labelState === LabelState.Hide;
  };

  canDragNode = ({ target }: GraphEvent) => {
    return target && target.get('className') !== ShapeClassName.Anchor;
  };

  parseData = (data: any) => {
    const { nodes = [], edges = [] } = data;

    [...nodes, ...edges].forEach(item => {
      const { id } = item;

      if (id) {
        return;
      }

      item.id = uuid();
    });

    return data;
  };

  initGraph = (width: number, height: number) => {
    const { containerId } = this;
    const { graphConfig, customModes, setBrushState, setGraphState } = this.props;

    const modes: any = {
      default: {
        'flow-drag-canvas': { // 拖动画布
          type: 'flow-drag-canvas',
          shouldBegin: this.canDragCanvas,
          shouldUpdate: this.canDragCanvas,
          shouldEnd: this.canDragCanvas,
          onlyDragCanvas: false, // 拖动空白地方
          needSpaceDown: false // 按下空格键才能拖动
        },
        'zoom-canvas': {
          type: 'zoom-canvas',
          shouldUpdate: this.canZoomCanvas,
          sensitivity: 1 // 放大缩小灵敏度， 1 - 10
        },
      },
      edit:{
        'active-edge': 'active-edge',
        align: 'align',
        'click-select': 'click-select', // 点选
        'drag-add-edge': 'drag-add-edge', // 添加线条
        'drag-edit-edge': 'drag-edit-edge', // 编辑线条
        'flow-drag-canvas': { // 拖动画布
          type: 'flow-drag-canvas',
          shouldBegin: this.canDragCanvas,
          shouldUpdate: this.canDragCanvas,
          shouldEnd: this.canDragCanvas,
          onlyDragCanvas: true, // 拖动空白地方
          needSpaceDown: false // 按下空格键才能拖动
        },
        'drag-node': 'drag-node', // 拖动节点
        'hover-anchor': 'hover-anchor',
        'hover-node': 'hover-node',
        'context-menu': 'context-menu',
        'zoom-canvas': {
          type: 'zoom-canvas',
          shouldUpdate: this.canZoomCanvas,
          sensitivity: 1 // 放大缩小灵敏度， 1 - 10
        },
      },
      onlyBrush: {
        'brush-select': {
          type: 'brush-select',
          setBrushState,
          setGraphState
        }
      }
    };

    Object.keys(modes).forEach(mode => {
      const behaviors = modes[mode];

      modes[mode] = Object.values(customModes ? customModes(mode, behaviors) : behaviors);
    });

    this.graph = new G6.Graph({
      container: containerId,
      width,
      height,
      modes,
      ...graphConfig,
    });

    return this.graph;
  };

  render() {
    const { containerId, parseData, initGraph } = this;

    return <Graph containerId={containerId} parseData={parseData} initGraph={initGraph} {...this.props} />;
  }
}

export default withEditorPrivateContext<FlowProps>(Flow);
