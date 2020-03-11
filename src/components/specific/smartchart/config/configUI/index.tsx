import React, { useMemo } from 'react'
import { SchemaForm } from 'gantd'
import RadioGroup from './RadioGroup'
import { ChartTypes } from '../../enum'
import { ConfigUIProps } from '../../interface'
import { lineConfig, pieConfig, barConfig, numConfig, radarConfig } from './schema'
import { getDefalutUIConfig, getUiData, getTitle, getFormula, getColorSchema } from '../../utils'
export default function ConfigUI(props: ConfigUIProps) {
	const { chartView, changeUIConfig, columns } = props;
	const { dataConfig, type, uiConfig } = chartView;
	const uiData = useMemo(() => {
		const { group, summary } = dataConfig;
		const defalutData = columns ? getDefalutUIConfig(summary, columns, group) : {};
		const defaultUiData = getUiData(type, defalutData)
		return { ...defaultUiData, ...uiConfig }
	}, [dataConfig, columns, type, uiConfig])

	const setUIschema = useMemo(() => {
		const { group, summary } = dataConfig;
		let config: any = {}, aliasConfig = {};
		switch (type) {
			case ChartTypes.line:
				config = lineConfig.formSchema;
				break;
			case ChartTypes.pie:
				config = pieConfig.formSchema;
				break;
			case ChartTypes.num:
				config = numConfig.formSchema
				break;
			case ChartTypes.bar:
				config = barConfig.formSchema;
				break;
			case ChartTypes.radar:
				config = radarConfig.formSchema
		}
		const colorArray: any[] = []
		if (group) {
			aliasConfig[group] = {
				type: "string",
				title: `${tr("分组")}-${tr("别名")}`
			}
		}
		summary.map(item => {
			const fieldName = `${item.name}__${item.formula}`;
			const name = getTitle(item.name, columns) + getFormula(item.formula)
			aliasConfig[fieldName] = {
				type: "string",
				title: `${name}-${tr("别名")}`
			}
			colorArray.push({
				fieldName,
				title: `${name}-${tr("颜色")}`
			})
		})
		const colorSchema = type !== ChartTypes.pie ? getColorSchema(colorArray) : {}
		return {
			type: "object",
			propertyType: {
				...aliasConfig,
				...colorSchema,
				...config,
			}
		}
	}, [type, dataConfig, columns, uiData])
	return <SchemaForm
		schema={setUIschema}
		data={uiData}
		uiSchema={{
			"ui:labelCol": 24,
			"ui:wrapperCol": 24,
		}}
		customFields={[{
			type: "RadioGroup",
			component: RadioGroup
		}]}
		onChange={changeUIConfig}
		
	/>
}