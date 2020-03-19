import React, { useState, useCallback } from 'react'
import { Row, Col, Button, Empty, Icon, Tooltip, Avatar, Badge } from 'antd';
import { Card } from 'gantd'
import styles from './index.less'
import classnames from 'classnames'
import { connect } from 'dva'

import Link from 'umi/link'
import { ConfigBar } from '@/widgets/utils'
import ReactResizeDetector from 'react-resize-detector';

import SnapShot from './snapshot.png'
const modelRegisterKey = ''

const Widget = (props: any) => {
	const { currentUser, organizationInfo, itemHeight, editMode, widgetKey, handleDeleteWidget } = props;
	const [layout, setLayout] = useState('h')

	const onResize = useCallback((w: number, h: number) => {
		let layoutTemp: string
		if (w / 2 < h) {
			layoutTemp = 'v'
		} else {
			layoutTemp = 'h'
		}
		setLayout(layoutTemp)
	}, [])

	return (<Card
		bordered={false}
		className={classnames('full', styles.Widget)}
		loading={false}
		style={{ height: itemHeight }}
		bodyStyle={{ padding: '0px' }}
	>

		<Row style={{ height: itemHeight }}>
			<Col
				span={24}
				style={{
					justifyContent: 'center',
					paddingTop: '30px',
					display: 'flex',
					height: 'calc(100% - 40px)'
				}}>
				<div style={{ textAlign: 'center', width: '100%', height: '100%', fontSize: '12px' }}>
					<ReactResizeDetector handleWidth handleHeight onResize={onResize} key={1}>
						<Row>
							<Col
								span={layout === 'h' ? 8 : 24}
							>
								<Link to={`/common/user/${currentUser.id}`}>
									<Avatar src={currentUser.avatar} style={{
										cursor: 'pointer', border: '5px solid rgba(0,0,0,0.05)', boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
										width: itemHeight / 3,
										height: itemHeight / 3
									}} />
								</Link>
							</Col>
							<Col
								span={layout === 'h' ? 16 : 24}
							>
								<div style={{
									textAlign: layout === 'h' ? 'left' : 'center',
									fontSize: '16px',
									fontWeight: 'bold',
									marginTop: layout === 'h' ? '0' : '20px',
								}}>
									{currentUser.userName}
									{currentUser.gender === 'MALE' && <Icon style={{ color: '#1890FF', marginLeft: '5px' }} type="man" />}
									{currentUser.gender === 'FEMALE' && <Icon style={{ color: '#EA4C89', marginLeft: '5px' }} type="woman" />}
								</div>
								{/* <div
									style={{
										textAlign: layout === 'h' ? 'left' : 'center',
									}}
								>{organizationInfo.fullOrgName} {organizationInfo.fullOrgName && currentUser.position ? '|':''}
								 {currentUser.position}
								 </div> */}
							</Col>
						</Row>
					</ReactResizeDetector>
				</div>
			</Col>
			<Col span={24} style={{
				height: '40px',
				borderTop: '1px solid rgba(125,125,125,0.1)'
			}}>
				<Row style={{ height: '100%' }}>
					<Link to={`/common/user/${currentUser.id}`}>
						<Tooltip title={tr('我的信息')}>
							<Col span={12}
								className={styles.iconStyle}
							>
								<Icon type="contacts" />
							</Col>
						</Tooltip>
					</Link>
					<Link to={`/sysmgmt/account/personal`}>
						<Tooltip title={tr('个人设置')}>
							<Col span={12}
								className={styles.iconStyle}
							>
								<Icon type="setting" />
							</Col>
						</Tooltip>
					</Link>

				</Row>
			</Col>
		</Row>

		<ConfigBar widgetKey={widgetKey} editMode={editMode} handleDeleteWidget={handleDeleteWidget} />
	</Card>)
}



export default connect(({ user }: { user: any }) => ({
	currentUser: user.currentUser,
	// organizationInfo: getOrganizationInfo(user.currentUser.organizationId)
}))(Widget)

export { SnapShot, modelRegisterKey }