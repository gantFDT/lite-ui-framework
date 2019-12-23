import React, { useCallback, useState, useEffect, memo } from 'react'
import SmartModal from '@/components/specific/smartmodal'
import { Input } from 'antd'
function SaveViewModal(props: any) {
	const { visible, handleSave, name, handleCancelSave } = props;
	const [value, setValue] = useState(name);
	useEffect(() => {
		setValue(name)
	}, [name, setValue])
	const onChange = useCallback((e) => {
		const newValue = e.target.value;
		setValue(newValue)
	}, [setValue])
	const onOk = useCallback(() => {
		handleSave(name)
	}, [name, handleSave])
	return <SmartModal
		onCancel={handleCancelSave}
		okText={tr("保存")}
		title={tr("视图名称")}
		okButtonProps={{
			disabled: name == undefined || name === "",
			icon: 'save'
		}}
		cancelButtonProps={{
			icon: 'close-circle'
		}}
		itemState={{
			height: 140,
		}}
		visible={visible}
		onOk={onOk}
		id="smartChart-SaveView-Modal"
		isModalDialog
	>
		<Input value={value} onChange={onChange} />
	</SmartModal>
}
export default memo(SaveViewModal)