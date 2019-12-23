import commandManager from '../../../common/commandManager';
import { baseCommand, BaseCommand } from './base';

interface CommandParams {}

const command: BaseCommand<CommandParams> = {
  ...baseCommand,

  params: {},

  canExecute() {
    return true;
  },

  canUndo() {
    return false;
  },

  init(dataSource) {

  },

  execute(dataSource) {
    const { customModalProps, setCustomModalProps } = dataSource;
    setCustomModalProps(`flowTempModal`, {
      visible: true,
      onlyRowData: false,
      onOk: (data) => this.importGraphData(dataSource, data, 'flowTempModal')
    });
  },

  undo(dataSource) {

  },
};

commandManager.register('import', command);
