import command from '../../../common/command';
import commandManager from '../../../common/commandManager';

commandManager.register('undo', {
  ...command,

  canExecute() {
    const { commandIndex } = commandManager;

    return commandIndex > 0;
  },

  canUndo() {
    return false;
  },

  execute(dataSource) {
    const { commandQueue, commandIndex } = commandManager;

    commandQueue[commandIndex - 1].undo(dataSource);

    commandManager.commandIndex -= 1;
  },

  shortcuts: [['metaKey', 'z'], ['ctrlKey', 'z']],
});
