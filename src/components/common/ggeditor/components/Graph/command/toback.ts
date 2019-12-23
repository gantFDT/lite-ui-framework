import { Graph, Node } from '../../../common/interface';
import commandManager from '../../../common/commandManager';
import { baseCommand, BaseCommand } from './base';

interface CommandParams {}

interface CommandProps extends BaseCommand<CommandParams> {
  toBack(graph: Graph, selectedNodes: Node[]): void;
}

const Command: CommandProps = {
  ...baseCommand,

  params: {
    sortIds: []
  },

  init() {

  },

  canExecute(dataSource) {
    const { graph } = dataSource;
    const selectedNodes = this.getSelectedNodes(graph);
    const selectedEdges = this.getSelectedEdges(graph);

    return !!(selectedNodes.length || selectedEdges.length);
  },

  canUndo() {
    return false;
  },

  toBack(graph, selectedNodes) {
    let nodes = graph.get('nodes');
    let nodeMap = nodes.reduce((T: any,C: any)=>({
      ...T,
      [C.get('id')]: C
    }),{});
    let sortIds = nodes.map((V: any) => V.get('id'));
    selectedNodes.forEach((V: any) => {
      const currentId = V.get('id');
      const id2move = sortIds.splice(sortIds.indexOf(currentId),1);
      V.toBack();
      sortIds.unshift(id2move);
    })

    nodes = sortIds.map((Id: string) => nodeMap[Id]);

    graph.set('nodes', nodes);
    graph.paint();
  },

  execute(dataSource) {
    const { graph } = dataSource;
    if (graph) {
      const selectedNodes = this.getSelectedNodes(graph);
      this.toBack(graph, selectedNodes);
    }
  },
};

commandManager.register('toBack', Command);
