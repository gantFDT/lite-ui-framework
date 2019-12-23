import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Modal, Icon, Input, Select } from 'antd'
import SmartModal from '@/components/specific/smartmodal'
import FormSchema from '@/components/form/schema'
import { _codeTypeSchema, codeListSchema } from './schema'
import { isEmpty, get, cloneDeep } from 'lodash'
import styles from './style.less'
import { useCheckBlur } from '@/utils/hooks'
import { currentLangulage, langulageTypes } from './CodeListRight'
const Option = Select.Option;

export function ModalForm(props) {
	const { values, confirmLoading, onSubmit, onCancel, visible, formType } = props;
	const formRef = useRef(null)
	const submit = useCallback(async (values) => {
		onSubmit(values)
	}, [onSubmit])
	return <SmartModal
		isModalDialog={true}
		className={styles.modalForm}
		okText={tr("保存")}
		confirmLoading={confirmLoading}
		title={formType == "new" ? tr("新建") : tr("编辑")}
		onCancel={onCancel}
		onSubmit={submit}
		visible={visible}
		schema={_codeTypeSchema}
		bodyStyle={{ padding: 0 }}
		values={values}
		destroyOnClose
	/>
}
ModalForm.propTypes = {
	values: PropTypes.object,
	confirmLoading: PropTypes.bool,
	onSubmit: PropTypes.func,
	onCancel: PropTypes.func,
	visible: PropTypes.bool,
	formType: PropTypes.oneOf(["new", 'edit'])
}
ModalForm.defaultProps = {
	values: {},
	confirmLoading: false,
	onSubmit: () => { },
	onCancel: () => { },
	visible: false,
	formType: "new"
}

function NameInputRef(props, ref) {
	const { value, onChange, onFocus, onBlur, defaultValue } = props;
	const thisRef = useRef()
	const valJson = isEmpty(value) ? isEmpty(defaultValue) ? "{}" : defaultValue : value;
	const valObjt = JSON.parse(valJson);
	const [nameValue, setNameValue] = useState(valObjt)
	const zhVal = get(nameValue, 'zh_CN', "");
	const enVal = get(nameValue, 'en', "")
	const [visible, setVisible] = useState(false)
	const [language, setLanguage] = useState(langulageTypes[currentLangulage]);

	const selectBefore = useMemo(() => {
		return (<Select value={language} onChange={val => setLanguage(val)} style={{ width: 80 }}>
			<Option value="zh_CN">中文</Option>
			<Option value="en">English</Option>
		</Select>)
	}, [language])

	// const onEventClick = useCallback((event) => {
	// 	const targetEle = event.target;
	// 	if (thisRef.current.contains(targetEle) || findDataViewDom(targetEle, 'ant-select-dropdown')) { return }
	// 	// const modelEle = document.getElementsByClassName("NameInputModal")[0];
	// 	// const ele = document.getElementById("NameInput")
	// 	// if ((ele && ele.contains(targetEle)) || (modelEle && modelEle.contains(targetEle))) return;
	// 	// if (targetEle.className.indexOf && targetEle.className.indexOf("ant-select-dropdown-menu-item") >= 0) return;
	// 	onBlur && onBlur();
	// }, [onBlur, thisRef])

	// useEffect(() => {
	// 	window.addEventListener("mousedown", onEventClick);
	// 	return () => window.removeEventListener("mousedown", onEventClick);
	// }, [onEventClick])
	useCheckBlur(thisRef, onBlur)

	const data = { zh_CN: zhVal, en: enVal };

	const onModalok = useCallback(async (values) => {
		setNameValue(values)
		onChange(JSON.stringify(values));
		setVisible(false);
	}, [onChange, setVisible])

	const inputOnChange = useCallback(e => {
		const targetVal = e.target.value;
		const val = {
			zh_CN: zhVal,
			en: enVal
		}
		if (language == "zh_CN") val.zh_CN = targetVal;
		else val.en = targetVal;
		setNameValue(val)
		onChange(JSON.stringify(val))
	}, [enVal, zhVal, language, setNameValue])

	return <div ref={thisRef} >
		<SmartModal
			wrapClassName="NameInputModal"
			getContainer={thisRef.current}
			visible={visible}
			title={tr("编码名称")}
			values={data}
			onCancel={() => setVisible(false)}
			onSubmit={onModalok}
			maxZIndex={24}
			isModalDialog={true}
			schema={{
				type: "object",
				required: ["zh_CN", "en"],
				propertyType: {
					zh_CN: {
						title: "中文",
						type: "string"
					},
					en: {
						title: "English",
						type: "string"
					}
				}
			}}
		/>
		{
			language === "zh_CN" ? <Input
				addonBefore={selectBefore}
				addonAfter={<div
					onClick={() => setVisible(true)}
					style={{ cursor: "pointer", width: 20, lineHeight: "30px" }} >
					<Icon type="plus" />
				</div>
				}
				onChange={inputOnChange}
				value={zhVal}
				onFocus={onFocus}

			/> :
				<Input
					addonBefore={selectBefore}
					addonAfter={<div
						onClick={() => setVisible(true)}
						style={{ cursor: "pointer", width: 20, lineHeight: "30px" }} >
						<Icon type="plus" />
					</div>
					}
					value={enVal}
					onChange={inputOnChange}
					onFocus={onFocus}
				/>
		}

	</div>
}
export const NameInput = React.forwardRef(NameInputRef)
