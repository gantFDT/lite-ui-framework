import { EditorEvent } from '../../../common/constants';
import { Behavior, GraphEvent } from '../../../common/interface';
import behaviorManager from '../../../common/behaviorManager';

interface ContextMenuBehavior extends Behavior {
  /** 显示右键菜单 */
  showContextMenu(e: GraphEvent, type: string): void;

  /** 隐藏右键菜单 */
  hideContextMenu(): void;

  /** 处理节点右击 */
  handleNodeContextMenu(e: GraphEvent): void;

  /** 处理线条右击 */
  handleEdgeContextMenu(e: GraphEvent): void;

  /** 处理画布右击 */
  handleCanvasContextMenu(e: GraphEvent): void;

  /** 处理鼠标点击 */
  handleMousedown(): void;
}

const contextMenuBehavior = {
  getEvents() {
    return {
      'node:contextmenu': 'handleNodeContextMenu',
      'canvas:contextmenu': 'handleCanvasContextMenu',
      'edge:contextmenu': 'handleEdgeContextMenu',
      'mousedown': 'handleMousedown',
    };
  },

  showContextMenu(e, type) {
    const { graph } = this;

    graph.emit(EditorEvent.onContextMenuStateChange, {
      contextMenuState: {
        visible: true,
        type,
        clientX: e.clientX,
        clientY: e.clientY,
      },
    });
  },

  hideContextMenu() {
    const { graph } = this;

    graph.emit(EditorEvent.onContextMenuStateChange, {
      contextMenuState: {
        visible: false,
        clientX: 0,
        clientY: 0,
      },
    });
  },

  handleNodeContextMenu(e) {
    const { item } = e;
    const currentShape = item.get('currentShape');
    if(currentShape === "_type_start" || currentShape === '_type_end') return;

    const graph = this.graph;
    const selectedNode = graph.findAllByState('node', 'selected');
    if(selectedNode.length > 1 && selectedNode.some(shape => shape === item)){
      // 多选时，右键已选中的节点
      this.showContextMenu(e, 'multi');
    } else {
      this.showContextMenu(e, 'node');
    }
  },

  handleCanvasContextMenu(e) {
    this.showContextMenu(e, 'canvas');
  },

  handleEdgeContextMenu(e) {
    const { item } = e;
    const graph = this.graph;
    const selectedEdge = graph.findAllByState('edge', 'selected');
    if(selectedEdge.length > 1 && selectedEdge.some(shape => shape === item)){
      // 多选时，右键已选中的节点
      this.showContextMenu(e, 'multi');
    } else {
      this.showContextMenu(e, 'edge');
    }
  },

  handleMousedown() {
    this.hideContextMenu();
  },
} as ContextMenuBehavior;

behaviorManager.registerBehavior('context-menu', contextMenuBehavior);
