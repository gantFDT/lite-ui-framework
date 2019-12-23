import { clone, isEmpty } from 'lodash';

export const parseFlowData = (sourceData: any, opts?: any) => {
  const { nodes = [] } = sourceData;
  const { currentStepIds, lastActionId, historyActionIds } = opts || {};
  const targetData: any = {
    nodes: [],
    edges: []
  }

  nodes.forEach((node: any) => {
    var newNode = clone(node);
    if (newNode.size) newNode.size = newNode.size.split('*');
    if (currentStepIds && currentStepIds.some((sId: string) => sId === newNode.id)) {
      newNode.isCurrent = true;
    }
    for (var key in newNode) {
      if (key == 'connections') {
        newNode.stepSequence = [];
        for (var i = 0; i < node[key].length; i++) {
          var edge = clone(node[key][i]);
          if (historyActionIds && historyActionIds.some((eId: string) => eId === edge.id)) {
            edge.isHandled = true;
          }
          if (lastActionId && lastActionId === edge.id) {
            edge.isLast = true;
          }
          edge.source = node.id;
          if (edge.actionType) {
            edge.shape = edge.actionType;
          } else {
            edge.shape = "flow-edge";
          }
          if (edge.name) {
            edge.label = edge.name
          }
          delete edge.name
          if (!isEmpty(edge.targetId)) {
            edge.target = edge.targetId;
            delete edge.targetId;
          }
          if (!isEmpty(edge.bendpoints)) {
            edge.controlPoints = edge.bendpoints;
          }
          delete edge.bendpoints;
          targetData.edges.push(edge);
          newNode.stepSequence.push({ id: edge.id })
        }
        delete newNode[key];
      } else if (key == 'name') {
        if (newNode.name) {
          newNode.label = newNode.name
        }
        delete newNode.name;
      } else if (key == 'nodeType') {
        newNode.shape = newNode.nodeType
        delete newNode.nodeType;

      } else if (key == 'rectangle') {
        newNode.x = newNode[key].x + newNode[key].w / 2;
        newNode.y = newNode[key].y + newNode[key].h / 2;
        newNode.size = [newNode[key].w, newNode[key].h];
        delete newNode.rectangle;
      }
    }
    targetData.nodes.push(newNode);
  });
  for (var key in sourceData) {
    if (key != 'nodes') {
      targetData[key] = sourceData[key]
    }
  }
  return targetData;
};