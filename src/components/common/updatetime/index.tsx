import React, { useState, useCallback, useEffect } from 'react';
import { Button, Switch, InputNumber, Tooltip, Divider, Icon } from 'antd';
import moment from 'moment';
import styles from './index.less'
import classnames from 'classnames'
const format = "hh:mm:ss"
interface Props {
	auto?: boolean,
	defaultTime?: number,
	refresh?: () => void,
	time?: string,
	className?: any
}
let playFun: any = null;
const UpdateTime: React.SFC<Props> = ({ auto = false, defaultTime = 1, ...props }) => {
	const { time, refresh, className } = props
	const [updateTime, setUpdateTime] = useState(time ? time : moment().format(format));
	useEffect(() => {
		if (time) setUpdateTime(time)
	}, [time, setUpdateTime, playFun])
	const [autoRefresh, setAutoRefresh] = useState(auto);
	const [autoTime, setAutoTime] = useState(defaultTime as number);
	const handleRefresh = useCallback(() => {
		if (refresh) refresh();
		if (!time) setUpdateTime(moment().format(format))
	}, [refresh, setUpdateTime])
	useEffect(() => {
		if (autoRefresh) {
			if (playFun) clearInterval(playFun);
			playFun = setInterval(handleRefresh, 60 * 1000 * autoTime)
		} else {
			clearInterval(playFun);
			playFun = null
		}
		return () => {
			if (playFun) clearInterval(playFun);
		}
	}, [autoTime, handleRefresh, autoRefresh])

	const switchChange = useCallback((checked) => {
		setAutoRefresh(checked)
	}, [setAutoRefresh])
	const inputChange = useCallback((value) => {
		const reg = /(^[1-9]\d*$)/;
		if (reg.test(value)) {
			setAutoTime(value)
		}
	}, [setAutoTime])
	return <Button className={classnames(styles.container, className)} size="small" >
		<Tooltip title={`${tr("最新数据更新时间")},${tr("点击更新数据")}`} >
			<div onClick={handleRefresh} className={styles.toolTipTime} ><span style={{ verticalAlign: 0 }} > <Icon type='redo' /></span> {updateTime}</div>
		</Tooltip>
		<Divider type="vertical" />
		<Tooltip title={autoRefresh ? tr("关闭自动更新") : tr("开启自动更新")} >
			<Switch className={styles.autoSwitch} size="small" checked={autoRefresh} onChange={switchChange} />
		</Tooltip>
		{
			autoRefresh && <>
				<Divider type="vertical" />
				<Tooltip title={<div className={styles.toolTipContainer} >
					<p>{tr("设置自动更新触发时间")}</p>
					<p>({tr("单位")}：{tr("分")})</p>
				</div>} >
					<InputNumber value={autoTime}
						min={1}
						max={30}
						size='small'
						onChange={inputChange}
						className={styles.autoTimeInput}
					/>
				</Tooltip>
			</>
		}
	</Button>
}
export default UpdateTime