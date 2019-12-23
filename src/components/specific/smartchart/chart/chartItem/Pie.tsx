import React, { useMemo } from 'react'
import { ChartItemPieProps } from './interface';
const { Geom, Coord, Label, View, Legend } = require('bizcharts')
const DataSet = require('@antv/data-set');
export default function PieChart(props: ChartItemPieProps) {
	const { uiConfig, dataSource, dataConfig, group } = props;
	const { pieType, radiusSize, innerSize } = uiConfig;
	const { summary } = dataConfig
	const renderPie = useMemo(() => {
		const len = summary.length;
		return summary.map((item, index) => {
			const field = item.name + "__" + item.formula;
			const ds = new DataSet();
			const dv = ds.createView().source(dataSource);
			dv.transform({
				type: 'impute',
				field,
				method: 'value',
				value: 0
			})
			if (group) dv.transform({
				type: 'map',
				callback(row: any) {
					row[group] = row[group] + "";
					return row;
				}
			});
			let radius: any = radiusSize * Math.pow(innerSize, len - (index + 1));
			let innerRadius: any = radiusSize * Math.pow(innerSize, len - (index));
			radius = radius.toFixed(1);
			innerRadius = innerRadius.toFixed(1);
			const scale = {
				[field]: {
					formatter: (value: string) => uiConfig[field] + ":" + value
				}
			}
			return <View data={dv} key={index} scale={scale} >

				<Coord type="theta" radius={radius} innerRadius={innerRadius} />
				<Geom
					type="intervalStack"
					position={field}
					color={group}
					style={{
						lineWidth: 1,
						stroke: '#fff',
					}}
					select={false}
				>
					{len === index + 1 && <Label content={group} />}
				</Geom>
			</View>
		})

	},
		[dataConfig, uiConfig, dataSource, pieType])

	return <>
		<Legend />
		{renderPie}
	</>

}