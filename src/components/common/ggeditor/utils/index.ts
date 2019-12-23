import G6 from '@antv/g6';
import { isEmpty, clone } from 'lodash';
import { notification } from 'antd';
import { EditorEvent, ItemState, ItemType } from '../common/constants';
import { Edge, Graph, GraphNativeEvent, Item, Node, NodeModel } from '../common/interface';

/** 生成唯一标识 */
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy\-]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/** 拼接查询字符 */
export const toQueryString = (obj: object) =>
  Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');

/** 添加事件监听 */
export function addListener<T>(target: Graph, eventName: EditorEvent | GraphNativeEvent, handler: T | undefined) {
  if (typeof handler === 'function') {
    target.on(eventName, handler);
  }
}

/** 判断是否脑图 */
export function isMind(graph: Graph) {
  return graph.constructor === G6.TreeGraph;
}

/** 判断是否节点 */
export function isNode(item: Item) {
  return item.getType() === ItemType.Node;
}

/** 判断是否边线 */
export function isEdge(item: Item) {
  return item.getType() === ItemType.Edge;
}

/** 获取选中节点 */
export function getSelectedNodes(graph: Graph) {
  return graph.findAllByState<Node>(ItemType.Node, ItemState.Selected);
}

/** 获取选中边线 */
export function getSelectedEdges(graph: Graph) {
  return graph.findAllByState<Edge>(ItemType.Edge, ItemState.Selected);
}

/** 判断是否是空白的画布 */
export function isEmptyCanvas(graph: Graph) {
  return !graph.find('node', node => node.get('currentShape') !== "_type_start" && node.get('currentShape') !== "_type_end");
}

/** 获取高亮边线 */
export function getHighlightEdges(graph: Graph) {
  return graph.findAllByState<Edge>(ItemType.Edge, ItemState.HighLight);
}

/** 执行批量处理 */
export function executeBatch(graph: Graph, execute: Function) {
  graph.setAutoPaint(false);

  execute();

  graph.paint();
  graph.setAutoPaint(true);
}

/** 获取菱形路径 */
export function getDiamondPath(width: number, height: number, radiuRate?: number) {
  let path: any[][] = [];

  radiuRate = radiuRate || 12;
  const a = width / 2;
  const b = height / 2;
  const rx = width / radiuRate;
  const ry = height / radiuRate;

  path.push(['M', -rx, ry - b]);
  path.push(['Q', 0, -b, rx, ry - b]); // 上侧点
  path.push(['L', a - rx, -ry]);
  path.push(['Q', a, 0, a - rx, ry]); // 右侧点
  path.push(['L', rx, b - ry]);
  path.push(['Q', 0, b, -rx, b - ry]); // 下侧点
  path.push(['L', rx - a, ry]);
  path.push(['Q', -a, 0, rx - a, -ry]); // 左侧点
  path.push(['Z']); // 封闭

  return path;
}

export function recursiveTraversal(root, callback) {
  if (!root) {
    return;
  }

  callback(root);

  if (!root.children) {
    return;
  }

  root.children.forEach(item => recursiveTraversal(item, callback));
}

//生成模板结构数据
export function buildStruct(graph: Graph) {
  const itemMap = graph.get("itemMap");
  if (itemMap) {
    const startNode = itemMap.START;
    if (startNode) {
      //存储不重复ID
      let idArr:string[] = [];
      let nodes:any[] = [];
      //递归调用获取下一节点方法
      const buildStructFn = (sourceItem: any, parentId: string, nodes: any[], lastParentObj?: any) => {
        if (!lastParentObj) {
          lastParentObj = {
            id: 'root'
          };
        }
        if (!lastParentObj.parent) {
          lastParentObj.parent = {
            id: 'root'
          };
        }
        if (!lastParentObj.parentNodes) {
          lastParentObj.parentNodes = nodes;
        }
        let outEdges = sourceItem.getOutEdges();
        outEdges.forEach((edge: any) => {
          const edgeTarget = edge.getTarget();
          if(edgeTarget){
            const edgeShape = edge.get('currentShape');
            const {
              id: targetId,
              shape: targetShape,
            } = edgeTarget.getModel();
            //判断id是否使用
            if (!idArr.includes(targetId)) {
              //判断连接线类型
              //批准
              if (edgeShape == "approve") {
                if (targetShape == "_type_step") { //任务节点
                  const sourceShape = sourceItem.getModel().shape;
                  let direct = false;
                  if (sourceShape == "_type_split") {
                    direct = true;
                  }
                  let obj = {
                    id: targetId,
                    parent: parentId,
                    "direct": direct,
                    "children": []
                  };
                  nodes.push(obj);
                  idArr.push(targetId);
                  buildStructFn(edgeTarget, parentId, nodes, lastParentObj);
                } else if (targetShape == "_type_split") { //分支节点
                  let obj = {
                    id: targetId,
                    parent: parentId,
                    "direct": false,
                    "children": []
                  };
                  nodes.push(obj);
                  idArr.push(targetId);
                  lastParentObj = {
                    id: targetId,
                    parent: lastParentObj
                  };

                  let splitNodes = obj.children;
                  buildStructFn(edgeTarget, targetId, splitNodes, lastParentObj);
                } else if (targetShape == "_type_join") { //合并节点
                  idArr.push(targetId);
                  buildStructFn(edgeTarget, lastParentObj.parent.id, lastParentObj.parent.parentNodes, lastParentObj.parent);
                } else { //结束节点
                  idArr.push(targetId);
                }
              } else { //否决或取消
                if (targetShape == "_type_step") { //任务节点
                  let obj = {
                    id: targetId,
                    parent: "root",
                    "direct": false,
                    "children": []
                  };
                  nodes.push(obj);
                  idArr.push(targetId);
                  buildStructFn(edgeTarget, "root", nodes);
                } else if (targetShape == "_type_split") { //分支节点
                  let obj = {
                    id: targetId,
                    parent: "root",
                    "direct": false,
                    "children": []
                  };
                  nodes.push(obj);
                  idArr.push(targetId);
                  let splitNodes = obj.children;
                  buildStructFn(edgeTarget, targetId, splitNodes);
                }
              }
            }

          }
        })
      }
      buildStructFn(startNode, "root", nodes);
      return nodes;
    }
  }
  return false;
}

//将G6工作流图形数据转换成工作流设计器的数据格式
export function revertWorkflowJsonData(data: any) {
  var obj = {
    nodes: []
  };
  if (isEmpty(data) || !data.nodes) {
    return notification.error({ message: tr('页面没有数据！')});
  }
  data.nodes.forEach(function (node: any) {
    var newNode = clone(node);
    newNode.connections = [];
    if (isEmpty(data.edges)) {
      data.edges = []
    }
    for (var i = 0; i < data.edges.length; i++) {
      var edge = clone(data.edges[i]);
      if (edge.source == node.id) {
        if (edge.shape != "flow-edge") {
          edge.actionType = edge.shape;
          delete edge.shape
        }
        //不同类型edge的属性

        //批准
        if (edge.actionType == "approve") {
          if (isEmpty(edge.selectAccepter)) {
            edge.selectAccepter = {
              "type": "automatism",
              "steps": []
            }
          }
          if (isEmpty(edge.approveComment)) {
            edge.approveComment = false;
          }
          if (isEmpty(edge.approvePrompt)) {
            edge.approvePrompt = "";
          }
          if (isEmpty(edge.defaultAction)) {
            edge.defaultAction = false;
          }

        }

        //否决
        if (edge.actionType == "reject") {
          if (isEmpty(edge.selectAccepter)) {
            edge.selectAccepter = {
              "type": "automatism",
              "steps": []
            }
          }
          if (isEmpty(edge.influenceScope)) {
            edge.influenceScope = "part";
          }
          if (isEmpty(edge.approveComment)) {
            edge.approveComment = false;
          }
        }

        if (edge.label) {
          edge.name = edge.label
          delete edge.label
        } else {
          edge.name = "";
        }
        //连接线的起点状态和目标状态
        if (!isEmpty(edge.source)) {
          if (edge.source.indexOf("ST") == 0) {
            edge.sourceStatus = edge.source + "_END";
          } else {
            edge.sourceStatus = "";
          }
        }
        if (!isEmpty(edge.target)) {
          if (edge.target.indexOf("ST") == 0) {
            edge.targetStatus = edge.target + "_BEGIN";
          } else {
            edge.targetStatus = "";
          }
        }

        //目标状态
        if (!isEmpty(edge.target)) {
          if (edge.target.indexOf("ST") == 0) {
            edge.targetType = "step";
          } else if (edge.target.indexOf("SP") == 0) {
            edge.targetType = "split";
          } else if (edge.target.indexOf("JO") == 0) {
            edge.targetType = "join";
          } else {
            edge.targetType = "step";
          }
        }

        if (!isEmpty(edge.target)) {
          edge.targetId = edge.target;
          delete edge.target;
        }

        //操作条件
        if (isEmpty(edge.condition)) {
          edge.condition = {
            "functions": [],
            "type": "logicValue",
            "logicValue": true,
            "functionRelation": "OR"
          }
        }

        //操作前执行函数
        if (isEmpty(edge.preFunction)) {
          edge.preFunction = {
            "functions": []
          }
        }
        //操作后执行函数
        if (isEmpty(edge.postFunction)) {
          edge.postFunction = {
            "functions": []
          }
        }
        //折点
        if (!isEmpty(edge.controlPoints)) {
          edge.bendpoints = edge.controlPoints;
          delete edge.controlPoints;
        } else {
          edge.bendpoints = [];
        }
        delete edge.source;
        delete edge.index;
        newNode.connections.push(edge);
      }
    }

    if (newNode.label) {
      newNode.name = newNode.label
      delete newNode.label;
    } else {
      newNode.name = "";
    }
    if (newNode.shape) {
      newNode.nodeType = newNode.shape
      delete newNode.shape;
    } else {
      newNode.nodeType = "";
    }

    //动作顺序
    if (!isEmpty(newNode.stepSequence)) {
      if (!isEmpty(newNode.connections)) {
        newNode.connections.sort((a, b) => { return newNode.stepSequence.indexOf(a.id) - newNode.stepSequence.indexOf(b.id) })
      }
    }
    delete newNode.stepSequence;

    //设置节点的默认属性值
    if (newNode.nodeType == "_type_step") {
      if (isEmpty(newNode.description)) {
        newNode.description = "";
      }
      if (isEmpty(newNode.withdraw)) {
        newNode.withdraw = false;
      }
      if (isEmpty(newNode.timeout)) {
        newNode.timeout = 0;
      }
      if (isEmpty(newNode.multipleInstances)) {
        newNode.multipleInstances = false;
      }
      if (isEmpty(newNode.multipleInstancesType)) {
        newNode.multipleInstancesType = "parallel";
      }
      if (isEmpty(newNode.dispatch)) {
        newNode.dispatch = true;
      }
      if (isEmpty(newNode.freeReject)) {
        newNode.freeReject = false;
      }
      if (isEmpty(newNode.skip)) {
        newNode.skip = false;
      }
      if (isEmpty(newNode.feedback)) {
        newNode.feedback = false;
      }
      if (isEmpty(newNode.approvalOnly)) {
        newNode.approvalOnly = false;
      }
      if (isEmpty(newNode.operator)) {
        newNode.operator = {
          "functions": [],
          "type": "user",
          "userList": []
        }
      } else {
        if (newNode.operator.userList.length > 0) {
          for (let index = 0; index < newNode.operator.userList.length; index++) {
            var user = newNode.operator.userList[index];
            if (!isEmpty(user['userLoginName'])) {
              user['userId'] = user['userLoginName'];
              delete user.userLoginName;
            }
          }
        }

      }
    }

    //JOIN 合并节点
    if (newNode.nodeType == "_type_join") {
      if (isEmpty(newNode.condition)) {
        newNode.condition = {
          "functions": [
          ],
          "type": "default",
          "logicValue": true,
          "functionRelation": "OR"
        }
      }
    }

    //END 结束节点
    if (newNode.nodeType == "_type_end") {
      if (isEmpty(newNode.endFunction)) {
        newNode.endFunction = {
          "functions": []
        }
      }
    }

    if (!isEmpty(newNode.size) && newNode.x && newNode.y) {
      var w = newNode.size[0],
        h = newNode.size[1];
      newNode.rectangle = {};
      newNode.rectangle.w = parseFloat(w);
      newNode.rectangle.h = parseFloat(h);
      newNode.rectangle.x = newNode.x - w / 2;
      newNode.rectangle.y = newNode.y - h / 2;
      delete newNode.x;
      delete newNode.y;
      delete newNode.size;
    }
    delete newNode.index;
    obj.nodes.push(newNode);
  });
  delete data.edges;

  //全局属性
  for (var key in data) {
    if (key != 'nodes') {
      obj[key] = data[key]
    }
  }

  if (isEmpty(obj.stopFunction)) {
    obj.stopFunction = {
      "functions": []
    }
  }
  if (isEmpty(obj.sequence)) {
    obj.sequence = []
  }
  if (isEmpty(obj.struct)) {
    obj.struct = []
  }

  return obj;
}
