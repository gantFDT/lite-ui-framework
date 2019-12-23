import React, { useState, useRef, useCallback } from 'react'
import { Table, BlockHeader, EditStatus } from 'gantd';
import { Tooltip, Modal, Button, Popconfirm } from 'antd'
import FormSchema from './index'
import { Schema } from './interface'
import { getColumns } from './utils'
import { differenceWith, isEqual, isEmpty } from 'lodash'
import styles from './index.less'
interface SchemaTableProps {
	schema: Schema
	dataSource: any[],
	[propsname: string]: any
}
function SchemaTable(props: SchemaTableProps, ref: any) {
	const [state, setState] = useState({
		visible: false,
		formType: 'create',
		formValues: {},
		selectedRowKeys: [],
		selectedRows: []
	})
	const formNode = useRef(null)
	const { schema: { required, title, items }, titleSchema, value, onChange } = props;
	if (isEmpty(items)) return null
	const { visible, formType, formValues, selectedRowKeys, selectedRows } = state;
	const { columns, schema } = getColumns(items, required)
	const createTitle = `${tr("创建")}${title}`;
	const editTitle = `${tr("编辑")}${title}`;
	const { visible: titleVisible, extra } = titleSchema;
	const onModalOK = async () => {
		const { errors, values } = await formNode.current.validateForm();
		if (errors) return;
		if (formType === 'create') {
			onChange([...value, values])
		} else {
			const index = selectedRowKeys[0];
			onChange([...value.slice(0, index), values, ...value.slice(index + 1)])
		}
		onCancel()

	}
	const onDelete = useCallback(() => {
		const seletValues = selectedRows.map(({ key, ...item }) => ({ ...item }));
		const newValues = differenceWith(value, seletValues, isEqual)
		onChange(newValues)
	}, [state, value])
	const onCancel = useCallback(() => setState(({
		...state,
		visible: false,
		formType: "create",
		formValues: {}
	})), [state])
	return <div className={styles.schemaTable} ref={ref} >
		<Table
			headerLeft={titleVisible ? <BlockHeader title={title} /> : null}
			heade
			dataSource={value.map((item: any, index: number) => ({ ...item, key: index }))}
			headerRight={titleVisible ? <>
				{extra}
				<Tooltip placement='bottom' title={createTitle}  >
					<Button size="small" className="marginH5" icon='plus' onClick={() => setState(() => ({
						...state,
						visible: true,
						formType: "create",
						formValues: {}
					}))} />
				</Tooltip>
				<Tooltip placement='bottom' title={editTitle} >
					<Button size="small" disabled={selectedRows.length <= 0}
						onClick={() => setState(() => ({
							...state,
							visible: true,
							formType: "edit",
							formValues: selectedRows[0]
						}))}
						className="marginH5" icon='edit' />
				</Tooltip>
				<Popconfirm disabled={selectedRows.length <= 0} title={`${tr('确认删除选中数据')}?`} placement='bottomLeft' onConfirm={onDelete} >
					<Button size="small" disabled={selectedRows.length <= 0}
						className="marginH5" icon='delete' />
				</Popconfirm>
			</> : null}
			columns={columns}
			pagination={false}
			rowSelection={{
				selectedRowKeys: selectedRowKeys,
				onChange: (keys: any, rows: any) => {
					setState((state) => ({
						...state,
						selectedRowKeys: keys, selectedRows: rows
					}))
				},
			}}
		/>
		<Modal
			visible={visible}
			title={formType == 'create' ? createTitle : editTitle}
			destroyOnClose
			okText={tr("保存")}
			cancelText={tr("取消")}
			maskClosable
			onCancel={onCancel}
			onOk={onModalOK}
		>
			<FormSchema wrappedComponentRef={formNode} edit={EditStatus.EDIT} data={formValues} schema={schema} />
		</Modal>
	</div>
}

export default React.forwardRef(SchemaTable)