import { Input } from 'antd'

export const baseModalKeys = ['name','principal','credential'];

export const modalFileds = {
	name: {
		title: tr('客户名称'),
		Component: <Input />,
		fieldOptions: {
			rules: [
				{
					required: true,
					message: tr('必须填写客户名称')
				}
			]
		}
	},
	principal: {
		title: tr('身份凭证'),
    Component:<Input />,
    fieldOptions: {
			rules: [
				{
					required: true,
					message: tr('必须填写身份凭证')
				}
			]
		}
	},
	credential: {
		title: tr('身份密钥'),
    Component:<Input />,
    fieldOptions: {
			rules: [
				{
					required: true,
					message: tr('必须填写身份密钥')
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