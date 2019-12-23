import { Modal } from 'antd';
import { SelectBehaviorState } from '../../../common/constants';
import { CommandDataSource } from '../../../common/interface';
import commandManager from '../../../common/commandManager';
import { baseCommand, BaseCommand } from './base';

interface CommandParams { }

interface CommandProps extends BaseCommand<CommandParams> {

}

const Command: CommandProps = {
  ...baseCommand,

  params: {},

  init() {

  },

  canExecute(dataSource) {
    const { brushState } = dataSource;
    return brushState === SelectBehaviorState.Move;
  },

  canUndo() {
    return false;
  },

  execute(dataSource) {
    const { graph, setBrushState } = dataSource;
    if (graph) {
      setTimeout(() => {
        graph.setMode('onlyBrush');
        setBrushState(SelectBehaviorState.Brush);
      }, 1);
    }
  },
};

commandManager.register('multiSelect', Command);
