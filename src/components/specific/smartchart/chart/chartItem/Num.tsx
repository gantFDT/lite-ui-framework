

import React, { useState, useCallback, useMemo } from 'react'
import { ChartNumProps } from './interface';
import { ChartAxis } from '../../enum'
import { maxBy } from 'lodash'
import { renderColor } from '../utils'
import { indexOf } from 'lodash'
const { Geom, Guide, Legend, View } = require('bizcharts')
const { Text } = Guide;
const { yAxis, color } = ChartAxis;
const ringPath: string = "M64 300h400v1H0z"
export default function NumberChart(props: ChartNumProps) {
	const { dataSource, uiConfig } = props;
	const { fontSize } = uiConfig;
	const maxObj: any = maxBy(dataSource, yAxis);

	return <>
		<Legend />
		<Geom
			type="interval"
			position={`${color}*${yAxis}`}
			color={[color, renderColor(uiConfig)]}
			shape={[yAxis, () => ['liquid-fill-path', ringPath]]}
			style={{
				lineWidth: 10,
				opacity: 0.75,
			}}
			size={140}
		/>
		<Guide>
			{
				dataSource.map((item: any, index: number) => {
					return (<Text
						key={item.yAxis + index}
						content={`${item.yAxis}`}
						top
						position={{
							color: item.color,
							yAxis: (maxObj.yAxis) / 2,
						}}
						style={{
							fill: "#333", // 文本颜色
							opacity: 0.75,
							fontSize: fontSize,
							textAlign: 'center',
						}}
					/>)
				})
			}
		</Guide>
	</>
}