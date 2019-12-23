import { Modal } from 'antd';
import { SelectBehaviorState } from '../../../common/constants';
import { CommandDataSource } from '../../../common/interface';
import commandManager from '../../../common/commandManager';
import { baseCommand, BaseCommand } from './base';

interface CommandParams { }

interface CommandProps extends BaseCommand<CommandParams> {

}

const Command: CommandProps = {
  ...baseCommand,

  params: {},

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

  execute(dataSource) {
    const { graph } = dataSource;
    if (graph) {
      const selectedNodes = this.getSelectedNodes(graph);
      const selectedEdges = this.getSelectedEdges(graph);
      [...selectedNodes, ...selectedEdges].forEach(V => {
        V.toBack();
      })
      graph.paint();
    }
  },
};

commandManager.register('unGroup', Command);
