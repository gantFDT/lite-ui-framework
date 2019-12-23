import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { Button, Row, Switch, Avatar } from 'antd'
import { Card } from 'gantd'
import { SmartModal } from '@/components/specific'
import FormSchema from '@/components/form/schema'
import ImageSelector from '@/components/form/upload/ImageSelector'

import { FormTypes } from './index'
import { userFormSchema, userBiscFormSchema, passwordSchema } from './schema'
import { getImageById } from '@/utils/utils';
import styles from './style.less'
const customFields = [{
	type: "Switch",
	component: Switch
}]
interface Props {
	value: any,
	onSubmit: (vals: any) => void,
	formType: FormTypes,
	onCancel: () => void
	confirmLoading: boolean,
	visible: boolean,
	staffNumberFormat?: any
}

const tabList = [
	{
		key: 'baseinfo',
		tab: tr('基本信息')
	},
	{
		key: 'extrainfo',
		tab: tr('其他信息')
	}
]
const initValue = {
	isActive: true,
	userType: "EMPLOYEE"
}
export default function UserFormModal(props: Props) {
	const { value, formType, onSubmit, onCancel, confirmLoading, visible, staffNumberFormat } = props;
	const [data, setData] = useState(value ? value : initValue);
	useEffect(() => {
		if (!visible) setData(initValue)
		setData(value)
	}, [value, setData, visible])
	const { pictureId } = data;
	const [curTabKey, setCurTabKey] = useState('baseinfo');
	const [height, setHeight] = useState(480)
	const formRef = useRef<any>({} as any);
	const newPasswordSchema: any = useMemo(() => {
		if (!formRef.current) return passwordSchema
		const { getFieldsValue, validateForm } = formRef.current
		const repeatPassword = { ...passwordSchema.repeatPassword };
		const password = { ...passwordSchema.password };
		password["props"] = {
			...password.props,
			placeholder: tr("用户密码需为3至15位数字或字母好的")
		}
		password["options"] = {
			rules: [{
				validator(rule: any, value: string, callback: (val?: string) => void) {
					if (value && getFieldsValue(['repeatPassword'])['repeatPassword']) {
						validateForm(['repeatPassword'], { force: true })
					}
					callback()
				}
			}, {
				max: 15,
				message: tr("密码不能多于15")
			}, {
				min: 6,
				message: tr("密码不能少于6")
			}
			]
		}
		repeatPassword["options"] = {
			rules: [{
				validator(rule: any, value: string, callback: (val?: string) => void) {
					if (value && value !== getFieldsValue(['password'])['password']) {
						return callback(tr('两次密码输入不一致'))
					}
					callback()
				}
			}]
		}
		return { password, repeatPassword }
	}, [passwordSchema, formRef.current, visible])

	const isCreate = useMemo(() => {
		return formType === FormTypes.create
	}, [formType])
	const sechema = useMemo(() => {
		if (isCreate) {
			const { userLoginName, userName, ...othersSchema } = userFormSchema["propertyType"];
			return { ...userFormSchema, propertyType: { userLoginName, userName, ...newPasswordSchema, ...othersSchema } }
		} else {
			const { userLoginName, ...othersSchema } = userFormSchema["propertyType"];
			const props = { ...userLoginName['props'], disabled: true }
			return { ...userFormSchema, propertyType: { userLoginName: { ...userLoginName, props }, ...othersSchema } }
		}
	}, [isCreate, userFormSchema, newPasswordSchema])
	const avatarSrc: string = useMemo(() => {
		return getImageById(pictureId)
	}, [pictureId])
	const changeForm = useCallback(
		(val) => {
			setData((_data: any) => ({ ..._data, ...val }))
		},
		[setData],
	)
	const handleSubmit = useCallback(async () => {
		const { errors } = await formRef.current.validateForm();
		if (errors) {
			if (curTabKey == "baseinfo") return
			return setCurTabKey("baseinfo")
		}
		onSubmit(data)
	}, [onSubmit, data, formRef.current, curTabKey, setCurTabKey])
	const defaultValue = useMemo(() => {
		return { ...initValue, ...value }
	}, [value])
	const userSchema = useMemo(() => {
		const { staffNumber, ...schemas } = userBiscFormSchema['propertyType'];
		return {
			...userBiscFormSchema,
			propertyType: {
				staffNumber: {
					...staffNumber,
					options: {
						rules: [{
							pattern: staffNumberFormat,
							message: tr("工号格式不正确")
						}]
					}
				}, ...schemas
			}
		}
	}, [staffNumberFormat])
	return <SmartModal
		id={"userlistModal" + '_modal_normal'}
		title={formType === FormTypes.create ? tr('创建') : tr("编辑") + "-" + value.userName}
		itemState={{ width: 760, height: height }}
		visible={visible}
		onCancel={onCancel}
		onSizeChange={(width: number, _height: number) => setHeight(_height)}
		footer={
			<>
				<Button size="small" onClick={onCancel} >{tr('取消')}</Button>
				<Button size="small" type='primary' loading={confirmLoading} onClick={handleSubmit}>{tr("保存")}</Button>
			</>
		}
	>
		<div className={styles.userModal} >
			<div className={styles.userAvatar} >
				<Avatar
					shape="square"
					size={175}
					icon="user"
					src={avatarSrc}
				/>
				<Row type="flex" justify="space-between" style={{ marginTop: 10 }} >
					<ImageSelector
						shape="circle"
						onConfirm={(ret: any) => {
							const { id } = ret
							changeForm({ pictureId: id })
						}}
					>
						<Button size="small" style={{ marginRight: 15 }}>{tr('上传头像')}</Button>
					</ImageSelector>
					<Button size="small" onClick={() => changeForm({ pictureId: value.pictureId })}>{tr('重置头像')}</Button>
				</Row>
			</div>
			<div className={styles.userInfoForm} >
				<Card
					tabList={tabList}
					activeTabKey={curTabKey}
					onTabChange={setCurTabKey}
					className={styles.card}
					bodyStyle={{ height: height - 148, overflow: "auto" }}
				>
					<div style={{ display: curTabKey === "baseinfo" ? "block" : "none" }} >
						<FormSchema customFileds={customFields} wrappedComponentRef={formRef} schema={sechema} data={defaultValue} onChange={changeForm} />
					</div>
					<div style={{ display: curTabKey === "extrainfo" ? "block" : "none" }} >
						<FormSchema schema={userSchema} data={defaultValue} onChange={changeForm} />
					</div>
				</Card>
			</div>
		</div>
	</SmartModal>
}