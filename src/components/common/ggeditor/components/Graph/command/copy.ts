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

    if (selectedNodes.some(N => N.get('currentShape') === "_type_start" || N.get('currentShape') === "_type_end"))
      return false;

    return !!(selectedNodes.length);
  },

  canUndo() {
    return false;
  },

  execute(dataSource) {
    const { graph } = dataSource;
    const selectedNodes = this.getSelectedNodes(graph);
    let _command = graph.get("_command") || {};
    
    _command.clipboard = [];
    selectedNodes.forEach(V => {
      _command.clipboard.push({
        type: V.getType(),
        index: V.get('index'),
        model: V.getModel()
      })
    })
    graph.set("_command", { ..._command });
  },
};

commandManager.register('copy', Command);
