import command from '../../../common/command';
import commandManager from '../../../common/commandManager';

commandManager.register('redo', {
  ...command,

  canExecute() {
    const { commandQueue, commandIndex } = commandManager;

    return commandIndex < commandQueue.length;
  },

  canUndo() {
    return false;
  },

  execute(dataSource) {
    const { commandQueue, commandIndex } = commandManager;

    commandQueue[commandIndex].execute(dataSource);

    commandManager.commandIndex += 1;
  },

  shortcuts: [['metaKey', 'shiftKey', 'z'], ['ctrlKey', 'shiftKey', 'z']],
});
