import { isMind, isEmptyCanvas, getSelectedNodes, getSelectedEdges, buildStruct, revertWorkflowJsonData, executeBatch } from '../../../utils';
import { Modal, notification } from 'antd';
import { isEmpty } from 'lodash';
import { ItemState, LabelState, EditorEvent, GraphState } from '../../../common/constants';
import { Node, Edge, Graph, Command, CommandDataSource } from '../../../common/interface';
import command from '../../../common/command';
import commandManager from '../../../common/commandManager';
import { parseFlowData } from '@/pages/sysmgmt/workflow/g6editormanage/utils';
import { saveDesignTemplateAPI } from '@/pages/sysmgmt/workflow/g6editormanage/service';

export interface BaseCommand<P = object, D = CommandDataSource> extends Command<P, D> {
  /** 判断是否是空白的画布 */
  isEmptyCanvas(graph: Graph): boolean;
  /** 判断是否脑图 */
  isMind(graph: Graph): boolean;
  /** 获取选中节点 */
  getSelectedNodes(graph: Graph): Node[];
  /** 获取选中连线 */
  getSelectedEdges(graph: Graph): Edge[];
  /** 设置选中节点 */
  setSelectedNode(graph: Graph, id: string): void;
  /** 编辑选中节点 */
  editSelectedNode(graph: Graph): void;
  /** 通用导入数据 */
  importGraphData(dataSource: CommandDataSource, data: any, modalType: string): void;
  /** 通用保存数据 */
  saveGraphData(dataSource: CommandDataSource, callback?: () => void): void;
}

export const baseCommand: BaseCommand = {
  ...command,

  isMind,

  isEmptyCanvas,

  getSelectedNodes,

  getSelectedEdges,

  setSelectedNode(graph: Graph, id: string) {
    const autoPaint = graph.get('autoPaint');

    graph.setAutoPaint(false);

    const selectedNodes = this.getSelectedNodes(graph);

    selectedNodes.forEach(node => {
      if (node.hasState(ItemState.Selected)) {
        graph.setItemState(node, ItemState.Selected, false);
      }
    });

    graph.setItemState(id, ItemState.Selected, true);
    graph.setAutoPaint(autoPaint);
    graph.paint();
  },

  editSelectedNode(graph: Graph) {
    const modes = graph.get('modes');
    const mode = graph.getCurrentMode();
    const behaviors = modes[mode];

    if (
      behaviors.some((behavior: any) => {
        return behavior === 'edit-label' || behavior.type === 'edit-label';
      })
    ) {
      graph.emit(EditorEvent.onLabelStateChange, {
        labelState: LabelState.Show,
      });
    }
  },

  /** 通用导入数据方法 */
  importGraphData(dataSource: CommandDataSource, data: any, modalType: string) {
    const { graph, setCustomModalProps, designId, setDesignId, setDesignName, workflowTemplateData, setWorkflowTemplateData, setGraphState } = dataSource;
    if (!graph) return;

    const importFn = () => executeBatch(graph, ()=>{
      setGraphState(GraphState.CanvasSelected);
      setCustomModalProps(modalType, { visible: false });
      const { nodes, designId, designName, ...restData } = data;
      const targetData = parseFlowData(data);
      graph.read(targetData);
      setDesignId(designId);
      setDesignName(designName);
      setWorkflowTemplateData({ ...restData, withGrid: workflowTemplateData.withGrid });
    })

    if (designId && !this.isEmptyCanvas(graph)) {
      Modal.confirm({
        title: tr(`是否保存当前页面工作流?`),
        centered: true,
        okText: tr('是'),
        cancelText: tr('否'),
        okButtonProps: { size: 'small' },
        cancelButtonProps: { size: 'small' },
        onOk: () => {
          this.saveGraphData(dataSource, () => {
            importFn()
          })
        },
        onCancel: () => {
          importFn()
        }
      })
    }
    else importFn()
  },

  /** 通用导入数据方法 */
  saveGraphData(dataSource, callback) {
    const { graph, setCustomModalProps, designName, designId, setDesignId, setDesignName, workflowTemplateData } = dataSource;
    if (!graph) return;

    let data: any = graph.save();
    if (!workflowTemplateData.name) return notification.error({ message: tr('流程模板名称不能为空！') });

    //获取结构数据struct
    if (!workflowTemplateData.struct) {
      workflowTemplateData.struct = {
        "id": "root",
        "nodes": []
      }
    }

    //递归调用获取下级节点方法,生成结构数据struct TODO
    let nodes;
    try {
      nodes = buildStruct(graph);
    } catch (e) {
      return notification.error({ message: tr("流程模板不符合规范！") });
    }
    if (!nodes) {
      return notification.error({ message: tr("没有开始节点数据！") });
    }

    if (workflowTemplateData.struct)
      workflowTemplateData.struct.nodes = nodes;
    else
      workflowTemplateData.struct = { id: "root", nodes: [] };

    //将g6数据转转为设计模板信息
    for (let key in workflowTemplateData) {
      if (key != "nodes" && key != "edges") {
        data[key] = workflowTemplateData[key];
      }
    }

    let workflowJsonData = revertWorkflowJsonData(data);
    if (isEmpty(workflowJsonData)) {
      return notification.error({ message: tr("没有设计模板数据！") });
    }

    const withDesignName = (inputValue: string) => {
      let params: any = {};
      designId && (params.id = designId);
      params.name = inputValue;
      params.content = workflowJsonData;

      // return console.log(workflowJsonData);
      saveDesignTemplateAPI(params).then(designId => {
        notification.success({ message: tr('保存流程设计模板数据成功!') })
        //页面设置设计模板id和name
        setDesignId(designId);
        setDesignName(designName);
        setCustomModalProps('promptModal', { visible: false });

        callback && callback()
      })
    }

    if (!designName) {
      setCustomModalProps('promptModal', {
        visible: true,
        height: 200,
        modalTitle: tr('请填写流程设计模板名称'),
        schema: {
          type: "object",
          required: ["name"],
          propertyType: {
            name: {
              title: tr('流程设计模板名称'),
              type: "string",
              componentType: "Input",
            }
          }
        },
        onOk: ({ name }) => withDesignName(name)
      })
    }
    else withDesignName(designName)
  }
};

commandManager.register('base', baseCommand);
