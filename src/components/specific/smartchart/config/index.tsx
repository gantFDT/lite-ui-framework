import React, { useState, useCallback, createContext, useMemo } from 'react'
import { Tabs, Radio, } from 'antd'
import { Column, ChartView } from '../interface'
import ConfigData from './configData'
import ConfigChartSeletor from './ConfigChartSeletor'
import ConfigUI from './configUI'
import styles from './index.less'
import { isEmpty } from 'lodash'
import { guid } from '../../smartsearch/utils'
const TabPane = Tabs.TabPane
const tabs = [{
	title: tr("配置数据"),
	key: "data"
}, {
	title: tr("选择图形"),
	key: "chart"
}, {
	title: tr("UI配置"),
	key: "ui"
}
]
interface Props {
	columns: Column[],
	chartView: ChartView,
	setEditSchema: (chartView: ChartView) => void
}

const initContext: {
	columns: Column[],
} = {
	columns: []
}
export const ConfigContext = createContext(initContext)
export default function ConfigContent(props: Props) {
	const { columns, chartView, setEditSchema } = props;
	const [tabsKey, setTabsKey] = useState('data')
	const selectedChart = useCallback((key) => {
		if (chartView.type !== key) setEditSchema({
			...chartView,
			type: key
		})
	}, [chartView, setEditSchema])
	const changeDataConfig = useCallback(dataConfig => {
		setEditSchema({
			...chartView,
			dataConfig: { ...dataConfig }
		})
	}, [chartView, setEditSchema])
	const changeUIConfig = useCallback((val, allVals) => {
		setEditSchema({
			...chartView,
			uiConfig: {
				...allVals
			}
		})
	}, [chartView, setEditSchema])
	const view = useMemo(() => {
		return isEmpty(chartView) ? {
			viewId: guid(),
			name: "",
			version: "",
			type: "num",
			dataConfig: {
				group: "",
				summary: []
			}
		} : chartView
	}, [chartView])
	return <ConfigContext.Provider value={{ columns }} >
		<div className={styles.configContent}>
			<div className={styles.RadioGroupTabs}>
				<Radio.Group
					value={tabsKey}
					buttonStyle="solid"
					onChange={(e) => setTabsKey(e.target.value)}>
					{
						tabs.map(item => <Radio.Button key={item.key} value={item.key}>{item.title}</Radio.Button>)
					}
				</Radio.Group>
			</div>
			<Tabs className={styles.contentTabs} activeKey={tabsKey} >
				<TabPane key="data" tab="data" >
					<ConfigData dataConfig={view.dataConfig} onChange={changeDataConfig} />
				</TabPane>
				<TabPane key="chart" tab="chart" >
					<ConfigChartSeletor selectedChart={selectedChart} type={view.type} dataConfig={view.dataConfig} />
				</TabPane>
				<TabPane key="ui" tab="ui" >
					<ConfigUI columns={columns} changeUIConfig={changeUIConfig} chartView={view} />
				</TabPane>
			</Tabs>
		</div>
	</ConfigContext.Provider>

}

