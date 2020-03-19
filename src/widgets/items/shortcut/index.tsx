import React, { useState, useEffect } from 'react'
import { Row, Col, Button, Empty, Tooltip } from 'antd';
import { Card, Icon } from 'gantd'
import styles from './index.less'
import { connect } from 'dva';
import classnames from 'classnames'
import router from 'umi/router';
import ReactResizeDetector from 'react-resize-detector';
import { ConfigBar, ConfigWrap, registerModel } from '@/widgets/utils'
import ConfigPanel from './ConfigPanel'

import SnapShot from './snapshot.png'
const modelRegisterKey = 'shortcutModelInit'


interface Props {
	loading: any;
	itemHeight: number;
	dispatch: any;
	shortcutWidget: any;
	[propname: string]: any;
}



const Widget = (props: Props) => {
	const { loading, shortcutWidget = {}, dispatch, itemHeight, editMode, widgetKey, handleDeleteWidget, } = props;
	const [configVisible, setConfigVisible] = useState(false)
	const { shortcut = [] } = shortcutWidget;
	const [span, setSpan] = useState(3)

	const load = () => {
		dispatch({
			type: 'shortcutWidget/fetchData'
		})
	}

	const redirect = (path: string) => {
		router.push(path)
	}

	const onResize = (w: number) => {
		const columns = Math.round(w / 130);
		setSpan(Math.round(24 / columns))
	}

	//注册model
	registerModel(modelRegisterKey, load)

	return (
		<Card
			bordered={false}
			className="full"
			title={<><Icon type="appstore" className="gant-margin-h-5" />{tr('快捷方式')}</>}
			loading={loading}
			bodyStyle={{ padding: '0px' }}
			extra={<Button size="small" icon="reload" onClick={() => load()} loading={loading} />}
		>
			<ReactResizeDetector handleWidth handleHeight onResize={onResize} key={1}>
				<div className="aligncenter" style={{ height: itemHeight - 40 }}>
					<div className={styles.ShortcutWidget} style={{ fontSize: '12px' }}>
						<Row gutter={10}>
							{!_.isEmpty(shortcut) ? shortcut.map((item: object) =>
								<Col
									key={item['path']}
									span={span}
									className={classnames('aligncenter', styles.item)}
									onClick={() => redirect(item['path'])}
								>
									<div>
										<Tooltip title={item['name']}>
											<Icon type={item['icon']} className={styles.icon} />
											<p className={classnames(styles.name, 'omit-1')}>{item['name']}</p>
										</Tooltip>
									</div>

								</Col>
							) : <div className="emptyContent" style={{ height: itemHeight - 40 }}>
									<Empty
										description={
											<span>
												{tr('还没有配置快捷方式')}
											</span>
										}
									>
									</Empty>
								</div>}
						</Row>
					</div>

				</div>
			</ReactResizeDetector>
			<ConfigBar widgetKey={widgetKey} editMode={editMode} handleDeleteWidget={handleDeleteWidget} setVisible={setConfigVisible} />
			<ConfigWrap visible={configVisible} setVisible={setConfigVisible} widgetKey={widgetKey} width={400}>
				<ConfigPanel widgetKey={widgetKey} />
			</ConfigWrap>
		</Card>
	)

}

export default connect(({ shortcutWidget, loading }: { shortcutWidget: any, loading: any }) => ({
	shortcutWidget: shortcutWidget,
	loading: loading.effects['shortcutWidget/fetchData'],
}))(Widget)


export { SnapShot, modelRegisterKey }