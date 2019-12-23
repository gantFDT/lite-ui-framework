import { ChartDataConfig } from '../../interface'
export interface ChartItemProps {
	group?: string,
	uiConfig: any
}

export interface ChartItemPieProps extends ChartItemProps {
	dataSource: any[],
	dataConfig: ChartDataConfig,
}
export interface ChartNumProps extends ChartItemProps {
	dataSource: any[]
}