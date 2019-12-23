import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Empty } from 'antd'
import { BarChart, LineChart, PieChart, NumberChart, RadarChart } from './chartItem'
import { ChartTypes } from '../enum'
import { ChartProps } from '../interface'
import { getDefalutUIConfig, getUiData } from '../utils'
import { isEmpty } from 'lodash'
import { getChartData, getChartConfig, disabledRender } from './utils'
const { Chart, Tooltip, Legend } = require("bizcharts");
function ChartContainer(props: ChartProps) {
	const { height, chartView, dataSource, themType, columns, padding } = props;
	let { dataConfig, uiConfig, type } = chartView;
	const { summary, group } = dataConfig;
	const [chartKey, setChartKey] = useState("1");
	useEffect(() => {
		setChartKey(_key => (_key + 1))
	}, [chartView, dataConfig, setChartKey])
	const uiData = useMemo(() => {
		const defaultData = columns ? getDefalutUIConfig(summary, columns, group) : {};
		const defaulUiData = getUiData(type, defaultData);
		return { ...defaulUiData, ...uiConfig }
	}, [summary, columns, group, uiConfig, type]);
	const data = useMemo(() => getChartData(dataSource, summary, group), [dataSource, summary, group])
	const [width, setWidth] = useState(0);
	const divRef = useRef({} as HTMLDivElement);
	useEffect(() => {
		const { offsetWidth } = divRef.current;
		setWidth(offsetWidth)
	}, [])
	const chartConfig = useMemo(() => getChartConfig(data, uiData, width, height, themType, group, padding), [data, uiData, width, height, themType, group])
	const renderChart = useMemo(() => {
		switch (type) {
			case ChartTypes.line:
				return <LineChart
					group={group}
					key={chartKey + "line"}
					uiConfig={uiData}
				/>;
			case ChartTypes.pie:
				return <PieChart
					group={group}
					key={chartKey + "pie"}
					uiConfig={uiData}
					dataSource={data.origin}
					dataConfig={chartView.dataConfig}
				/>;
			case ChartTypes.num:
				return <NumberChart
					group={group}
					key={chartKey + "num"}
					uiConfig={uiData}
					dataSource={data.rows}
				/>
			case ChartTypes.radar:
				return <RadarChart
					key={chartKey + "bar"}
					uiConfig={uiData}
					group={group}
				/>
			default:
				return <BarChart
					key={chartKey + "bar"}
					uiConfig={uiData}
					group={group}
				/>;
		}
	}, [type, uiData, data, chartKey, group]);
	const disabledRenderChart = useMemo(() => disabledRender(dataSource, summary, group), [dataSource, summary, group]);
	if (disabledRenderChart) {
		if (process.env.NODE_ENV === "development") {
			const error = new Error("数据格式错误：" + JSON.stringify({ summary, group, data: dataSource[0] }));
			throw (error);
			return null
		}
		return <Empty description={tr("暂无图表数据")} />
	}
	if (isEmpty(dataSource)) return <Empty description={tr("暂无图表数据")} />;
	return <div ref={divRef} >
		<Chart key={chartKey}
			{...chartConfig}
		>
			<Tooltip
				showTitle={false}
			/>
			{
				renderChart
			}
		</Chart>
	</div>
}
export default ChartContainer