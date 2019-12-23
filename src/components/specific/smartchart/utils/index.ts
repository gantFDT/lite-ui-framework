import { lineConfig, barConfig, pieConfig, numConfig, radarConfig } from '../config/configUI/schema'
import { FormulaField, FormulasItem, FormulaRules, Column, ChartDataConfig } from '../interface'
import formulas from '../formula'
import { ChartTypes } from '../enum'
import { findIndex, get, indexOf } from 'lodash'
import { getColor } from './colors'
export function getUiData(type: ChartTypes, defaultData: any): any {
	let data = {}
	switch (type) {
		case ChartTypes.bar:
			data = barConfig.defaultData;
			break;
		case ChartTypes.pie:
			data = pieConfig.defaultData;
			break;
		case ChartTypes.line:
			data = lineConfig.defaultData;
			break;
		case ChartTypes.num:
			data = numConfig.defaultData;
			break;
		case ChartTypes.radar:
			data = radarConfig.defaultData
	}
	return {
		...defaultData,
		...data
	}
}
export function getTitle(name: string, columns?: Column[]) {
	const index = findIndex(columns, function (item) {
		return item.fieldName === name
	});
	return get(columns, `[${index}].title`, '');
}
export function getFormula(formula: string) {
	const index = findIndex(formulas, { formula: formula });
	return get(formulas, `[${index}].name`, '');
}
export function getSummaryColumns(columns: Column[], allformula: FormulaField[], formulaItem?: FormulasItem): Column[] {
	const newColumns: Column[] = [];
	if (!formulaItem) return []
	const { formula } = formulaItem;
	columns.map(item => {
		const { type } = item;
		let disabled = false;
		const formulaIndex = findIndex(allformula, { formula: formulaItem.formula, name: item.fieldName });
		if (formulaIndex >= 0) disabled = true;
		if (FormulaRules[type] === "*") { newColumns.push({ ...item, disabled }) }
		if (Array.isArray(FormulaRules[type])) {
			const index = indexOf(FormulaRules[type], formula);
			if (index > -1) newColumns.push({ ...item, disabled });
		}
	})
	return newColumns
}

export function getDefalutUIConfig(summary: FormulaField[], columns: Column[], group?: string) {
	const data = {};
	const arrayColor: string[] = []
	summary.map(item => {
		const { formula, name } = item;
		const formulaIndex = findIndex(formulas, { formula });
		const formulaName = get(formulas, `[${formulaIndex}].name`, "");
		const fieldIndex = findIndex(columns, function (item: Column) {
			return item.fieldName === name
		});
		const fieldName = get(columns, `[${fieldIndex}].title`, "");
		data[`${name}__${formula}`] = `${fieldName}${formulaName}`
		arrayColor.push(`${name}__${formula}`)
	})
	if (group) {
		const groupIndex = findIndex(columns, function (item: Column) {
			return item.fieldName === group
		})
		const groupName = get(columns, `[${groupIndex}].title`, "");
		data[group] = groupName
		arrayColor.push(group)
	}
	arrayColor.map((item, index: number) => {
		data[`${item}__color`] = getColor(index);
	})
	return data
}

export function isNumChart(dataConfig: ChartDataConfig) {
	const group = get(dataConfig, "group", "")
	if (group) return false;
	return true
}

export function getChartParams(dataConfig: ChartDataConfig) {
	const order = "ASC"
	const { group, summary } = dataConfig;
	let groupField: any = null;
	const summaryField = summary;
	if (group) {
		groupField = {
			name: group,
			order
		}

	}
	return {
		groupField,
		summaryField
	}
}

export function getColorSchema(array: any[]) {
	const schema: any = {}
	array.map((item: any, index: number) => {
		schema[`${item.fieldName}__color`] = {
			title: `${item.title}`,
			type: 'string',
			componentType: "ColorPicker"
		}
	})
	return schema
}