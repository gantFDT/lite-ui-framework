import commandManager from '../../../common/commandManager';
import { baseCommand, BaseCommand } from './base';

interface CommandParams {}

const Command: BaseCommand<CommandParams> = {
  ...baseCommand,

  params: {},

  init() {
    
  },

  canExecute(dataSource) {
    const { graph } = dataSource;
    const nodes = graph.getNodes();

    if(nodes.some(N => N.get('currentShape') !== "_type_start" && N.get('currentShape') !== "_type_end"))
      return true;

    return false;
  },

  canUndo() {
    return false;
  },

  execute(dataSource) {
    const { graph } = dataSource;

    const nodes = graph.getNodes();
    const edges = graph.getEdges();

    // 清除所有状态
    [...nodes,...edges].forEach(Item => {
      graph.clearItemStates(Item)
    })
    
    graph.downloadImage(tr("导出图片"));
  },
};

commandManager.register('exportImg', Command);
