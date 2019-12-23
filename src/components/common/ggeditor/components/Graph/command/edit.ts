import { buildStruct, revertWorkflowJsonData } from '../../../utils';
import { isEmpty } from 'lodash';
import { notification } from 'antd';
import {  } from '../../../common/constants';
import { Graph, CommandDataSource } from '../../../common/interface';
import commandManager from '../../../common/commandManager';
import { updateDeployTemplateAPI } from '@/pages/sysmgmt/workflow/g6editormanage/service';
import { baseCommand, BaseCommand } from './base';

interface CommandParams {}

interface CommandProps extends BaseCommand<CommandParams> {
  checkApprove(graph: Graph): boolean;
  edit(dataSource: CommandDataSource, data: any): void;
}

const command: CommandProps = {
  ...baseCommand,

  params: {},

  canExecute(dataSource) {
    const { graph } = dataSource;
    return !this.isEmptyCanvas(graph);
  },

  canUndo() {
    return false;
  },

  init(dataSource) {

  },

  //判断流程是否可以从开始到结束批准通过
	checkApprove(graph: Graph) {
    const itemMap = graph.get("itemMap");
		if (itemMap) {
			const startNode = itemMap.START;
			if (startNode) {
				let approve = false;
				let checkNextFn = (sourceItem: any) => {
					let outEdges = sourceItem.getOutEdges();
					outEdges.forEach((edge: any) => {
            const edgeTarget = edge.getTarget();
            const edgeShape = edge.get('currentShape');
						if (!approve && edgeShape === 'approve') {
              if (edgeTarget && edgeTarget.get('id') === "END") {
                approve = true;
                return approve;
              } else {
                checkNextFn(edgeTarget);
              }
						}
					})
				}
				checkNextFn(startNode);
				return approve;
			}
		}
		return false;
  },

  edit(dataSource, flowData){
    const { graph, designId, setDesignId, setDesignName, designName, workflowTemplateData, setCustomModalProps  } = dataSource;
    var jsonData: any = {};
    if (flowData.id) {
      var idArr = flowData.id.split(',');
      var index = idArr.indexOf(flowData.contentId);
      if (index > -1) {
        idArr.splice(index, 1);
      }
      jsonData.templateId = idArr[0];
    } else {
      return notification.error({message: tr('没有模板ID！')});
    }

    let data = graph.save();
    if (isEmpty(data)) {
      return notification.error({message: tr('页面没有数据！')});
    }

    //更新模板方法
    var withDesignNameFn = (designName) => {
      if (designId) {
        jsonData.designId = designId
      }
      if (designName) {
        jsonData.designName = designName
      }
      //设计模板信息
      //根据页面数据获取结构struct TODO
      if (!workflowTemplateData.struct) {
        workflowTemplateData.struct = {
          "id": "root",
          "nodes": []
        }
      }
      //检查模板是否可以批准通过
      if (!this.checkApprove(graph)) {
        return notification.error({message:tr("当前流程模板不能完成批准！")});
      }
  
      //递归调用获取下级节点方法,生成结构数据struct
      let nodes;
      try {
        nodes = buildStruct(graph);
      } catch (e) {
        return notification.error({message:tr("流程模板不符合规范！")});
      }
      if (!nodes) {
        return notification.error({message:tr("没有开始节点数据！")});
      }
  
      if(workflowTemplateData.struct)
        workflowTemplateData.struct.nodes = nodes;
      else
        workflowTemplateData.struct = {id: "root", nodes: []};

      //将g6数据转坏为设计模板信息
      for (let key in workflowTemplateData) {
        if (key != "nodes" && key != "edges") {
          data[key] = workflowTemplateData[key];
        }
      }

      let workflowJsonData = revertWorkflowJsonData(data);
      if (isEmpty(workflowJsonData)) {
        return notification.error({message:tr("没有设计模板数据！")});
      }

      jsonData.content = workflowJsonData;
      //获取画布图片base64数据
      let base64Data = graph.toDataURL();
      base64Data = base64Data.replace('image/png', 'image/octet-stream');
      jsonData.imageBase64 = base64Data;
      updateDeployTemplateAPI(jsonData).then(designId => {
        notification.success({message: tr('更新流程设计模板成功!')})
        //页面设置设计模板id和name
        setDesignId(designId);
        setDesignName(designName);

        setCustomModalProps('promptModal', { visible: false });
        setCustomModalProps('flowTempModal', { visible: false });
      })
    }

    if(!designName){
      setCustomModalProps('promptModal', {
        visible: true,
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
        onOk: ({ name }) => withDesignNameFn(name)
      })
    }
    else withDesignNameFn(designName)
  },

  execute(dataSource) {
    const { setCustomModalProps } = dataSource;
    setCustomModalProps(`flowTempModal`, {
      visible: true,
      onlyRowData: true,
      onOk: flowData => this.edit(dataSource, flowData)
    });
  },

  undo(dataSource) {

  },
};

commandManager.register('edit', command);