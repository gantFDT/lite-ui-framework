import { isMind, executeBatch } from '../../../utils';
import { cloneDeep } from 'lodash';
import { ItemType, GraphState } from '../../../common/constants';
import { TreeGraph, NodeModel, EdgeModel, MindNodeModel } from '../../../common/interface';
import commandManager from '../../../common/commandManager';
import { baseCommand, BaseCommand } from '../../../components/Graph/command/base';

interface RemoveCommandParams {
  flow: {
    nodes: {
      [id: string]: NodeModel;
    };
    edges: {
      [id: string]: EdgeModel;
    };
  };
  mind: {
    model: MindNodeModel | null;
    parent: string;
  };
}

const removeCommand: BaseCommand<RemoveCommandParams> = {
  ...baseCommand,

  params: {
    flow: {
      nodes: {},
      edges: {},
    },
    mind: {
      model: null,
      parent: '',
    },
  },

  canExecute(dataSource) {
    const { graph } = dataSource;
    const selectedNodes = this.getSelectedNodes(graph);
    const selectedEdges = this.getSelectedEdges(graph);

    if(selectedNodes.some(N => N.get('currentShape') === "_type_start" || N.get('currentShape') === "_type_end"))
      return false;

    return !!(selectedNodes.length || selectedEdges.length);
  },

  init(dataSource) {
    const { graph } = dataSource;
    const selectedNodes = this.getSelectedNodes(graph);
    const selectedEdges = this.getSelectedEdges(graph);

    if (isMind(graph)) {
      const selectedNode = selectedNodes[0];
      const selectedNodeModel = selectedNode.getModel<MindNodeModel>();

      const selectedNodeParent = selectedNode.get('parent');
      const selectedNodeParentModel = selectedNodeParent ? selectedNodeParent.getModel() : {};

      this.params.mind = {
        model: selectedNodeModel,
        parent: selectedNodeParentModel.id,
      };
    } else {
      const { nodes, edges } = this.params.flow;

      selectedNodes.forEach(node => {
        const nodeModel = node.getModel();
        const nodeEdges = node.getEdges();

        nodes[nodeModel.id] = nodeModel;

        nodeEdges.forEach(edge => {
          const edgeModel = edge.getModel();

          edges[edgeModel.id] = edgeModel;
        });
      });

      selectedEdges.forEach(edge => {
        const edgeModel = edge.getModel();

        edges[edgeModel.id] = edgeModel;
      });
    }
  },

  execute(dataSource) {
    const { graph, workflowTemplateData, setWorkflowTemplateData, setGraphState } = dataSource;
    if (isMind(graph)) {
      const { model } = this.params.mind;

      if (!model) {
        return;
      }

      (graph as TreeGraph).removeChild(model.id);
    } else {
      const { nodes, edges } = this.params.flow;

      setGraphState(GraphState.CanvasSelected);

      // 删除画布上的对应流程步骤
      let flowTempData = cloneDeep(workflowTemplateData);
      const selectedNodes = this.getSelectedNodes(graph);
      selectedNodes.forEach((N: any) => {
        if (N.get('currentShape') === "_type_step") {
          flowTempData.sequence.splice(flowTempData.sequence.findIndex((S: any) => S.id === N.get('id')),1)
          setWorkflowTemplateData(flowTempData);
        }
      })

      executeBatch(graph, () => {
        // 删除对应流程步骤
        const selectedEdges = this.getSelectedEdges(graph);

        selectedEdges.forEach((E: any) => {
          const source = E.getSource();
          const sourceModel = source.getModel();
          const sourceShape = sourceModel.shape;
          if (sourceShape !== '_type_start' && sourceShape !== '_type_end') {
            let stepSequence = sourceModel.stepSequence;
            stepSequence.splice(stepSequence.findIndex((S: any) => S.id === E.get('id')),1)
            graph.updateItem(sourceModel.id, {
              stepSequence
            });
          }
        });

        [...Object.keys(nodes), ...Object.keys(edges)].forEach(id => {
          graph.removeItem(id);
        });
      });
    }
  },

  undo(dataSource) {
    const { graph } = dataSource;
    if (isMind(graph)) {
      const { model, parent } = this.params.mind;

      if (!model) {
        return;
      }

      (graph as TreeGraph).addChild(model, parent);
    } else {
      const { nodes, edges } = this.params.flow;

      executeBatch(graph, () => {
        Object.keys(nodes).forEach(id => {
          const model = nodes[id];

          graph.addItem(ItemType.Node, model);
        });

        Object.keys(edges).forEach(id => {
          const model = edges[id];

          graph.addItem(ItemType.Edge, model);
        });
      });
    }
  },

  shortcuts: ['Delete', 'Backspace'],
};

commandManager.register('remove', removeCommand);
