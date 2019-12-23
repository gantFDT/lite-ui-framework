export const schema = {
	type: "object",
	title: "普通表单",
	propertyType: {
		input: {
			title: "input 组件",
			type: "string"
		},
		object: {
			type: 'object',
			propertyType: {
				input: {
					title: "input 组件",
					type: "string"
				},
				select: {
					title: '关联选择',
					dependencies: ['object.input'],
					onDependenciesChange([input], schema) {
						// return new Promise(res => {
						// 	setTimeout(() => {
						// 		res({
						// 			props: {
						// 				dataSource: [
						// 					{ value: input, label: input },
						// 				]
						// 			}
						// 		})
						// 	}, 3000)
						// })
						return {
							props: {
								dataSource: [
									{ value: input, label: input },
								]
							}
						}
					},
					componentType: "Select"
				},
			}
		},
		inputNumber: {
			title: "inputNumber 组件",
			type: "number",
			componentType: "InputNumber"
		},
		inputMoney: {
			title: "InputMoney 组件",
			type: "string",
			componentType: "InputMoney"
		},
		url: {
			title: "Url 组件",
			type: "string",
			componentType: "Url"
		},
		telePhone: {
			title: "TelePhone 组件",
			type: "string",
			componentType: "InputNumber"
		},
		datePicker: {
			title: "DatePicker 组件",
			type: "date",
			componentType: "DatePicker"
		}
	}
}
export const configSchma = {
	type: "object",
	title: "配置普通表单",
	propertyType: {
		"col": {
			title: "col",
			type: "number",
			componentType: "InputNumber",
			props: {
				max: 24,
				min: 0
			}
		},
		"gutter": {
			title: "gutter",
			type: "number",
			componentType: "InputNumber",
			props: {
				min: 0
			}
		},
		"labelCol": {
			title: "labelCol",
			type: "number",
			componentType: "InputNumber",
			props: {
				max: 24,
				min: 0
			}
		},
		"wrapperCol": {
			title: "wrapperCol",
			type: "number",
			componentType: "InputNumber",
			props: {
				max: 24,
				min: 0
			}
		},
		"labelAlign": {
			title: "labelAlign",
			type: "string",
			componentType: "Select",
			props: {
				dataSource: [
					{
						label: "左",
						value: "left"
					},
					{
						label: "右",
						value: "right"
					}
				]
			}
		},
		"backgroundColor": {
			title: "backgroundColor",
			type: "string",
			componentType: "ColorPicker",
		}
	}
}

export const gridSchema = {
	title: "自适应布局表单",
	type: "object",
	propertyType: {
		input: {
			title: "input 组件",
			type: "string"
		},
		inputNumber: {
			title: "inputNumber 组件",
			type: "number",
			componentType: "InputNumber"
		},
		inputMoney: {
			title: "InputMoney 组件",
			type: "string",
			componentType: "InputMoney"
		},
		url: {
			title: "Url 组件",
			type: "string",
			componentType: "Url"
		},
		telePhone: {
			title: "TelePhone 组件",
			type: "string",
			componentType: "InputNumber"
		},
		datePicker: {
			title: "DatePicker 组件",
			type: "date",
			componentType: "DatePicker"
		}
	}

}

export const nestSchema = {
	title: "嵌套表单—— parent",
	type: "object",
	propertyType: {
		input: {
			title: "input 组件",
			type: "string"
		},
		inputNumber: {
			title: "inputNumber 组件",
			type: "number",
			componentType: "InputNumber"
		},
		children: {
			type: "object",
			title: "嵌套表单—— children",
			propertyType: {
				inputMoney: {
					title: "InputMoney 组件",
					type: "string",
					componentType: "InputMoney"
				},
				url: {
					title: "Url 组件",
					type: "string",
					componentType: "Url"
				},
				grandson: {
					type: "object",
					title: "嵌套表单—— grandson",
					propertyType: {
						telePhone: {
							title: "TelePhone 组件",
							type: "string",
							componentType: "InputNumber"
						},
						datePicker: {
							title: "DatePicker 组件",
							type: "date",
							componentType: "DatePicker"
						}
					}
				}

			}
		}
	}
}

export const tableSchema = {
	type: "table",
	title: "table 表单",
	items: {
		input: {
			title: "input 组件",
			type: "string"
		},
		inputNumber: {
			title: "inputNumber 组件",
			type: "number",
			componentType: "InputNumber"
		},
		inputMoney: {
			title: "InputMoney 组件",
			type: "string",
			componentType: "InputMoney"
		},
		url: {
			title: "Url 组件",
			type: "string",
			componentType: "Url"
		},
	}
}