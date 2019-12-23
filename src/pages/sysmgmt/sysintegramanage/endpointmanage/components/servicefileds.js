import React from 'react'

import { Input, DatePicker, Select, Switch } from 'antd'
import BindProtocol from './bindprotocol'
import SelectorServerName from './servername'

export const baseModalKeys = ['code', 'type'];

export const modalFileds = {
	code: {
		title: tr('服务名称'),
		Component: <SelectorServerName />,
		fieldOptions: {
			rules: [
				{
					required: true,
					message: tr('请选择服务名称')
				}
			]
		}
	},
	type: {
		title: tr('绑定协议'),
		Component: <BindProtocol />,
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