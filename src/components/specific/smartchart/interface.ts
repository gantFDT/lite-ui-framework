import { ActionTypes, SaveTypes, ViewTypes, ColumnTypes, ChartTypes, Formula } from './enum'
export interface Action {
	type: ActionTypes,
	payload?: any
}
export interface State {
	defaultIndex: number,
	index: number,
	visible: boolean,
	isEdit: boolean,
	saveModalVisible: boolean,
	saveAsModalVisible: boolean,
	saveType: SaveTypes,
	editSchema: ChartView
}
export interface Props {
	height: number,
	dataSource: any[],
	columns: Column[],
	schema: ChartView[],
	smartChartId: string,
	userId: string | number,
	loading?: boolean,
	onChange?: (views: ChartView[], fun: () => any) => boolean,
	headerRight?: Element | string | {
		(chartView: ChartView): any
	},
	onDataChange?: (params: DataConfigField) => void,
	onRefresh?: () => void,
	[propname: string]: any,
	padding?: "auto" | {
		left?: number,
		right?: number,
		top?: number,
		bottom?: number,
	} | number[] | string[]
}
export interface DataConfigField {
	groupField: {
		name?: string,
		order?: string
	},
	summaryField: FormulaField[]
}
export interface Column {
	fieldName: string,
	title: string,
	type: ColumnTypes,
	[propsName: string]: any,
}

export interface ChartDataConfig {
	group?: string,
	summary: FormulaField[]
}

export interface ChartView {
	viewId: string,// 唯一标识
	name: string,
	version?: string,
	viewType: ViewTypes
	type: ChartTypes,
	dataConfig: ChartDataConfig,
	uiConfig?: any,

}
export interface ChartProps {
	dataSource: any[],
	height: number,
	chartView: ChartView,
	columns?: Column[],
	padding?: "auto" | {
		left?: number,
		right?: number,
		top?: number,
		bottom?: number,
	} | number[] | string[]
	[propname: string]: any
}
export interface ChartItemProps {
	uiConfig: any,
	group?: string
}
export interface ChartItemPieProps extends ChartItemProps {
	dataSource: any[],
	dataConfig: ChartDataConfig,
}
export interface ChartNumProps extends ChartItemProps {
	data: any
}
export interface FormulaField {
	formula: string,
	name: string,
}
export interface FormulasItem extends FormulaField {
	tips: string,
}
export const FormulaRules = {
	[ColumnTypes.string]: [Formula.COUNT],
	[ColumnTypes.number]: "*"
}

export interface ConfigDataProps {
	dataConfig: ChartDataConfig,
	onChange: (value: ChartDataConfig) => void
}
export interface SummaryItemProps {
	value?: FormulaField,
	index?: number,
	onChange: (val: FormulaField, index?: number) => void,
	onDelete?: (index: number) => void,
	allValues: FormulaField[]
}
export interface SummaryProps {
	value?: FormulaField[] | undefined,
	onChange?: (val: FormulaField[]) => void
}


export interface ConfigUIProps {
	changeUIConfig: (vals: any) => void,
	chartView: ChartView,
	columns?: Column[]
}