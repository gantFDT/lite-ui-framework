import React, { useMemo, useContext, useCallback } from 'react'
import {
	EditStatus,
	Input
} from 'gantd'
import { Form, Col } from 'antd'
import { FormContext } from './index'
import { Schema } from './interface'
import { get, findIndex } from 'lodash'
import { getFields } from './maps'
import styles from './index.less'
enum Algins {
	'left' = "left",
	'right' = "right",
}
function SchemaFiled(props: Schema, ref: any) {
	const { options, title, props: FiledProps, componentType, name, isRequired, required, edit, uiData, operator } = props;
	const { form: { getFieldDecorator, resetFields, validateFieldsAndScroll, }, onSave, data, customFileds } = useContext(FormContext)
	const onCancel = useCallback(
		(value) => {
			name && resetFields([name])
		},
		[componentType, name],
	)
	const onItemSave = useCallback((id, value, cb) => {
		name && validateFieldsAndScroll([name], (errors: any, values: object) => {
			if (errors) return;
			onSave(id, value, cb)
		})
	}, [name])
	const optionsRules = options && options.rules ? options.rules : [];
	const { col, labelAlign, labelCol, wrapperCol, ...itemProps } = uiData;
	let initialValue = get(data, `${name}`, undefined)
	if (initialValue == undefined && componentType === "ColorPicker") initialValue = "#ffffff";
	const itemEdit = FiledProps && FiledProps.allowEdit === false ? EditStatus.CANCEL : edit;
	const colLayout = typeof col === "number" ? { span: col } : col;
	const labelColLayout = typeof labelCol === "number" ? { span: labelCol } : labelCol;
	const wrapperColayout = typeof wrapperCol === "number" ? { span: wrapperCol } : wrapperCol;
	const fieldComponent = useMemo(() => {
		let component = get(getFields(), `${componentType}`, null)
		if (component == null) {
			const customIndex = findIndex(customFileds, (item) => item.type === componentType);
			component = get(customFileds, `[${customIndex}].component`, Input)
		}
		return React.createElement(component, { ...FiledProps, edit: itemEdit, onCancel, onSave: onItemSave })
	}, [FiledProps, itemEdit, onCancel, onItemSave, componentType, customFileds])

	return <Col {...colLayout}  >
		<Form.Item
			label={title}
			className={labelAlign === Algins.right ? styles.right : styles.left}
			wrapperCol={wrapperColayout}
			labelCol={labelColLayout}
			{...itemProps}
		>
			{
				name && getFieldDecorator(name, {
					...options,
					rules: [{
						required: typeof required === "boolean" ? required : isRequired,
						message: `${title}${tr("不能为空")}`
					},
					...optionsRules
					],
					initialValue
				})(fieldComponent)
			}
		</Form.Item>
	</Col>
}
export default SchemaFiled