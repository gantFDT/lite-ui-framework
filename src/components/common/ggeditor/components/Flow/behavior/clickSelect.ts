// @reference https://github.com/antvis/g6/tree/master/src/behavior
import { GraphEvent } from '../../../common/interface';
import behaviorManager from '../../../common/behaviorManager';

behaviorManager.registerFlowBehavior('click-select', {
  getDefaultCfg() {
    return {
      multiple: true,
      keyCode: 17, // ctrl 键
    };
  },
  getEvents() {
    return {
      'node:contextmenu': 'onRightClick',
      'edge:contextmenu': 'onRightClick',
      'node:click': 'onClick',
      'edge:click': 'onClick',
      'canvas:click': 'resetState',
      keyup: 'onKeyUp',
      keydown: 'onKeyDown',
    };
  },
  onRightClick(e: GraphEvent){
    const item = e.item;
    const graph = this.graph;
    const selectedNode = graph.findAllByState('node', 'selected');
    const selectedEdge = graph.findAllByState('edge', 'selected');
    const selected = [...selectedNode, ...selectedEdge];
    if(selected.length > 1 && selected.some(shape => shape === item)){
      // 多选时，右键已选中的节点
      return;
    } else this.onClick(e);
  },
  onClick(e: GraphEvent) {
    const self = this;
    const item = e.item;
    const graph = self.graph;
    const autoPaint = graph.get('autoPaint');
    graph.setAutoPaint(false);
    if (!self.keydown || !self.multiple) {
      const selectedNode = graph.findAllByState('node', 'selected');
      const selectedEdge = graph.findAllByState('edge', 'selected');
      const selected = [...selectedNode, ...selectedEdge];
      selected.forEach(shape => {
        if (shape !== item) {
          graph.setItemState(shape, 'selected', false);
        }
      });
    }
    if (self.shouldUpdate.call(self, e)) {
      graph.setItemState(item, 'selected', true);
    }
    graph.setAutoPaint(autoPaint);
    graph.paint();
  },
  resetState(e: GraphEvent) {
    const graph = this.graph;
    const autoPaint = graph.get('autoPaint');
    graph.setAutoPaint(false);
    const selectedNode = graph.findAllByState('node', 'selected');
    const selectedEdge = graph.findAllByState('edge', 'selected');
    const selected = [...selectedNode, ...selectedEdge];
    selected.forEach(node => graph.setItemState(node, 'selected', false));
    graph.paint();
    graph.setAutoPaint(autoPaint);
  },
  onKeyDown(e: GraphEvent) {
    const code = e.keyCode || e.which;
    if (code === this.keyCode) this.keydown = true;
    else this.keydown = false;
  },
  onKeyUp() {
    this.keydown = false;
  },
});
