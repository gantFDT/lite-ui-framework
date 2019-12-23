import { Input, DatePicker, Select } from 'antd'
const format = "YYYY-MM-DD";
export const searchFileds = {
	type: {
		title: tr("类型"),
		Component: <Input placeholder={tr("输入类型")} />
	},
	name: {
		title: tr("名称"),
		Component: <Input placeholder={tr("输入名称")} />,
	},
	category: {
		title: tr("类别"),
		Component: <Select placeholder={tr("选择类别")}>
			<Select.Option value="ALL" >
				{tr('全部编码')}
			</Select.Option>
			<Select.Option value="SYSTEM" >
				{tr('系统编码')}
			</Select.Option>
			<Select.Option value="CUSTOM" >
				{tr('自定义编码')}
			</Select.Option>
		</Select>
	}
}

export const modalFileds = {
	type: {
		title: tr("类型"),
		Component: <Input placeholder={tr("输入类型")} />,
		fieldOptions: {
			rules: [
				{
					required: true,
					message: tr("类型不能为空")
				}
			]
		}
	},
	name: {
		title: tr("名称"),
		Component: <Input placeholder={tr("请输入名称")} />,
	},
	desc: {
		title: tr("描述"),
		Component: <Input.TextArea placeholder={tr("请输入描述")} />,

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