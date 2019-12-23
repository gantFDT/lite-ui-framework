import { Modal } from 'antd';
import { GraphState } from '../../../common/constants';
import { CommandDataSource } from '../../../common/interface';
import commandManager from '../../../common/commandManager';
import { baseCommand, BaseCommand } from './base';

interface CommandParams { }

interface CommandProps extends BaseCommand<CommandParams> {
  create: (dataSource: CommandDataSource) => void;
}

const Command: CommandProps = {
  ...baseCommand,

  params: {},

  init() {

  },

  canExecute() {
    return true;
  },

  canUndo() {
    return false;
  },

  create(dataSource) {
    const { graph, workflowTemplateData, setWorkflowTemplateData, setDesignId, setDesignName, setGraphState } = dataSource;
    if (!graph) return;

    setWorkflowTemplateData({ "name": "", "stopFunction": {}, "sequence": [], "withGrid": workflowTemplateData.withGrid })
    setDesignId(null)
    setDesignName(null)

    setGraphState(GraphState.CanvasSelected)

    graph.clear();
    graph.read({
      nodes: [
        {
          id: "START",
          label: tr("开始"),
          shape: "_type_start",
          size: [120, 50],
          x: 200,
          y: 100,
        },
        {
          id: "END",
          label: tr("结束"),
          shape: "_type_end",
          size: [120, 50],
          x: 200,
          y: 400
        },
      ]
    })
  },

  execute(dataSource) {
    const { graph, designId } = dataSource;
    if (graph && designId && !this.isEmptyCanvas(graph)) {
      Modal.confirm({
        title: tr(`是否保存当前页面工作流?`),
        centered: true,
        okText: tr('是'),
        cancelText: tr('否'),
        okButtonProps: { size: 'small' },
        cancelButtonProps: { size: 'small' },
        onOk: () => {
          this.saveGraphData(dataSource, () => {
            this.create(dataSource);
          })
        },
        onCancel: () => {
          this.create(dataSource);
        }
      })
    } else {
      this.create(dataSource);
    }
  },

  undo(dataSource) {
    const { graph } = dataSource;

  },
};

commandManager.register('create', Command);
