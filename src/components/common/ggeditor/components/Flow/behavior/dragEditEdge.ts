import { GraphEvent, Shape } from '../../../common/interface';
import behaviorManager from '../../../common/behaviorManager';
import { executeBatch } from '../../../utils';

interface Point {
  x: number;
  y: number;
}

behaviorManager.registerFlowBehavior('drag-edit-edge', {
  getDefaultCfg() {
    return {
      controlPoints: [],
      currentControlIndex: -1
    };
  },
  getEvents() {
    return {
      'edge:mousedown': 'onMousedown',
      'mousemove': 'onMousemove',
      'mouseup': 'onMouseup',
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
    if (this.edge[`get${this.pointType === 'startPoint' ? 'Target' : 'Source'}`]().get('id') === model.id) return false;
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
    if (targetName === 'edge-anchor' || targetName === 'edge-center-anchor' || targetName === 'edge-control-anchor') return true;
    else return false;
  },
  addSequence2Source(){
    // 添加对应流程步骤
    const sourceShape = this.sourceNode.shape;
    if (sourceShape !== '_type_start' && sourceShape !== '_type_end') {
      const edgeId = this.edge.get('id');
      let stepSequence = this.sourceNode.stepSequence || [];
      if(stepSequence.some(S => S.id === edgeId)) return;
      this.graph.updateItem(this.sourceNode.id, {
        stepSequence: [...stepSequence, {id: edgeId}]
      });
    }
  },
  removeSequenceFromSource(){
    // 删除对应流程步骤
    const sourceShape = this.sourceNode.shape;
    if (sourceShape !== '_type_start' && sourceShape !== '_type_end') {
      const edgeId = this.edge.get('id');
      let stepSequence = this.sourceNode.stepSequence;
      const index = stepSequence.findIndex((S: any) => S.id === edgeId);
      if(index !== -1) {
        stepSequence.splice(stepSequence.findIndex((S: any) => S.id === edgeId),1)
        this.graph.updateItem(this.sourceNode.id, {
          stepSequence
        });
      }
    }
  },
  // 获取吸附点坐标
  getAttachPoint(item: Shape, point: Point) {
    let shape = item.get('auxiliaryLine');

    if(!shape) return point;

    // 拖拽过程中处于吸附状态
    const isAttach = () =>
      (shape.attachFlag === 'Y' && Math.abs(point.y - shape.y) <= shape.attachTolerance) ||
      (shape.attachFlag === 'X' && Math.abs(point.x - shape.x) <= shape.attachTolerance);

    const setPoint = ({ x, y }: { x?: number; y?: number }) => {
      if (!this.attachPoint) this.attachPoint = {};
      if (x && y) this.attachPoint = { x, y };
      if (x) this.attachPoint.x = x;
      if (y) this.attachPoint.y = y;
    };

    if (isAttach()) {
      if (shape.attachFlag === 'Y') setPoint({y: shape.y});
      if (shape.attachFlag === 'X') setPoint({x: shape.x});
    } else {
      // 超出范围取消吸附状态
      shape.attachFlag = '';
      this.attachPoint = {};
    }

    return { ...point, ...this.attachPoint };
  },
  onMousedown(ev: GraphEvent) {
    if (!this.shouldBegin.call(this, ev)) return;

    const node = ev.item;
    const { x, y, width, height } = ev.target.getBBox();
    const [ centerX, centerY ] = [ x + width / 2, y + height / 2 ];
    const model = node.getModel();
    const { controlPoints = [] } = model;

    const targetIndex = ev.target.get('index');
    const targetName = ev.target.get('className');

    const point = { x: Number(ev.x.toFixed(1)), y: Number(ev.y.toFixed(1)) };

    this.edge = node;

    executeBatch(this.graph, () => {
      if(targetName === 'edge-center-anchor') {
        // 点击中心控制点
        this.pointType = 'controlPoint';
        this.currentControlIndex = targetIndex - 1;
        controlPoints.splice(targetIndex - 1, 0, point);
      } else if(targetIndex === 0) {
        // 点击起点 🕖
        this.pointType = 'startPoint';
        this.originNode = node.getSource().getModel();

        this.sourceNode = node.getSource().getModel();
        this.removeSequenceFromSource();

        this.graph.getNodes().forEach((n: Shape) => {
          const targetShape = node.getTarget().getKeyShape().baseType;
          const sourceShape = n.getKeyShape().baseType;
          if (n.get('id') === node.getTarget().get('id')) {
            this.graph.setItemState(n, 'addingSource', true);
          } else {
            const anchorStatus = this.judgeAnchorStatus(model.shape, sourceShape, targetShape);
            this.graph.setItemState(n, anchorStatus ? 'addingEdge' : 'disabled', true);
          }
        });
      } else if(targetIndex === controlPoints.length + 1) {
        // 点击终点 🏁
        this.pointType = 'endPoint';
        this.originNode = node.getTarget().getModel();

        this.graph.getNodes().forEach((n: Shape) => {
          const sourceShape = node.getSource().getKeyShape().baseType;
          const targetShape = n.getKeyShape().baseType;
          if (n.get('id') === node.getSource().get('id'))
            this.graph.setItemState(n, 'addingSource', true);
          else {
            const anchorStatus = this.judgeAnchorStatus(model.shape, sourceShape, targetShape);
            this.graph.setItemState(n, anchorStatus ? 'addingEdge' : 'disabled', true);
          }
        });
      } else {
        // 点击控制点
        this.pointType = 'controlPoint';
        this.currentControlIndex = controlPoints.findIndex((P: Point) => P.x === centerX && P.y === centerY);
      }
    })

    this.controlPoints = controlPoints;

    this.edittingEdge = true;
  },
  onMousemove(ev: GraphEvent) {
    if (this.edittingEdge && this.edge) {
      const point = { x: Number(ev.x.toFixed(1)), y: Number(ev.y.toFixed(1)) };

      !this.edge.hasState('drag') && this.graph.setItemState(this.edge, 'drag', true);

      if(this.pointType !== 'controlPoint') {
        // 拖动起点 🕖 或终点 🏁
        const keyName = this.pointType === 'startPoint' ? 'source' : 'target';
        if (this.isAnchor(ev) && this.notThis(ev)) {
          const node = ev.item;
          const model = node.getModel();
          this.graph.updateItem(this.edge, {
            [`${keyName}Anchor`]: ev.target.get('index'),
            [keyName]: model.id,
          });

          // 添加对应流程步骤
          if(this.pointType === 'startPoint'){
            this.sourceNode = model;
            this.addSequence2Source();
          }

          !this.edge.hasState('onAnchor') && this.graph.setItemState(this.edge, 'onAnchor', true);
        } else {
          this.edge.hasState('onAnchor') && this.graph.setItemState(this.edge, 'onAnchor', false);
          this.graph.updateItem(this.edge, {
            [keyName]: point,
          });

          // 删除对应流程步骤
          if(this.pointType === 'startPoint' && this.sourceNode){
            this.removeSequenceFromSource();
            this.sourceNode = null;
          }
        }
      } else {
        // 拖动控制点
        this.controlPoints[this.currentControlIndex] = this.getAttachPoint(this.edge, point);
        this.graph.updateItem(this.edge, {
          controlPoints: this.controlPoints
        });
      }
    }
  },
  onMouseup(ev: GraphEvent) {
    const { graph, originNode, edge } = this;
    // 隐藏所有节点的锚点
    const hideAnchors = () => {
      if(!originNode) {
        // 清理委托图形与对齐线
        const auxiliaryLine = edge.get('auxiliaryLine');

        ['HTL', 'HCL', 'HBL', 'VLL', 'VCL', 'VRL'].forEach(lname => {
          if (auxiliaryLine['_' + lname]) {
            auxiliaryLine['_' + lname] && auxiliaryLine['_' + lname].remove();
            auxiliaryLine['_' + lname] = null;
          }
        });

        edge.set('auxiliaryLine', {});
      } else {
        graph.getNodes().forEach((n: Shape) => {
          // 清楚所有节点状态
          if (n.get('id') === originNode.id) {
            graph.clearItemStates(originNode.id, 'addingSource');
          } else {
            graph.clearItemStates(n, ['disabled', 'addingEdge']);
          }
        });
      }
    };
    if (this.edittingEdge && this.edge) {
      if (this.pointType !== 'controlPoint' && !this.isAnchor.call(this, ev)) {
        // 拖拽起点终点时，未在锚点上放开则还原
        const keyName = this.pointType === 'startPoint' ? 'source' : 'target';
        this.graph.updateItem(this.edge, {
          [`${keyName}Anchor`]: this.originNode.index,
          [keyName]: this.originNode.id,
        });
      }
      this.graph.setItemState(this.edge, 'drag', false);
      this.currentControlIndex = -1;
      this.controlPoints = [];
      this.pointType = 'controlPoint';
      this.edge = null;
      this.edittingEdge = false;
      hideAnchors();
    }
  },
});
