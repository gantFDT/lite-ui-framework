export const lineConfig = {
	defaultData: {
		lineType: "line",
		dots: true,
		area: false
	},
	formSchema: {
		lineType: {
			title: tr("折线类型"),
			componentType: "RadioGroup",
			props: {
				dataSource: [{
					label: tr("默认"),
					value: "line"
				},
				{
					label: tr("平滑线"),
					value: "smooth"
				},
				{
					label: tr("水平折线"),
					value: "hv"
				}
				]
			},

		},
		dots: {
			title: tr("节点"),
			componentType: "RadioGroup",
			props: {
				dataSource: [{
					label: tr("显示"),
					value: true
				},
				{
					label: tr("隐藏"),
					value: false
				}
				]
			},
		},
		area: {
			title: tr("面积"),
			componentType: "RadioGroup",
			props: {
				dataSource: [{
					label: tr("显示"),
					value: true
				},
				{
					label: tr("隐藏"),
					value: false
				}
				]
			},
		}
	}

}
export const barConfig = {
	formSchema: {
		barSize: {
			title: tr("柱状大小"),
			componentType: "InputNumber",
		}
	},
	defaultData: {
		barSize: 30
	}
}

export const pieConfig = {
	formSchema: {
		radiusSize: {
			title: tr("饼状图大小"),
			componentType: "InputNumber",
			props: {
				min: 0.5,
				max: 1,
				step: 0.1
			}
		},
		innerSize: {
			title: tr("环比大小"),
			componentType: "InputNumber",
			props: {
				min: 0,
				max: 1,
				step: 0.1
			}
		}
	},
	defaultData: {
		radiusSize: 1,
		innerSize: 0.8
	}
}

export const numConfig = {
	defaultData: {
		fontSize: 60
	},
	formSchema: {
		fontSize: {
			title: tr("字体大小"),
			componentType: "InputNumber",
			type: "string"
		}
	}
}

export const radarConfig = {
	defaultData: {
		polygon: true,
		radius: 0.8,
		area: true,
		opacity: 0.5
	},
	formSchema: {
		polygon: {
			title: tr("形状"),
			componentType: "RadioGroup",
			props: {
				dataSource: [{
					label: tr("多边形"),
					value: true
				},
				{
					label: tr("圆形"),
					value: false
				}
				]
			},
		},
		opacity: {
			title: tr("网格背景透明度"),
			componentType: "InputNumber",
			type: "string",
			props: {
				min: 0,
				precision: 1,
				step: 0.1,
				max: 1
			}
		},
		radius: {
			title: tr("圆形大小比例"),
			componentType: "InputNumber",
			type: "string",
			props: {
				min: 0.4,
				max: 1,
				step: 0.1
			}
		},
		area: {
			title: tr("面积"),
			componentType: "RadioGroup",
			props: {
				dataSource: [{
					label: tr("显示"),
					value: true
				},
				{
					label: tr("隐藏"),
					value: false
				}
				]
			},
		}
	}
}