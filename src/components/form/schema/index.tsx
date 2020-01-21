
import React from 'react'
import { Form } from 'antd'
import { EditStatus } from 'gantd'
import { compose, withHandlers, renameProp } from 'recompose'
import SchemaForm from './SchemaForm'
import { isEmpty, isEqual } from 'lodash'
import { bindAll } from 'lodash-decorators'
import { Props, Context, Schema, OptionalProps } from './interface'
import classnames from 'classnames'
import dependencies, { Inner, findDependencies, refHoc, } from './compose'
import { getNewValue, getDateToForm } from './utils';
export const FormContext = React.createContext({} as Context);
export * from './interface'
export * from './maps'
@bindAll()
class FormSchema extends React.Component<Props>{
	static defaultProps = {
		edit: EditStatus.EDIT,
		onSave: () => true,
		data: {},
		customFileds: [],
		backgroundColor: "transparent"
	}
	resetFields(names?: string[]) {
		const { form: { resetFields } } = this.props;
		return resetFields(names)
	}
	validateForm(names: string[]) {
		const { form: { validateFieldsAndScroll } } = this.props;
		return new Promise(resolve => {
			validateFieldsAndScroll(names, (errors, values) => resolve({ errors, values }))
		})
	}
	getFieldsValue(names?: string[]) {
		const { form: { getFieldsValue } } = this.props;
		return getFieldsValue(names)
	}
	componentDidUpdate(pervPops: Props) {
		const { data, schema, form: { getFieldsValue, setFieldsValue } } = this.props;
		const vals = getFieldsValue();
		if (!isEqual(pervPops.data, data) && !isEqual(vals, getDateToForm(data, schema))) {
			const newVals: any = getNewValue(vals, data);
			setFieldsValue(newVals)
		}
	}
	setFieldsValue(data: object) {
		const { form: { setFieldsValue } } = this.props;
		setFieldsValue(data)
	}
	render() {
		const { schema, form, edit, uiSchema, titleConfig, onSave, data, customFileds, backgroundColor, className, emitDependenciesChange } = this.props;
		if (isEmpty(schema)) {
			console.warn('schema is null')
			return null
		}
		return <FormContext.Provider value={{ form, edit, onSave, data, customFileds, emitDependenciesChange }} >
			<div className={classnames(className)} style={{ backgroundColor }} >
				{
					<SchemaForm schema={schema} uiSchema={uiSchema} titleConfig={titleConfig} />
				}
			</div>
		</FormContext.Provider>
	}
}


export default compose<Props, OptionalProps>(
	refHoc,
	dependencies,
	Form.create<Inner>({
		onValuesChange: (props, changedValue, allValues) => {
			const { schema, form, mapSubSchema } = props
			findDependencies(changedValue, '', schema, mapSubSchema, form)
			props.onChange && props.onChange(changedValue, allValues)
		}
	}),
	withHandlers({
		emitDependenciesChange: ({ schema, form, mapSubSchema }: Inner) => (key: string, value: any) => {
			const changedValue = [...key.split('.'), value].reverse().reduce((v, k) => ({ [k]: v }))
			findDependencies(changedValue, '', schema, mapSubSchema, form)
		}
	}),
	renameProp('onRef', 'ref')
)(FormSchema)

