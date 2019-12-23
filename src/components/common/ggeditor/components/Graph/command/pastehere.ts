import { cloneDeep } from 'lodash';
import commandManager from '../../../common/commandManager';
import { baseCommand, BaseCommand } from './base';

interface CommandParams { }
interface Point {
  x: number;
  y: number;
}

interface CommandProps extends BaseCommand<CommandParams> {
  getMinPoint(points: Point[]): any
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

  getMinPoint(points: { model: Point }[]){
    if(points.length === 1) return points[0].model;
    return points.reduce((T,C) => {
      const TModel = T.model;
      const CModel = C.model;
      if(CModel.x * CModel.x + CModel.y * CModel.y < TModel.x * TModel.x + TModel.y * TModel.y){
        return CModel;
      }
      return TModel;
    });
  },

  execute(dataSource) {
    const { graph, executeCommand, contextMenuState } = dataSource;
    if (graph) {
      const { clientX, clientY } = contextMenuState;
      const canvasPoint = graph.getPointByClient(clientX, clientY)
      const { clipboard } = graph.get("_command");
      const pasteData = cloneDeep(clipboard);

      const { x: minX, y: minY} = this.getMinPoint(clipboard);
      pasteData.forEach((V: any) => {
        const model = V.model;
        model.x  += canvasPoint.x - minX;
        model.y  += canvasPoint.y - minY;

        executeCommand('add', V)
      });
      graph.set("_command",{})
    }
  },
};

commandManager.register('pasteHere', Command);
