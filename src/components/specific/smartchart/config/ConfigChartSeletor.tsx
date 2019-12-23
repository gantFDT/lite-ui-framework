import React, { useMemo, useEffect } from 'react'
import classnames from 'classnames'
import { Row, Col, Tooltip } from 'antd';
import { ChartDataConfig } from '../interface'
import { ChartTypes } from '../enum';
import styles from './index.less';
import { isNumChart } from '../utils'
const barIcon = require('@/assets/images/barIcon.png')
const lineIcon = require('@/assets/images/lineIcon.png')
const pieIcon = require('@/assets/images/pieIcon.png')
const numberIcon = require('@/assets/images/numberIcon.png')
const radarIcon = require("@/assets/images/radarIcon.png")
interface ChartItem {
	key: ChartTypes,
	icon: string,
	title: string
}
const charts: ChartItem[] = [{
	key: ChartTypes.bar,
	icon: barIcon,
	title: tr("柱状图")
},
{
	key: ChartTypes.line,
	icon: lineIcon,
	title: tr("线性图")
},
{
	key: ChartTypes.pie,
	icon: pieIcon,
	title: tr("饼状图")
},
{
	key: ChartTypes.radar,
	icon: radarIcon,
	title: tr("雷达图")
},
{
	key: ChartTypes.num,
	icon: numberIcon,
	title: tr("数字统计")
},
];
const colLayout = {
	span: 12,
}
interface Props {
	type: ChartTypes,
	dataConfig: ChartDataConfig,
	selectedChart: (type: ChartTypes) => void
}
export default function ConfigChartSeletor(props: Props) {
	const { type, dataConfig, selectedChart } = props;
	const disabledNumber: boolean = useMemo(() => {
		return !isNumChart(dataConfig)
	}, [dataConfig])
	useEffect(() => {
		if (disabledNumber && type === ChartTypes.num) return selectedChart(ChartTypes.bar);
		if (!disabledNumber && type !== ChartTypes.num) return selectedChart(ChartTypes.num);
	}, [disabledNumber, selectedChart])
	return <div className={styles.tabChart} >
		<Row>
			{
				charts.map(item => <Col {...colLayout} key={item.key} >
					<Tooltip title={item.title} placement="bottom"  >
						<div
							onClick={(item.key == ChartTypes.num ? disabledNumber : !disabledNumber) ? () => { } : selectedChart.bind(null, item.key)}
							className={classnames(styles.iconWrapper, item.key === type && styles.selected,
								item.key == ChartTypes.num ? disabledNumber && styles.disabled : !disabledNumber && styles.disabled
							)}
						><img src={item.icon} /></div>
					</Tooltip>
				</Col>)
			}
		</Row>
	</div>
}