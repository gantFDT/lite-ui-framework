import commandManager from '../../../common/commandManager';
import { baseCommand, BaseCommand } from './base';

interface CommandParams {}

const command: BaseCommand<CommandParams> = {
  ...baseCommand,

  params: {},
  
  canExecute(dataSource) {
    const { graph } = dataSource;
    return !this.isEmptyCanvas(graph);
  },

  canUndo() {
    return false;
  },

  init(dataSource) {

  },

  execute(dataSource) {
    this.saveGraphData(dataSource)
  },

  undo(dataSource) {

  },
};

commandManager.register('save', command);
