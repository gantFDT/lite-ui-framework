import React from 'react'

import { Input, DatePicker, Select, Switch } from 'antd'
import SelectorFeatureName from '../components/featurename';

export const baseModalKeys = ['code', 'type'];

export const modalFileds = {
	name: {
		title: tr('功能名称'),
		Component: <SelectorFeatureName />,
		fieldOptions: {
			rules: [
				{
					required: true,
					message: tr('必须选择功能名称')
				}
			]
		}
	},
	code: {
		title: tr('业务代码'),
		Component: <Input />,
		fieldOptions: {
			rules: [
				{
					required: true,
					message: tr('必须填写业务代码')
				}
			]
		}
	},

}
export function getValues(values, fileds) {
	let formatValues = { ...values }
	Object.keys(fileds).map(key => {
		if (fileds[key].type == 'date' && formatValues[key]) {
			formatValues[key] = formatValues[key].format(fileds[key].format)
		}
	})
	return formatValues
}