
import { ChartAxis } from '../enum';
import { FormulaField } from '../interface'
import { difference } from 'lodash'
const DataSet = require('@antv/data-set');
export function getChartData(dataSource: any[], summary: FormulaField[], group?: string) {
	const ds = new DataSet();
	const dv = ds.createView().source(dataSource);
	const fields: string[] = [];
	summary.map(item => {
		const field = item.name + "__" + item.formula;
		fields.push(field)
		dv.transform({
			type: 'impute',
			field,
			method: 'value',
			value: 0
		});
	})
	dv.transform({
		type: "fold",
		fields,
		key: ChartAxis.color,
		value: ChartAxis.yAxis
	})
	if (group) dv.transform({
		type: 'map',
		callback(row: any) {
			row[group] = row[group] + " ";
			return row;
		}
	});

	return dv
}

export function getChartConfig(data: any[], uiData: any, width: number, height: number, themType: string, group?: string, padding?: any) {
	let scale = {
		[ChartAxis.color]: {
			formatter: (value: string) => uiData[value]
		}
	}
	scale = group ? {
		...scale,
		[group]: {
			alias: uiData[group],
			formatter: (value: string) => uiData[group] ? uiData[group] + "：" + value : value
		}
	} : scale
	return {
		data,
		height,
		forceFit: true,
		width,
		theme: themType,
		padding: padding ? padding : "auto",
		gird: {
			hightLightZero: true,
		},
		scale
	}
}

export function disabledRender(dataSource: any[], summary: FormulaField[], group?: string) {
	if (dataSource.length == 0) return false;
	const fields = summary.map(item => item.name + "__" + item.formula);
	if (group) fields.push(group);
	for (let itemData of dataSource) {
		const dataKeys = Object.keys(itemData);
		if (dataKeys.length == fields.length) {
			const diffKeys = difference(dataKeys, fields);
			if (diffKeys.length === 0) return false;
		}
	}
	return true
}

export function renderColor(uiConfig: any) {
	return (keyname: string) => uiConfig[`${keyname}__color`]
}