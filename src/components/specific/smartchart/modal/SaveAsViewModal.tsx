import React, { useCallback, memo, useEffect } from 'react'
import SmartModal from '@/components/specific/smartmodal'
import { Input, Form, Checkbox } from 'antd'

function SaveAsViewModal(props: any) {
	const { visible, handleSaveAs, handleCancelSaveAs, form: { getFieldDecorator, validateFieldsAndScroll, resetFields } } = props;
	const onOk = useCallback((e) => {
		validateFieldsAndScroll((errors: any, values: any) => {
			if (errors) return;
			const { name, isDefault } = values
			handleSaveAs(name, isDefault)
		})
	}, [validateFieldsAndScroll,handleSaveAs])
	useEffect(() => {
		if (!visible) resetFields()
	}, [resetFields, visible])
	return <SmartModal
		onCancel={handleCancelSaveAs}
		okText={tr("保存")}
		title={tr("另存视图")}
		okButtonProps={{
			icon: 'save'
		}}
		cancelButtonProps={{
			icon: 'close-circle'
		}}
		itemState={{
			height: 224,
		}}
		visible={visible}
		onOk={onOk}
		id="smartChart-SaveView-Modal"
		isModalDialog

	>
		<Form>
			<Form.Item label={tr('视图名称')}>
				{getFieldDecorator('name', {
					initialValue: "",
					rules: [{ required: true, message: tr('视图名称必填') }],
				})(<Input placeholder={tr('请输入视图名称')} maxLength={500} />)}
			</Form.Item>
			<Form.Item>
				{getFieldDecorator('isDefault', {
					valuePropName: 'checked',
					initialValue: false,
				})(<Checkbox>{tr('设为默认')}</Checkbox>)}
			</Form.Item>
		</Form>
	</SmartModal>
}
export default memo(Form.create()(SaveAsViewModal))