import command from '../../../common/command';
import commandManager from '../../../common/commandManager';

commandManager.register('resetZoom', {
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
    graph.zoomTo(1, {x: width / 2,y: height / 2})
  },

  // shortcuts: [['metaKey', ''], ['ctrlKey', 's']],
});
