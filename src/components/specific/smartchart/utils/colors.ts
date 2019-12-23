import { get } from 'lodash'
export const colors: string[] = [
	"#3aa1ff", "#36cbcb", "#fbd437", "#4ecb73", "#f2637b",
	"#5ddfcf", '#a9ea74', "#eaa674", "#70b986", "#435188",
	"#889bea", "#8a7bd4", "#975fe5", "#b58bf0", "#749fea",
	"#36cbcb", "#85e5e5", "#74b1ea", "#9395ff", "#5254cf"
]

function color() {
	var r = Math.floor(Math.random() * 256);
	var g = Math.floor(Math.random() * 256);
	var b = Math.floor(Math.random() * 256);
	var color = '#' + r.toString(16) + g.toString(16) + b.toString(16);
	return color;
}
export function getColor(index: number) {
	return get(colors, `[${index}]`, color())
}

