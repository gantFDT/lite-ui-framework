import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Input, Icon, Switch, Button, Tooltip, Form, Divider } from 'antd'
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { SmartModal } from '@/components/specific'
import { cloneDeep, findIndex } from 'lodash'
import styles from './index.less'
const FormItem = Form.Item;
const TextArea = Input.TextArea
const errortipsText = tr("选项名称不能为空");
interface Value {
	label: string,
	value: string | number,
	select?: boolean,
}
interface SelectEditProps {
	value?: Value[],
	defalueValue?: Value[],
	onChange?: (value: Value[]) => void,
	multiple: boolean,
	title?: string
}
const initeDefalueValue: Value[] = [
	
]
const SortableItem = SortableElement(({ value: item, onItemChange, indexKey: index, onItemDelete }: any) => <FormItem required
	validateStatus={item.value ? "success" : "error"}
	help={item.value ? "" : errortipsText}
>
	<div className={styles.col} >
		<span className={styles.selectEditInput} ><Input onChange={e => onItemChange(e.target.value, index)} value={item.value} /></span>
		<span className={styles.selecEditMinus}  ><Icon onClick={onItemDelete} type="minus-circle" /></span>
	</div>
</FormItem>);
const SortableList = SortableContainer(({ items, onItemChange, onItemDelete }: any) => {
	return (
		<div className={styles.row} >
			{items.map((value: any, index: number) => (
				<SortableItem
					key={`item-${value}`}
					index={index}
					indexKey={index}
					onItemDelete={onItemDelete}
					onItemChange={onItemChange} value={value} />
			))}
		</div>
	);
});
const colSortable = (array: any[], from: number, to: number) => {
	const cols = cloneDeep(array);
	cols.splice(to < 0 ? cols.length + to : to, 0, cols.splice(from, 1)[0])
	return cols
}

const SelectEdit: React.SFC<SelectEditProps> = ({ value = null, defalueValue = initeDefalueValue, onChange, title}, ref: any) => {
	const [items, setItems] = useState(defalueValue);
	const [errors, setErrors] = useState([] as number[]);
	const [textValue, setTextValue] = useState("");
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		if (value !== null) {
			setItems(value)
		}
	}, [value])
	const onSortEnd = useCallback(
		({ oldIndex, newIndex }: any) => {
			const newItems = colSortable(items, oldIndex, newIndex);
			setItems(newItems)
		},
		[setItems, items],
	)
	const onItemChange = useCallback((value: string, index: number) => {
		const item = {
			label: value,
			value: value
		}
		const newItems = [...items.slice(0, index), item, ...items.slice(index + 1)]
		setItems(newItems);
		onChange && onChange(newItems);
		// 判断是否必填
		const errorIndex = errors.indexOf(index);
		if (value && errorIndex >= 0) setErrors([...errors.slice(0, errorIndex), ...errors.slice(errorIndex + 1)]);
		if (!value && errorIndex < 0) setErrors([index, ...errors]);
	}, [items, onChange, errors])
	const onItemDelete = useCallback((index: number) => {
		const newItems = [...items.slice(0, index), ...items.slice(index + 1)]
		setItems(newItems);
		onChange && onChange(newItems);
	}, [items, onChange])
	const onItemAdd = useCallback(() => {
		const len = items.length;
		const text = `${tr("选项")}${len}`
		const item = { label: text, value: text }
		const newItems = [item, ...items];
		setItems(newItems);
		onChange && onChange(newItems);
	}, [items, onChange]);
	const batchText = useMemo(() => {
		let text = "";
		items.map((item, index) => {
			const symbol = (index == items.length - 1) ? "" : "，\n"
			text += item.value + symbol;
		})
		return text
	}, [items])
	const batchOpen = useCallback(() => {
		setTextValue(batchText)
		setVisible(true);
	}, [batchText]);
	const batchClose = useCallback(() => {
		setVisible(false);
	}, [batchText]);
	const onBatchChange = useCallback(e => {
		setTextValue(e.target.value)
	}, [])
	const handleBatch = useCallback(() => {
		let value = textValue;
		value = value.replace(/[\r\n]/g, '')
		value = value.replace(/\，/g, ',')
		const array = value.split(",");
		const newItems: any[] = [];
		array.map(item => {
			const itemIndex = findIndex(newItems, { value: item });
			if (item && itemIndex < 0) newItems.push({ label: item, value: item })
		})
		setItems(newItems);
		setVisible(false);
		onChange && onChange(newItems)
	}, [textValue, onChange])
	return <div>
		<div className={styles.title} >
			<span className={styles.left} >{title}</span>
			<span className={styles.right} >
				<Tooltip title={tr("新增")} >
					<Button className="marginh5" onClick={onItemAdd} size="small" icon="plus" ></Button>
				</Tooltip>
				<Button className="marginh5" size="small" onClick={batchOpen} >
					{tr("批量新增")}
				</Button>
			</span>
		</div>
		<Divider />
		<SortableList
			items={items}
			onItemChange={onItemChange}
			onItemDelete={onItemDelete}
			onSortEnd={onSortEnd} />
		<SmartModal
			id='ImageSelectorCmp'
			itemState={{
				height: 310,
				width: 500
			}}
			title={tr('批量编辑')}
			visible={visible}
			maskClosable={false}
			onCancel={batchClose}
			onOk={handleBatch}
		>
			<TextArea
				value={textValue}
				onChange={onBatchChange}
				autoSize={{ maxRows: 11, minRows: 11 }} rows={11} />
		</SmartModal>
	</div>
}

export default React.forwardRef(SelectEdit)
