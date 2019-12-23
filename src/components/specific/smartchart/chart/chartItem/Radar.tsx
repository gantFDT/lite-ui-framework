import React, { useMemo } from 'react'
import { ChartItemProps } from './interface';
import { ChartAxis } from '../../enum'
import { maxBy } from 'lodash'
import { renderColor } from '../utils'
const { Geom, Coord, Axis, Legend } = require('bizcharts')
const { yAxis, color } = ChartAxis;
export default function RadarChart(props: ChartItemProps) {
	const { group, uiConfig } = props;
	const { polygon, radius, area, opacity } = uiConfig
	return <>
		<Coord type="polar" radius={radius} />
		<Axis
			name={group}
			line={null}
			tickLine={null}
		/>
		<Axis
			name={yAxis}
			line={null}
			tickLine={null}
			grid={{
				type: polygon ? "polygon" : "",
				lineStyle: {
					lineDash: null
				},
				alternateColor: `rgba(0, 0, 0, ${0.1 * opacity})`
			}}
		/>
		<Legend name={color} marker="circle" />
		{area && <Geom type="area" position={`${group}*${yAxis}`} color={color} />}
		<Geom type="line" position={`${group}*${yAxis}`} color={color} size={2} />
		<Geom
			type="point"
			position={`${group}*${yAxis}`}
			color={color}
			shape="circle"
			size={4}
			style={{
				stroke: "#fff",
				lineWidth: 1,
				fillOpacity: 1
			}}
		/>
	</>
}
