import { ReactElement, ReactHTML } from 'react'
import { EditStatus } from 'gantd'
import { ColProps } from 'antd/lib/grid/col'
import { WrappedFormUtils, GetFieldDecoratorOptions } from 'antd/lib/form/Form.d'
import { FormLabelAlign } from 'antd/lib/form/FormItem'
export enum Types {
	object = "object",
	table = "table",
	array = "array",
	number = "number",
	string = "string",
	bool = "bool",
	date = "date"
}
export interface Context {
	form: WrappedFormUtils,
	onSave: (id: any, value: any, cb: any) => any,
	data?: object | undefined,
	customFileds?: CustomFileds[],
	backgroundColor?: string,
	edit?: EditStatus | EditObject
}
export interface Schema {
	name?: string,
	title?: string,
	operator?: string,
	type: Types | string,
	componentType?: string | React.ElementType
	propertyType?: {
		[propsname: string]: Schema
	},
	required?: Array<string> | boolean,
	items?: any,
	options?: GetFieldDecoratorOptions,
	dependencies?: Array<string>,
	onDependenciesChange?: (value: any, props: any, form: WrappedFormUtils) => any
	props?: any,
	[propName: string]: any;
}
export interface CustomFileds {
	type: string,
	component: React.ElementType
}
interface EditObject {
	[propname: string]: EditStatus | EditObject
}
export interface OptionalProps {
	schema: Schema,
	onSchemaChange?: (schema: Schema) => void,
	uiSchema?: UISchema,
	edit?: EditStatus | EditObject,
	titleConfig?: TitleSchema,
	data?: object,
	onChange?: Function,
	customFileds?: CustomFileds[],
	backgroundColor?: string,
	wrappedComponentRef?: any,
	className?: any,
	ref?: any | ReactElement | ReactHTML | HTMLDivElement
}
export interface Props extends OptionalProps {
	onSave: (id: any, value: any, cb: any) => any,
	form: WrappedFormUtils,
}
export interface UISchema {
	"ui:orders"?: string[],
	"ui:col"?: ColProps | number,
	"ui:labelCol"?: ColProps | number,
	"ui:wrapperCol"?: ColProps | number,
	"ui:gutter"?: number | object,
	"ui:labelAlign"?: FormLabelAlign,
	"ui:backgroundColor"?: string,
	[propName: string]: any
}
export interface TitleSchema {
	"title:visible"?: boolean,
	"title:type"?: string,
	"title:size"?: string,
	"title:extra"?: Element | string,
	"title:beforeExtra"?: Element | string,
	"title:icon"?: string,
	"title:num"?: string | number,
	"title:color"?: string,
	"title:bottomLine"?: boolean,
	"title:canWrap"?: boolean,
	[propName: string]: any
}