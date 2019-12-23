import { FormulasItem } from './interface'
import { Formula } from './enum'
const formulas: FormulasItem[] = [{
	name: tr("频率"),
	tips: tr("统计选中列出现的频率"),
	formula: <string>Formula.COUNT
}, {
	name: tr("平均值"),
	tips: tr("统计选中列的平均值"),
	formula: <string>Formula.AVG
}, {
	name: tr("总和"),
	tips: tr("统计选中列的总和"),
	formula: <string>Formula.SUM
}, {
	name: tr("最小值"),
	tips: tr("统计选中列的最小值"),
	formula: <string>Formula.MIN
}, {
	name: tr("最大值"),
	tips: tr("统计选中列的最大值"),
	formula: <string>Formula.MAX
},
]

export default formulas