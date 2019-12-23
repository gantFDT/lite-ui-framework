import React, { useCallback, useMemo, useState } from 'react';
import { Card, Form, Input, Switch, InputNumber } from 'antd';
import { Select, EditStatus } from 'gantd';
import { CodeList } from '@/components/form';
import { withEditorContext, Grid } from '@/components/common/ggeditor';
import { Node, Edge, GraphReactEventProps } from '@/components/common/ggeditor/common/interface';
import FunctionSelector from '../functionselector';
import OperatorSelector from '../operatorselector';
import SequenceSelector from '../sequenceselector';
import AccepterSelector from '../accepterselector';
import { g6Grid } from '../../index';

const { Item } = Form;

const panelFields = {
  canvas: [
    {
      fieldLabel: tr('网格背景'),
      fieldName: 'withGrid',
      componentType: 'Switch'
    },
    {
      fieldLabel: tr('流程模板名称'),
      fieldName: 'name',
      rules: [
        { required: true, message: tr('请输入流程模板名称') }
      ]
    },
    {
      fieldLabel: tr('终止流程执行函数'),
      fieldName: 'stopFunction',
      componentType: 'FunctionSelector'
    },
    {
      fieldLabel: tr('流程步骤显示顺序'),
      fieldName: 'sequence',
      componentType: 'SequenceSelector'
    },
  ],
  node: {
    common: [
      {
        fieldLabel: tr('ID'),
        fieldName: 'id',
        props: {
          disabled: true
        }
      },
      {
        fieldLabel: tr('名称'),
        fieldName: 'label',
      },
      {
        fieldLabel: tr('宽度'),
        fieldName: 'width',
        componentType: 'InputNumber',
        props: {
          min: 60,
          step: 10
        }
      },
      {
        fieldLabel: tr('高度'),
        fieldName: 'height',
        componentType: 'InputNumber',
        props: {
          min: 20,
          step: 10
        }
      }
    ],
    step: [
      {
        fieldLabel: tr('说明'),
        fieldName: 'description',
        componentType: 'TextArea',
        props: {
          autoSize: true
        }
      }, {
        fieldLabel: tr('可操作人员'),
        fieldName: 'operator',
        componentType: 'OperatorSelector'
      }, {
        fieldLabel: tr('超时（分钟）'),
        fieldName: 'timeout',
        componentType: 'InputNumber',
        hidden: true,
        props: {
          min: 0
        }
      }, {
        fieldLabel: tr('允许多实例'),
        fieldName: 'multipleInstances',
        componentType: 'Switch'
      }, {
        fieldLabel: tr('多实例执行方式'),
        fieldName: 'multipleInstancesType',
        componentType: 'CodeList',
        props: {
          type: 'FW_MULTIPLE_INSTANCES_TYPE',
          allowClear: false
        }
      }, {
        fieldLabel: tr('允许转派'),
        fieldName: 'dispatch',
        componentType: 'Switch'
      }, {
        fieldLabel: tr('允许跳过'),
        fieldName: 'skip',
        componentType: 'Switch'
      }, {
        fieldLabel: tr('必须填写审批意见'),
        fieldName: 'feedback',
        componentType: 'Switch'
      }, {
        fieldLabel: tr('流程操作'),
        fieldName: 'stepSequence',
        componentType: 'SequenceSelector'
      }, {
        fieldLabel: tr('单纯审批任务'),
        fieldName: 'approvalOnly',
        componentType: 'Switch',
      },
    ],
    end: [
      {
        fieldLabel: tr('执行函数'),
        fieldName: 'endFunction',
        componentType: 'FunctionSelector'
      }
    ],
    join: [
      {
        fieldLabel: tr('合并条件'),
        fieldName: 'condition',
        componentType: 'FunctionSelector',
        props: {
          radioOptions: [
            {
              label: tr('默认(合并步骤全部完成)'),
              value: 'default'
            },
            {
              label: tr('OR函数关系'),
              value: 'OR',
              showFuncs: true
            },
            {
              label: tr('AND函数关系'),
              value: 'AND',
              showFuncs: true
            },
          ],
          serviceName: 'Condition'
        }
      }, {
        fieldLabel: tr('流程操作'),
        fieldName: 'stepSequence',
        componentType: 'SequenceSelector'
      }
    ],
    split: [
      {
        fieldLabel: tr('流程操作'),
        fieldName: 'stepSequence',
        componentType: 'SequenceSelector'
      },
    ]
  },
  edge: {
    common: [
      {
        fieldLabel: tr('ID'),
        fieldName: 'id',
        props: {
          disabled: true
        }
      }, {
        fieldLabel: tr('名称'),
        fieldName: 'label',
      }, {
        fieldLabel: tr('类型'),
        fieldName: 'type',
        componentType: 'MapValue',
        props: {
          disabled: true,
          mapValues: {
            approve: tr('批准操作'),
            reject: tr('否决操作'),
            cancel: tr('作废操作'),
            default: tr('其他操作'),
          }
        }
      }, {
        fieldLabel: tr('操作条件'),
        fieldName: 'condition',
        componentType: 'FunctionSelector',
        props: {
          radioOptions: [
            {
              label: 'TRUE',
              value: true
            },
            {
              label: 'FALSE',
              value: false
            },
            {
              label: tr('OR函数关系'),
              value: 'OR',
              showFuncs: true
            },
            {
              label: tr('AND函数关系'),
              value: 'AND',
              showFuncs: true
            },
          ],
          serviceName: 'LogicCondition'
        }
      }, {
        fieldLabel: tr('操作前执行函数'),
        fieldName: 'preFunction',
        componentType: 'FunctionSelector'
      }, {
        fieldLabel: tr('操作后执行函数'),
        fieldName: 'postFunction',
        componentType: 'FunctionSelector'
      }
    ],
    approve: [],
    reject: []
  }
}

//判断是不是分支节点后的任务节点
const checkAfterSp = (node: Node) => {
  let flag = false;
  const { shape } = node.getModel();
  if (shape == "_type_step") {
    flag = node.getInEdges().some((edge: Edge) =>
      edge.get('currentShape') === "approve" && edge.getSource().getModel().shape === '_type_split'
    )
  }
  return flag;
}

const MapValue = (props: any) => {
  const { value, mapValues, ...restProps } = props;
  return (
    <Input {...restProps} value={mapValues[value] || mapValues['default']} />
  )
}

const getFields = (props: any) => {
  const { nodes, edges, type, graph } = props;
  let finalFields: any[] = [];

  if (type === 'canvas') {
    finalFields = finalFields.concat(panelFields.canvas)
  }
  if (type === 'node') {
    if (!nodes.length || (nodes.length && nodes[0].destroyed)) {
      return finalFields;
    }
    const { shape } = nodes[0].getModel();
    finalFields = finalFields.concat(panelFields.node.common)

    if (shape === '_type_step') {
      finalFields = finalFields.concat(panelFields.node.step)
    } else if (shape === '_type_end') {
      finalFields = finalFields.concat(panelFields.node.end)
    } else if (shape === '_type_join') {
      finalFields = finalFields.concat(panelFields.node.join)
    } else if (shape === '_type_split') {
      finalFields = finalFields.concat(panelFields.node.split)
    }
  }
  if (type === 'edge') {
    finalFields = finalFields.concat(panelFields.edge.common)

    const currentEdge = edges.length ? edges[0] : null;
    const currentShape = currentEdge.get('currentShape');
    const sourceShape = currentEdge.getSource().getModel().shape;
    const targetShape = currentEdge.getTarget().getModel().shape;

    let afterSpEdge = false,
      afterJoEdge = false;
    let afterSpNodeEdge = false;
    let targetTaskStep = false;

    //判断是不是分支节点后的连接线
    if (sourceShape == "_type_split" || sourceShape == "_type_join") {
      afterSpEdge = true;
      if (sourceShape == "_type_join") {
        afterJoEdge = true;
      }
    } else if (sourceShape == "_type_step") {
      afterSpNodeEdge = checkAfterSp(currentEdge.getSource());
    }
    if (targetShape == "_type_join" || targetShape == "_type_end") {
      targetTaskStep = true;
    }

    if (currentShape === 'approve') {
      if (!afterSpEdge) {
        finalFields = finalFields.concat([
          {
            fieldLabel: tr('任务跳过时默认审批操作'),
            fieldName: 'defaultAction',
            componentType: 'Switch',
            hidden: afterSpNodeEdge,
          },
          {
            fieldLabel: tr('目标任务接收人'),
            fieldName: 'selectAccepter',
            componentType: 'AccepterSelector',
            hidden: targetTaskStep,
            props: {
              edge: currentEdge,
              graph
            }
          },
          {
            fieldLabel: tr('必须填写审批意见'),
            fieldName: 'approveComment',
            componentType: 'Switch',
          },
          {
            fieldLabel: tr('审批操作提示'),
            fieldName: 'approvePrompt'
          },
        ])
      }
    } else if (currentShape === 'reject') {
      if (sourceShape !== "_type_join") {
        // let hideTargetTaskStep = targetShape !== "_type_split";
        finalFields = finalFields.concat([
          {
            fieldLabel: tr('目标任务接收人'),
            fieldName: 'selectAccepter',
            componentType: 'AccepterSelector',
            hidden: targetTaskStep,
            props: {
              edge: currentEdge
            }
          }, {
            fieldLabel: tr('影响范围'),
            fieldName: 'influenceScope',
            componentType: 'Select',
            props: {
              allowClear: false,
              edit: EditStatus.EDIT,
              dataSource: [
                { value: 'part', label: tr('局部') },
                { value: 'global', label: tr('全局') }
              ]
            }
          }, {
            fieldLabel: tr('必须填写审批意见'),
            fieldName: 'approveComment',
            componentType: 'Switch'
          }
        ])
      }
    }
  }
  return finalFields;
}

const DetailForm = (props: GraphReactEventProps) => {
  const { form, executeCommand, nodes, type, graph, edges, workflowTemplateData, setWorkflowTemplateData } = props;
  const model =
    type === 'multi' ? {} :
    type === 'canvas' ? workflowTemplateData :
    type === 'node' ? nodes[0].getModel() : edges[0].getModel();

  const { id } = model;

  const [grid, setGrid] = useState(g6Grid);

  const handleSubmit = useCallback((e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    setTimeout(() => {
      form.validateFieldsAndScroll((err, values) => {
        if (err) {
          return;
        }
        if (type === 'canvas') {
          const { withGrid } = values;

          if (withGrid) {
            if (!grid) {
              const _grid = new Grid({});
              setGrid(_grid);
              graph.addPlugin(_grid);
            }
          } else {
            graph.removePlugin(grid);
            setGrid(null);
          }

          setWorkflowTemplateData({ ...model, ...values })
        } else {
          const { width, height } = values;

          executeCommand('update', {
            id,
            updateModel: {
              size: [width, height],
              ...values,
            },
          });
        }
      });
    }, 0)
  }, [model, graph])

  const renderNodeDetail = useCallback(() => {
    let finalFields = getFields(props);
    return finalFields.filter(V => !V.hidden).map(F => (
      <Item label={F.fieldLabel}>
        {
          form.getFieldDecorator(F.fieldName, {
            valuePropName: F.componentType === 'Switch' ? 'checked' : 'value',
            rules: F.rules,
          })(
            F.componentType === 'Switch' ? <Switch {...F.props} onChange={handleSubmit} /> :
              F.componentType === 'TextArea' ? <Input.TextArea {...F.props} onChange={handleSubmit} /> :
                F.componentType === 'InputNumber' ? <InputNumber {...F.props} onChange={handleSubmit} /> :
                  F.componentType === 'CodeList' ? <CodeList {...F.props} edit="EDIT" onChange={handleSubmit} /> :
                    F.componentType === 'FunctionSelector' ? <FunctionSelector {...F.props} onChange={handleSubmit} /> :
                      F.componentType === 'OperatorSelector' ? <OperatorSelector {...F.props} onChange={handleSubmit} /> :
                        F.componentType === 'SequenceSelector' ? <SequenceSelector {...F.props} onChange={handleSubmit} /> :
                          F.componentType === 'AccepterSelector' ? <AccepterSelector {...F.props} onChange={handleSubmit} /> :
                            F.componentType === 'MapValue' ? <MapValue {...F.props} /> :
                              F.componentType === 'Select' ? <Select {...F.props} onChange={handleSubmit} /> :
                                <Input {...F.props} onChange={handleSubmit} />
          )
        }
      </Item>
    ));
  }, [model, type])

  const panelTitle = useMemo(() =>
    type === 'multi' ? tr('多选') :
      type === 'canvas' ? tr('画布') :
        type === 'node' ? tr('节点') : tr('边')
  , [type])

  return (
    <Card type="inner" bodyStyle={{ height: 'calc(100% - 36px)' }} size="small" title={panelTitle} bordered={false}>
      <Form onSubmit={handleSubmit}>
        {renderNodeDetail()}
      </Form>
    </Card>
  )
}

export default withEditorContext<any>(Form.create({
  mapPropsToFields(props) {
    const { nodes, edges, type, graph, workflowTemplateData } = props;
    const model =
      type === 'multi' ? {} :
        type === 'canvas' ? workflowTemplateData :
          type === 'node' ? nodes[0].getModel() : edges[0].getModel();

    let finalFields = getFields(props);

    const formFields = finalFields.reduce((T, V) => ({
      ...T,
      [V.fieldName]: Form.createFormField({
        value: V.fieldName === 'width' ? model.size[0] : V.fieldName === 'height' ? model.size[1] : model[V.fieldName],
      })
    }), {});

    return {
      ...formFields
    };
  },
})(DetailForm));
