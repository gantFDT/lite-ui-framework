import { GraphEvent, Shape, Node } from '../../../common/interface';
import behaviorManager from '../../../common/behaviorManager';

behaviorManager.registerFlowBehavior('drag-add-edge', {
  getDefaultCfg() {
    return { edgeType: 'approve' };
  },
  getEvents() {
    return {
      mousedown: 'onMousedown',
      mousemove: 'onMousemove',
      mouseup: 'onMouseup',
    };
  },
  isAnchor(ev: GraphEvent) {
    const { target } = ev;
    const targetName = target.get('className');
    if (targetName == 'anchor') return true;
    else return false;
  },
  notThis(ev: GraphEvent) {
    const node = ev.item;
    const model = node.getModel();
    if (this.edge.getSource().get('id') === model.id) return false;
    return true;
  },
  judgeAnchorStatus(edgeType: string, sourceShape: string, targetShape: string){
    if(edgeType == "approve"){
      // 批准操作
      if (sourceShape === '_type_start') {
        if (targetShape === '_type_end' || targetShape === '_type_join')
          return false;
      } else if (targetShape == '_type_start' || sourceShape == '_type_end') {
        return false;
      } else if (sourceShape === '_type_split') {
        if (targetShape !== '_type_step')
          return false;
      }
    } else if (edgeType == "reject") {
      // 否决操作
      if (sourceShape == "_type_start" || targetShape == "_type_start") {
        return false;
      } else if (sourceShape == "_type_end" || targetShape == "_type_end") {
        return false;
      } else if (sourceShape == "_type_split") {
        return false;
      } else if (sourceShape == "_type_step") {
        if (targetShape == "_type_join") {
          return false;
        }
      } else if (sourceShape == "_type_join") {
        if (targetShape == "_type_join" || targetShape == "_type_split") {
          return false;
        }
      }
    } else if (edgeType == "cancel") {
      // 作废连接线
      if (sourceShape != "_type_step") {
        return false;
      } else if (targetShape != "_type_end") {
        return false;
      }
    }
    return true;
  },
  shouldBegin(ev: GraphEvent) {
    const { target } = ev;
    const targetName = target.get('className');
    // 如果点击的不是锚点就结束
    if (targetName === 'anchor') return true;
    else return false;
  },
  onMousedown(ev: GraphEvent) {
    if (!this.shouldBegin.call(this, ev)) return;
    const node = ev.item;
    const graph = this.graph;
    const edgeType = graph.get('edgeType') || this.edgeType;
    this.sourceNode = node;
    graph.getNodes().forEach((n: Shape) => {
      const shape = node.getKeyShape().baseType;
      const targetShape = n.getKeyShape().baseType;
      if (n.get('id') === node.get('id'))
        graph.setItemState(n, 'addingSource', true);
      else {
        const anchorStatus = this.judgeAnchorStatus(edgeType, shape, targetShape);
        graph.setItemState(n, anchorStatus ? 'addingEdge' : 'disabled', true);
      }
    });

    const point = { x: Number(ev.x.toFixed(1)), y: Number(ev.y.toFixed(1)) };
    const model = node.getModel();
    const edgeId = this.getEdgeId(node);
    const edgeLabel = this.getEdgeLabel(edgeType, model);
    // 如果在添加边的过程中，再次点击另一个节点，结束边的添加
    // 点击节点，触发增加边
    if (!this.addingEdge && !this.edge) {
      const item = {
        id: edgeId,
        label: edgeLabel,
        shape: edgeType,
        type: edgeType,
        source: model.id,
        target: point,
        sourceAnchor: ev.target.get('index'),
        condition: {
          functionRelation: "OR",
          functions: [],
          logicValue: true,
          type: "logicValue"
        }
      };

      if (edgeType === 'reject' && model.shape !== '_type_join') {
        item.influenceScope = 'part'
      }

      this.edge = graph.addItem('edge', item);
      this.addingEdge = true;
    }
  },
  getEdgeId(node: Node) {
    // 获取与node关联的所有出边
    const model = node.getModel();
    const No = node.getOutEdges().length + 1;
    return `${model.id}${No.toString().padStart(2, '0')}`;
  },
  getEdgeLabel(type: string, model: any) {
    let label = '';
    if (model.id === 'START') return label;
    if (type === 'reject') {
      label = tr('否决');
    } else if (type === 'cancel') {
      label = tr('作废');
    } else {
      label = tr('批准');
    }
    return label;
  },
  onMousemove(ev: GraphEvent) {
    if (this.addingEdge && this.edge) {
      const point = { x: Number(ev.x.toFixed(1)), y: Number(ev.y.toFixed(1)) };
      !this.edge.hasState('drag') && this.graph.setItemState(this.edge, 'drag', true);
      if (this.isAnchor(ev) && this.notThis(ev)) {
        const node = ev.item;
        const model = node.getModel();
        this.graph.updateItem(this.edge, {
          targetAnchor: ev.target.get('index'),
          target: model.id,
        });
        !this.edge.hasState('onAnchor') && this.graph.setItemState(this.edge, 'onAnchor', true);
      } else {
        this.edge.hasState('onAnchor') && this.graph.setItemState(this.edge, 'onAnchor', false);
        this.graph.updateItem(this.edge, {
          target: point,
        });
      }
    }
  },
  onMouseup(ev: GraphEvent) {
    const { graph, sourceNode } = this;
    const node = ev.item;
    // 隐藏所有节点的锚点
    const hideAnchors = () => {
      graph.getNodes().forEach((n: Shape) => {
        // 清楚所有节点状态
        if (n.get('id') === sourceNode.get('id')) {
          graph.clearItemStates(sourceNode, 'addingSource');
        } else {
          graph.clearItemStates(n, ['disabled', 'addingEdge']);
        }
      });
    };
    const removEdge = () => {
      graph.remove(this.edge);
      this.edge = null;
      this.addingEdge = false;
      hideAnchors();
    };
    if (!this.shouldBegin.call(this, ev)) {
      // 拖拽连线时，未在锚点上放开则取消连线过程
      if (this.edge && this.addingEdge) removEdge();
      return;
    }
    const model = node.getModel();
    if (this.addingEdge && this.edge) {
      // 禁止自己连自己
      if (!this.notThis(ev)) {
        removEdge();
        return;
      }
      this.graph.setItemState(this.edge, 'drag', false);
      graph.updateItem(this.edge, {
        targetAnchor: ev.target.get('index'),
        target: model.id,
      });
      // 流程步骤操作顺序
      const sourceShape = sourceNode.getKeyShape().baseType;
      if (sourceShape !== '_type_start' && sourceShape !== '_type_end') {
        const stepSequence = sourceNode.getModel().stepSequence || [];
        const edgeId = this.edge.get('id');
        graph.updateItem(sourceNode, {
          stepSequence: [...stepSequence, { id: edgeId }]
        });
      }
      this.edge = null;
      this.addingEdge = false;
      hideAnchors();
    }
  },
});
