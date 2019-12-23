import React from 'react'
import { ChartItemProps } from './interface';
import { ChartAxis } from '../../enum'
import { renderColor } from '../utils'
const { Geom, Axis, Legend } = require('bizcharts')
const { yAxis, color } = ChartAxis;

export default function BarChart(props: ChartItemProps) {
	const { uiConfig, group } = props;
	const { barSize } = uiConfig
	return <>
		<Legend />
		<Axis name={group} />
		<Axis name={yAxis} />
		<Geom
			type="intervalDodge"
			position={`${group}*${yAxis}`}
			color={[color, renderColor(uiConfig)]}
			size={barSize}
		/>
	</>
}