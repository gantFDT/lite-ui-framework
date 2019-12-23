import React, { useState,useCallback } from 'react'
import { Card } from 'antd';
import styles from './index.less'
import { connect } from 'dva';
import { getLocale } from 'umi/locale'
import { ConfigBar } from '@/widgets/utils'
import classnames from 'classnames'
import ReactResizeDetector from 'react-resize-detector';
import SnapShot from './snapshot.png'
const modelRegisterKey = ''

const LogoBandWidget = (props: any) => {
	const {
		loading, BASE_CONFIG,
		itemHeight, editMode, widgetKey, handleDeleteWidget
	} = props;

	const {
		logoImage,
		logoImageWhite,
		logoName = tr("甘棠软件"),
		appTitle = tr("甘棠软件前端开发框架"),
		slogan = "",
		logoNameEn = "Gant Software",
		appTitleEn = "Gant Software UI-Framework",
		sloganEn = "Let`s Us Change The World",
	} = BASE_CONFIG;
	const locale = getLocale();
	// const [configVisible,setConfigVisible] = useState(false)

	const [layout, setLayout] = useState('h')

	const onResize = useCallback((w: number, h: number) => {
		let layoutTemp: string
		if (w < h) {
			layoutTemp = 'v'
		} else {
			layoutTemp = 'h'
		}
		setLayout(layoutTemp)
	},[])

	return (
		<Card
			bordered={false}
			className={classnames("full", 'widget')}
			loading={loading}
			bodyStyle={{ padding: '20px' }}
		>
			<div className="aligncenter" style={{ height: itemHeight - 40 }}>
				<ReactResizeDetector handleWidth handleHeight onResize={onResize} key={1}>
					<div className={styles.logoband} style={{
						display: layout === 'h' ? 'flex' : 'block'
					}}>
						<img className={styles.logo} src={logoImage} />
						<div className={styles.content}
							style={{
								padding: layout === 'h' ? '10px 20px' : '10px 0px'
							}}
						>
							<div className={styles.name}>
								<p>{locale == 'en-US' ? appTitleEn : appTitle}</p>
							</div>
							<div className={classnames('omit-10',styles.intro)}>{locale == 'en-US' ? sloganEn : slogan}</div>
						</div>
					</div>
				</ReactResizeDetector>
			</div>
			<ConfigBar widgetKey={widgetKey} editMode={editMode} handleDeleteWidget={handleDeleteWidget} />

		</Card>
	)

}


export default connect(({ settings, loading }) => ({
	BASE_CONFIG: settings.BASE_CONFIG
}))(LogoBandWidget)

export { SnapShot, modelRegisterKey }

