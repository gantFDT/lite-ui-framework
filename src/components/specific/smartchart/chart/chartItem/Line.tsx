import React from 'react'
import { ChartItemProps } from './interface';
import { ChartAxis } from '../../enum'
import { renderColor } from '../utils'
const { Geom, Axis, Legend } = require('bizcharts')

const { yAxis, color } = ChartAxis;

export default function LineChart(props: ChartItemProps) {
	const { uiConfig, group } = props;
	const { lineType, dots, area } = uiConfig;
	return <>
		<Legend />
		<Axis name={group} />
		<Axis name={yAxis} />
		<Geom type="line"
			position={`${group}*${yAxis}`}
			shape={lineType}
			color={[color, renderColor(uiConfig)]}

		/>
		{area && <Geom
			type="area"
			position={`${group}*${yAxis}`}
			color={[color, renderColor(uiConfig)]} />}
		{dots && <Geom
			type="point"
			position={`${group}*${yAxis}`}
			size={4}
			shape={"circle"}
			color={[color, renderColor(uiConfig)]}
			style={{ stroke: "#fff", ineWidth: 1 }}
		/>}

	</>
}