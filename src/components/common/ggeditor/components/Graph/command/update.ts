import pick from 'lodash/pick';
import commandManager from '../../../common/commandManager';
import { baseCommand, BaseCommand } from '../../../components/Graph/command/base';

interface UpdateCommandParams {
  id: string;
  originModel: object;
  updateModel: object;
}

const updateCommand: BaseCommand<UpdateCommandParams> = {
  ...baseCommand,

  params: {
    id: '',
    originModel: {},
    updateModel: {},
  },

  canExecute(dataSource) {
    const { graph } = dataSource;
    const selectedNodes = this.getSelectedNodes(graph);
    const selectedEdges = this.getSelectedEdges(graph);
    return (selectedNodes.length || selectedEdges.length) && (selectedNodes.length === 1 || selectedEdges.length === 1)
      ? true
      : false;
  },

  init(dataSource) {
    const { graph } = dataSource;
    const { id, updateModel } = this.params;

    const updatePaths = Object.keys(updateModel);
    const originModel = pick(graph.findById(id).getModel(), updatePaths);

    this.params.originModel = originModel;
  },

  execute(dataSource) {
    const { graph } = dataSource;
    const { id, updateModel } = this.params;
    graph.updateItem(id, updateModel);
  },

  undo(dataSource) {
    const { graph } = dataSource;
    const { id, originModel } = this.params;

    graph.updateItem(id, originModel);
  },
};

commandManager.register('update', updateCommand);
