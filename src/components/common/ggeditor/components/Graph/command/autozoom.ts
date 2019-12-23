import command from '../../../common/command';
import commandManager from '../../../common/commandManager';

commandManager.register('autoZoom', {
  ...command,

  canExecute() {
    return true;
  },

  canUndo() {
    return false;
  },

  execute(dataSource) {
    const { graph } = dataSource;
    graph.fitView(20)
  },

  // shortcuts: [['metaKey', ''], ['ctrlKey', 's']],
});
