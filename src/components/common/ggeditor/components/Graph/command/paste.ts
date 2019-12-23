import { cloneDeep } from 'lodash';
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
    const _command = graph && graph.get("_command") || {};
    return !!_command.clipboard && _command.clipboard.length > 0;
  },

  canUndo() {
    return false;
  },

  execute(dataSource) {
    const { graph, executeCommand } = dataSource;
    if (graph) {
      const { clipboard } = graph.get("_command");
      const pasteData = cloneDeep(clipboard);
      pasteData.forEach((V: any) => {
        const model = V.model;
        model.x && (model.x += 10);
        model.y && (model.y += 10);

        executeCommand('add', V)
      });
      graph.set("_command",{})
    }
  },
};

commandManager.register('paste', Command);
