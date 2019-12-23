import { buildStruct, revertWorkflowJsonData } from '../../../utils';
import { isEmpty } from 'lodash';
import { notification } from 'antd';
import {  } from '../../../common/constants';
import { Graph, CommandDataSource } from '../../../common/interface';
import commandManager from '../../../common/commandManager';
import { releaseDesignTemplateAPI } from '@/pages/sysmgmt/workflow/g6editormanage/service';
import { baseCommand, BaseCommand } from './base';

interface CommandParams {}

interface CommandProps extends BaseCommand<CommandParams> {
  checkApprove(graph: Graph): boolean;
  publish(dataSource: CommandDataSource): void;
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

  publish(dataSource){
    const { graph, designName, setDesignId, setDesignName, workflowTemplateData, setCustomModalProps } = dataSource;
    if(!graph) return;

    let data: any = graph.save();
    
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

    let localDesignName = designName;

    const withQueryDataFn = ({
      strategy,
      templateCategory,
      templateKey,
      templateName,
    }: any) => {
      //获取画布图片base64数据
      let base64Data = graph.toDataURL();
      base64Data = base64Data.replace('image/png', 'image/octet-stream');

      let params: any = {
        designName: localDesignName,
        imageBase64: base64Data,
        content: workflowJsonData,
        templateCategory,
        templateKey,
        templateName,
      }
      strategy && (params.strategy = 'on');
      releaseDesignTemplateAPI(params).then(designId => {
        notification.success({message: tr('发布流程设计模板成功!')})
        //页面设置设计模板id和name
        setDesignId(designId);
        setDesignName(designName);
        setCustomModalProps('promptModal', { visible: false });
      })
    }

    const withDesignNameFn = (inputValue: string) => {
      localDesignName = inputValue;

      setCustomModalProps('promptModal', { visible: false });
      setCustomModalProps('promptModal', {
        visible: true,
        width: 600,
        height: 332,
        modalTitle: tr('发布流程设计模板'),
        formTitle: tr('模板发布信息'),
        schema: {
          type: "object",
          required: ["templateName","templateKey","templateCategory"],
          propertyType: {
            templateName: {
              title: tr('流程模板名称'),
              type: "string",
              componentType: "Input",
            },
            templateKey: {
              title: tr('流程模板Key'),
              type: "string",
              componentType: "Input",
            },
            templateCategory: {
              title: tr('流程业务类型'),
              type: "string",
              componentType: "CodeList",
              props: {
                type: "FW_WORKFLOW_BUSINESS_TYPE",
                allowClear: false
              }
            },
            strategy: {
              title: tr('可指定代办人员'),
              type: "string",
              componentType: "Switch",
              props: {
                checkedChildren: tr('是'),
                unCheckedChildren: tr('否')
              }
            }
          }
        },
        onOk: withQueryDataFn
      })
    }

    if(!designName){
      setCustomModalProps('promptModal', {
        visible: true,
        width: 600,
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
        onOk: ({ name }) => withDesignNameFn(name)
      })
    }
    else withDesignNameFn(designName)
  },

  execute(dataSource) {
    this.publish(dataSource)
  },

  undo(dataSource) {

  },
};

commandManager.register('publish', command);