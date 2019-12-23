import command from '../../../common/command';
import commandManager from '../../../common/commandManager';

commandManager.register('zoomOut', {
  ...command,

  canExecute() {
    return true;
  },

  canUndo() {
    return false;
  },

  execute(dataSource) {
    const { graph } = dataSource;
    const height = graph.get('height');
    const width = graph.get('width');
    graph.zoom(0.75, {x: width / 2,y: height / 2})
  },

  // shortcuts: [['metaKey', ''], ['ctrlKey', 's']],
});
