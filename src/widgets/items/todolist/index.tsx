import React, { useEffect, useCallback, useState, useMemo } from 'react'
import { Card } from 'gantd';
import { Icon, Empty, Button, Tooltip, message, Tag, Popover } from 'antd'
import { connect } from 'dva';
import { ConfigBar, ConfigWrap } from '@/widgets/utils'
import { showInfoMsg } from '@/utils/utils'
import ConfigPanel from './ConfigPanel'
import UpdateTime from '@/components/common/updatetime'
import event from '@/utils/events';
import { SmartTable, LinkColumn, MiniTaskApprovePanel, SmartModal, UserColumn } from '@/components/specific'
import { CardList } from '@/components/list'
import { smartTableSchema } from './schema'
import { ModelProps } from './model'
import { doBatchApprovalApi } from './service'
import DispatchLogModal from '@/components/specific/workflow/dispatchlogmodal'
import FlowChart from '@/components/specific/workflow/flowchart'
import styles from './index.less'
import classnames from 'classnames'
import moment from 'moment'
import ReactResizeDetector from 'react-resize-detector';
import SnapShot from './snapshot.png'
const modelRegisterKey = 'widgetTodoList'

const DEFAULT_PROCESSIDS_TASKIDS: [string[], string[]] = [[], []]

interface Props {
	loading: any;
	[propname: string]: any;
}


const Widget = (props: Props) => {
	const {
		userId,
		data = [],
		fetch, reload,
		listLoading,
		itemHeight, editMode, widgetKey, handleDeleteWidget,
		showAutoUpdate,
	} = props;

	const [configVisible, setConfigVisible] = useState(false)
	const [columnSpan, setColumnSpan] = useState(2)

	const [selectedRowKeys, setRowKeys] = useState([]);
	const [selectedRows, setRows] = useState([]);
	const [quickActive, setQuickActive] = useState();
	const [flowChartVisible, setFlowChartVisible] = useState(false);
	const [miniTaskApprovePanelVisible, setMiniTaskApprovePanelVisible] = useState(false);

	const [flowChartRect, setFlowChartRect] = useState({
		width: 700,
		height: 450,
	})

	const [viewType, setViewType] = useState('card')

	const [approveLoading, setApproveLoading] = useState(false)
	const [dispatchLogModalVisible, setDispatchLogModalVisible] = useState(false)
	const [processIds, taskIds] = useMemo(() => {
		if (selectedRows.length === 0) return DEFAULT_PROCESSIDS_TASKIDS
		return selectedRows.reduce((res: [string[], string[]], item: any) => {
			const { id, processId } = item
			res[0].push(processId)
			res[1].push(id)
			return res
		}, [[], []])
	}, [selectedRows])

	//选中
	const handleSelect = useCallback((selectedRowKeys, selectedRows) => {
		setRowKeys(selectedRowKeys)
		setRows(selectedRows)
	}, [setRowKeys, setRows])

	//执行转派
	const handleTransTask = useCallback(() => {
		setDispatchLogModalVisible(true)
	}, [])

	// 转派成功
	const onDispatched = useCallback(() => {
		reload({})
	}, [])

	// 批量处理
	const handleBatchApproval = useCallback(async () => {
		if (selectedRowKeys.length === 0) {
			message.warn(tr('请选择一条审批任务'))
		}
		setApproveLoading(true)
		try {
			message.loading(tr('任务处理中...'), 0)
			const msg = await doBatchApprovalApi(selectedRowKeys)
			message.destroy()
			showInfoMsg(msg)
			reload({})
		} catch (error) {
		}
		setApproveLoading(false)
	}, [selectedRowKeys])

	useEffect(() => {
		event.on(modelRegisterKey, (params) => {
			fetch();
		})
		return () => {
			event.off(modelRegisterKey, (params) => {
				fetch();
			})
		};
	}, [])

	const onResize = useCallback((width: number, height: number) => {
		let layoutTemp: number
		if (width < 576) {
			layoutTemp = 1
		} else if (width > 576 && width < 768) {
			layoutTemp = 1
		} else if (width > 768 && width < 992) {
			layoutTemp = 2
		} else if (width > 992 && width < 1200) {
			layoutTemp = 2
		} else if (width > 1200 && width < 1600) {
			layoutTemp = 2
		} else if (width > 1600) {
			layoutTemp = 2
		} else {
			layoutTemp = 3
		}
		setColumnSpan(layoutTemp)
	}, [columnSpan])

	const handleActiveMiniApprove = useCallback((item) => {
		setMiniTaskApprovePanelVisible(!miniTaskApprovePanelVisible)
		setQuickActive(item)
	}, [miniTaskApprovePanelVisible])

	const handleActiveFlowChart = useCallback((item) => {
		setQuickActive(item)
		setFlowChartVisible(true)
	}, [])

	const handleFlowChartSizeChange = useCallback((width, height) => {
		setFlowChartRect({
			width,
			height
		})
	}, [])

	useEffect(() => {
		setRowKeys([])
		setRows([])
	}, [listLoading])

	return (<>
		<Card
			bordered={false}
			className="full"
			title={<span><Icon type="clock-circle" className="marginh5" />{tr('待处理任务')}</span>}
			bodyStyle={{ padding: '0px' }}
			extra={<>

				<Tooltip title={tr("批量审批")}>
					<Button
						size="small"
						icon="solution"
						type="default"
						className="marginh5"
						disabled={_.isEmpty(selectedRows)}
						onClick={handleBatchApproval}
						loading={approveLoading}
					>
						{tr('批量审批')}
					</Button>
				</Tooltip>
				<Tooltip title={tr("转派任务")}>
					<Button
						size="small"
						icon="retweet"
						type="default"
						className="marginh5"
						disabled={_.isEmpty(selectedRows)}
						onClick={handleTransTask}
					>
						{tr('转派任务')}
					</Button>
				</Tooltip>
				{viewType === 'card' ? <Tooltip title={tr('表格')}>
					<Button
						icon="table"
						size="small"
						className="marginh5"
						onClick={() => setViewType('table')}
					/>
				</Tooltip>
					:
					<Tooltip title={tr('卡片')}>
						<Button
							icon="appstore"
							size="small"
							className="marginh5"
							onClick={() => setViewType('card')}
						/>
					</Tooltip>
				}
				{showAutoUpdate ? <UpdateTime className="marginh5" refresh={() => reload()} />
					:
					<Button size="small" icon="reload" className="marginh5" onClick={() => reload()} loading={listLoading} />}
			</>}
		>
			{!_.isEmpty(smartTableSchema) ? <>
				{viewType === 'table' && <SmartTable
					tableKey={`${'widgetTodoList'}:${userId}`}
					rowKey="id"
					schema={smartTableSchema}
					dataSource={data}
					loading={listLoading}
					rowSelection={{
						type: 'checkbox',
						selectedRowKeys,
						onChange: handleSelect,
						showFooterSelection: false
					}}
					bodyHeight={itemHeight - 40 - 31}
					headerProps={{
						style: {
							display: 'none'
						}
					}}
				/>}

				{viewType === 'card' && <ReactResizeDetector handleWidth handleHeight onResize={onResize} key={1}>
					{!_.isEmpty(data) ? <CardList
						columnNumber={columnSpan}
						bodyHeight={itemHeight - 40}
						itemRender={(item: object) => {
							return <div className={classnames(styles.card, item['selected'] ? styles.active : '')}>
								<div className={styles.top}>

									<div className={classnames(styles.title,'omit-1')}>
										<LinkColumn
											pathname='/sysmgmt/accountcenter/taskdetail'
											text={item['resourceName']}
											params={{ ...item, taskType: 'current' }}
											paramNames={[['id', 'taskId'], 'processId', 'feedback', 'resourceName', 'resourceUri', 'moduleName', 'variables', 'taskType']}
										/>
										-
										<div className={classnames(styles.detail)}>{item['taskName']}</div>
									</div>

									<div className={styles.extra}>
										<Button
											size='small'
											className='marginh5'
											onClick={() => handleActiveFlowChart(item)}
										>{tr('流程图')}</Button>
										<Button size='small' type='primary' onClick={() => handleActiveMiniApprove(item)}>{tr('审批')}</Button>
									</div>
								</div>
								<div className={styles.bottom}>
									<div className={styles.time}>
										<div className={styles.startDate}>
											{moment(item['startDate']).format('MM-DD HH:mm')}
										</div>
										{item['dueDate'] && '-'}
										<div className={classnames(styles.dueDate, item['delay'] ? styles.delay : '')}>
											{item['dueDate'] && moment(item['dueDate']).format('MM-DD HH:mm')}
										</div>
									</div>
									{/* <div className={styles.user}>
										<div className={styles.avatar} style={{ backgroundImage: `url(${item['createByAvatarUrl']})` }} />
										<div className={styles.name}>{item['createByName']}</div>
									</div> */}
									<UserColumn userLoginName={item['createBy']} />
								</div>
							</div>
						}}
						dataSource={data}
						rowKey='id'
						loading={listLoading}
						selectedType='multi'
						selectedRowKeys={selectedRowKeys}
						onSelectChange={handleSelect}
						bodyStyle={{
							background: 'rgba(128,128,128,0.1)'
						}}
					/> :
						<div className="emptyContent" style={{ height: itemHeight - 40 }}>
							<Empty
								description={
									<span>
										{tr('暂无待处理任务')}
									</span>
								}
							/>
						</div>
					}
				</ReactResizeDetector>}

				<DispatchLogModal
					processIds={processIds}
					taskIds={taskIds}
					visible={dispatchLogModalVisible}
					onClose={() => setDispatchLogModalVisible(false)}
					onDispatched={onDispatched}
				/>
			</> :
				<div className="emptyContent" style={{ height: itemHeight - 40 }}>
					<Empty
						description={
							<span>
								{tr('还没有配置')},{tr('请进行配置')}
							</span>
						}
					/>
				</div>
			}
		</Card>
		<ConfigBar widgetKey={widgetKey} editMode={editMode} handleDeleteWidget={handleDeleteWidget} setVisible={setConfigVisible} />
		<ConfigWrap visible={configVisible} setVisible={setConfigVisible} width={800} widgetKey={widgetKey}>
			<ConfigPanel widgetKey={widgetKey} />
		</ConfigWrap>
		<SmartModal
			id='widget-todolist-flowchart'
			title={quickActive && quickActive['resourceName'] + '-' + quickActive['processDetail']}
			visible={flowChartVisible}
			itemState={{
				width: flowChartRect['width'],
				height: flowChartRect['height']
			}}
			footer={false}
			onSizeChange={handleFlowChartSizeChange}
			onCancel={() => setFlowChartVisible(false)}
		>
			{quickActive && <FlowChart
				processId={quickActive['processId']}
				width={flowChartRect['width'] - 20}
				height={flowChartRect['height'] - 40 - 20}
			/>}
		</SmartModal>
		<SmartModal
			id='widget-todolist-flowchart'
			title={quickActive && quickActive['resourceName'] + '-' + quickActive['processDetail']}
			visible={miniTaskApprovePanelVisible}
			itemState={{
				width: 360,
				height: 100
			}}
			canResize={false}
			footer={false}
			onCancel={() => setMiniTaskApprovePanelVisible(false)}
		>
			<MiniTaskApprovePanel
				title={tr('快速审批')}
				taskId={quickActive && quickActive['id']}
				hiddenOnManual={false}
				headerProps={{
					type: '1'
				}}
				onApproved={(restaskId) => {
					setMiniTaskApprovePanelVisible(false)
					reload()
				}}
			/>
		</SmartModal>
	</>
	)
}

export default connect(
	({ widgetTodoList, settings, loading, user }: { widgetTodoList: ModelProps, settings: any, loading: any, user: any }) => ({
		MAIN_CONFIG: settings.MAIN_CONFIG,
		userId: user.currentUser.id,
		userLoginName: user.currentUser.userLoginName,
		user,
		...widgetTodoList,
		listLoading: loading.effects['widgetTodoList/fetch'] || loading.effects['widgetTodoList/reload'],
	}),
	(dispatch: any) => {
		const mapProps = {};
		['fetch', 'reload', 'create', 'trans', 'update', 'save'].forEach(method => {
			let stateName = '';
			if (method === 'fetch') {
				stateName = 'data'
			}
			mapProps[method] = (data: object) => {
				dispatch({
					type: `widgetTodoList/${method}`,
					payload: data,
					stateName
				})
			}
		})
		return mapProps
	}
)(Widget)

export { SnapShot, modelRegisterKey }
