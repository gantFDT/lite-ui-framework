import React, { useMemo, memo } from 'react'
import SmartModal from '@/components/specific/smartmodal'
import ChartConfig from '../config'
import { Icon, Button } from 'antd'
import { isEmpty, isEqual } from 'lodash'
import styles from '../index.less'
function ChartConfigModal(props: any) {
	const {
		View,
		visible,
		handleCancel,
		onSaveAs,
		onSave,
		activeView,
		editSchema,
		columns,
		setEditSchema,
	} = props;
	const saveAsDisabled = useMemo(() => {
		if (isEmpty(editSchema)) return true;
		return isEqual(editSchema, activeView)
	}, [editSchema, activeView])
	return <SmartModal
		id="smartChartModal"
		title={<div className={styles.configHeaderTitle}  >
			<Icon className={styles.configHeaderTitleIcon} type="setting" />
			<span style={{ marginRight: 10 }} >{tr('图形数据配置')}</span>
			{View}
		</div>}
		isModalDialog
		visible={visible}
		minHeight={600}
		minWidth={500}
		onCancel={handleCancel}
		footer={<div>
			<Button size="small"
				icon='close-circle'
				onClick={handleCancel}
			>{tr('取消')}</Button>
			<Button size="small"
				disabled={saveAsDisabled}
				icon='diff'
				onClick={onSaveAs}
			>{tr('另存为')}</Button>
			<Button size="small"
				type='primary'
				icon='save'
				onClick={onSave}
				disabled={activeView.viewType === "system"}
			>{tr('保存')}</Button>
		</div>
		}
	>
		<ChartConfig columns={columns} chartView={editSchema} setEditSchema={setEditSchema} />
	</SmartModal>
}
export default memo(ChartConfigModal)