import React, { useMemo, useContext, useCallback, useEffect } from 'react'
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
function SchemaFiled(props: Schema, ref: any) {
	const { options, title, props: FiledProps, componentType, name, isRequired, initialValue: defaultValue, required, edit, uiData, operator } = props;
	const { form: { getFieldDecorator, resetFields, validateFieldsAndScroll, }, onSave, data, customFileds, emitDependenciesChange } = useContext(FormContext)
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
	// let initialValue = defaultValue === undefined ? get(data, `${name}`, undefined) : defaultValue;
	let initialValue = useMemo(() => {
		return defaultValue === undefined ? get(data, `${name}`, undefined) : defaultValue;
	}, [defaultValue])
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
		const { initialValue, ...othterProps } = FiledProps || {}
		return React.createElement(component, { ...othterProps, edit: itemEdit, onCancel, onSave: onItemSave })
	}, [FiledProps, itemEdit, onCancel, onItemSave, componentType, customFileds])

	useEffect(() => {
		if (![null, undefined].includes(initialValue)) {
			emitDependenciesChange(name as string, initialValue)
		}
	}, [])
	return <Col {...colLayout}  >
		<Form.Item
			label={title}
			className={labelAlign == "right" ? styles.right : styles.left}
			// labelAlign={labelAlign}
			wrapperCol={wrapperColayout}
			labelCol={labelColLayout}
			{...itemProps}
		>
			{
				name && getFieldDecorator(name, {
					initialValue,
					...options,
					rules: [{
						required: typeof required === "boolean" ? required : isRequired,
						message: `${title}${tr("不能为空")}`
					},
					...optionsRules
					]
				})(fieldComponent)
			}
		</Form.Item>
	</Col>
}
export default SchemaFiled