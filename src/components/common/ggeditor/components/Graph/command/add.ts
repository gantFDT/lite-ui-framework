import { uuid } from '../../../utils';
import { cloneDeep } from 'lodash';
import { ItemType, GraphState } from '../../../common/constants';
import { ItemModel } from '../../../common/interface';
import commandManager from '../../../common/commandManager';
import { baseCommand, BaseCommand } from './base';

interface AddCommandParams {
  type: ItemType;
  model: ItemModel;
}

const addCommand: BaseCommand<AddCommandParams> = {
  ...baseCommand,

  params: {
    type: ItemType.Node,
    model: {
      id: '',
    },
  },

  init(dataSource) {
    const { type, model } = this.params;
    const { graph } = dataSource;
    const { shape } = model;
    if(!graph) return;

    // 节点id，初始数据
    if (type === 'node') {
      const No = graph.findAll('node', N => N.get('model').shape === shape).length + 1;
      model.id = (shape === '_type_step' ? 'ST' : shape === '_type_split' ? 'SP' : 'JO') + No.toString().padStart(2, '0');
      if (shape === '_type_step') {
        // 默认属性
        model.description = '';
        model.operator = {};
        model.timeout = 0;
        model.multipleInstances = false;
        model.multipleInstancesType = 'parallel';
        model.dispatch = true;
        model.skip = false;
        model.feedback = false;
        model.approvalOnly = false;
      }
      if (shape === '_type_join') {
        // 默认属性
        model.condition = {
          functionRelation: "OR",
          functions: [],
          logicValue: true,
          type: 'default'
        };
      }
      model.stepSequence = [];
    } else {
      console.log('edge - model', model)
    }
  },

  execute(dataSource) {
    const { type, model } = this.params;
    const { graph, workflowTemplateData, setWorkflowTemplateData } = dataSource;
    const { shape } = model;
    if (!graph) return;
    
    if (type === 'node') {
      if (shape === '_type_step') {
        // 修改全局的流程步骤顺序属性
        let flowTempData = cloneDeep(workflowTemplateData);
        flowTempData.sequence.push({
          id: model.id
        });
        setWorkflowTemplateData(flowTempData);
      }

      graph.add(type, model);

      this.setSelectedNode(graph, model.id);
    }
  },

  undo(dataSource) {
    const { graph, setGraphState, workflowTemplateData, setWorkflowTemplateData } = dataSource;
    const { model, type } = this.params;
    if(!graph) return;

    if(type === 'node'){
      // 删除画布上的对应流程步骤
      let flowTempData = cloneDeep(workflowTemplateData);
      flowTempData.sequence.splice(flowTempData.sequence.findIndex((S: any) => S.id === model.id),1);
      setWorkflowTemplateData(flowTempData);
    }else{
      // 删除对应流程步骤
      const E = graph.findById(model.id);
      const source = E.getSource();
      const sourceModel = source.getModel();
      const sourceShape = sourceModel.shape;
      if (sourceShape !== '_type_start' && sourceShape !== '_type_end') {
        let stepSequence = sourceModel.stepSequence;
        stepSequence.splice(stepSequence.findIndex((S: any) => S.id === model.id),1)
        graph.updateItem(sourceModel.id, {
          stepSequence
        });
      }
    }

    setGraphState(GraphState.CanvasSelected);

    graph.remove(model.id);
  },
};

commandManager.register('add', addCommand);
