import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Icon, Input } from 'antd'
import SelectorModal from './SelectorModal'
import styles from './style.less'
import { withEditorContext } from '@/components/common/ggeditor'

const SelectorFormItem = (props: any) => {
  const {
    graph,
    edge,
    value = {},
    onChange,
  } = props;

  const dataSource = useMemo(() => {
    let _dataSource: any[] = [],
      idSet = new Set();
      
    const pushStepData = (edge: any) => {
      let targetItem = edge.getTarget();

      const targetId = targetItem.get('id');
      const targetLabel = targetItem.getModel().label;
      if (!idSet.has(targetId)) {
        if (targetItem.getKeyShape().baseType === "_type_step") {
          _dataSource.push({
            stepId: targetId,
            stepName: targetLabel
          });
          idSet.add(targetId);
        }
        
        const outEdges = targetItem.getOutEdges();
        outEdges.forEach((_edge: any) => {
          //判断是否批准连接线的任务节点
          if (_edge.get('currentShape') === "approve") {
            pushStepData(_edge);
          }
        })
      }
    }

    //递归获取目标任务接受人数据
    pushStepData(edge)

    return _dataSource;
  },[edge, graph])
  

  const [visible, setVisible] = useState(false)

  const handlerChange = useCallback((data: any) => {
    onChange && onChange(data)
    setVisible(false)
  }, [onChange])

  const formatValue = useMemo(() => {
    return value
  }, [value])

  const showValue = useMemo(() => {
    const { type, steps } = value;
    if (type) {
      if (type === 'manual' && Array.isArray(steps)) {
        return tr('手动选择') + '[' + steps.map(V => V.stepName).join(',') + ']'
      }
      return tr('自动选择')
    } else {
      return ''
    }
  }, [value]);

  return (
    <div className={styles.selector}>
      <div className={styles.selectWrap} onClick={() => setVisible(true)}>
        <Input readOnly value={showValue} className="text-overflow-hidden" />
        <Icon className={styles.searchIcon} type="search" />
      </div>

      <SelectorModal
        onCancel={() => setVisible(false)}
        onOk={handlerChange}
        value={formatValue}
        visible={visible}
        dataSource={dataSource}
      />
    </div>
  )
}

export default withEditorContext<any>(SelectorFormItem);