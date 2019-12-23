import React, { memo, useMemo, useCallback } from 'react';
import { Icon, Select } from 'antd';
import _ from 'lodash';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { getOperatorsBySupportAndType } from '../../../utils';
import { allOperators } from '@/components/specific/smartsearch/operators';
import { SupportFilterField, SupportOrderField } from '../../../interface';
import { Operator } from '../../../operators';
import styles from './styles.less';

export interface GangedSelectorProps {
  value: any,
  index: number,
  supportFields: Array<SupportFilterField | SupportOrderField>,
  type: string,
  onSelectChange?: (value: any, index: number, isMain: boolean) => void,
  isCompatibilityMode: boolean
}

export interface SortableListProps extends GangedSelectorProps {
  fields: any,
  onCreate?: (type: string, index: number) => void,
  onRemove?: (type: string, index: number) => void,
}

const orderSource = [
  { name: tr('正序'), key: 'ASC' },
  { name: tr('倒序'), key: 'DESC' }
];

const GangedSelector = memo((props: GangedSelectorProps) => {
  const {
    value,
    index,
    type,
    supportFields,
    onSelectChange,
    isCompatibilityMode
  } = props;

  const handleMainChange = useCallback((value) => {
    onSelectChange && onSelectChange(value, index, true);
  }, [index])

  const handleMinorChange = useCallback((value) => {
    onSelectChange && onSelectChange(value, index, false);
  }, [index])
  const sources = useMemo(() => {
    let mainSource = supportFields, minorSource: Array<Operator> = [];
    if (type == 'search') {
      let supportField: any = _.find(supportFields, (item) => item.fieldName == value.fieldName);
      if (supportField) {
        minorSource = getOperatorsBySupportAndType(supportField.suppOperator, supportField.type);
      }
    } else {
      minorSource = orderSource;
    }
    return { mainSource, minorSource };
  }, [value, supportFields, type]);

  const { mainSource, minorSource } = sources;
  const { fieldName, title, operator, orderType, lockKey } = value;
  const minorValue = useMemo(() => {
    let result = undefined;
    if (type == 'search') {
      operator && (result = { label: allOperators[operator].name, key: operator });
    } else {
      if (orderType) {
        let target = _.find(orderSource, (i) => i.key == orderType);
        target && (result = { label: target.name, key: orderType });
      }
    }
    return result;
  }, [operator, orderType])

  return <>
    <div className={styles.mainSelector}>
      <Select
        key={`select-${type}-main_${lockKey}`}
        labelInValue
        value={fieldName ? { label: title, key: fieldName } : undefined}
        allowClear={false}
        onChange={handleMainChange}
      >
        {mainSource.map(item => <Select.Option
          value={item.fieldName}
          key={`${type}-main_${lockKey}`}
        >{item.title}</Select.Option>)}
      </Select>
    </div>
    {!isCompatibilityMode && (
      <div className={styles.minorSelector}>
        <Select
          key={`select-${type}-minor_${lockKey}`}
          labelInValue
          value={minorValue}
          allowClear={false}
          onChange={handleMinorChange}
        >
          {minorSource.map(item => <Select.Option
            value={item.key}
            key={`${type}-minor_${lockKey}`}
          >{item.name}</Select.Option>)}
        </Select>
      </div>
    )}
  </>
})
const DragHandler = SortableHandle(() => <Icon className={styles.dragHandler} type="menu" />)

const SortableItem = SortableElement((props: any) => {
  const { onCreate, onRemove, itemIndex, value, type, ...nextProps } = props;
  return (
    <div className={styles.sortFiledItem}>
      <GangedSelector index={itemIndex} value={value} type={type} {...nextProps} />
      <div className={styles.sortFiledItemRight}>
        <Icon type='close' onClick={onRemove.bind(null, type, itemIndex)} />
        <Icon type='plus' onClick={onCreate.bind(null, type, itemIndex)} />
        <DragHandler />
      </div>
    </div>
  )
})

const SortableList = SortableContainer(({ fields = [], ...nextProps }: SortableListProps) => <div>
  {fields.map((item: any, index: number) => <SortableItem
    key={index}
    index={index}
    itemIndex={index}
    value={item}
    {...nextProps}
  />
  )}
</div>)

export default SortableList;
