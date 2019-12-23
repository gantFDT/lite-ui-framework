import React, { useContext, useCallback } from 'react'
import Summary from './Summary'
import { Select } from 'antd';
import { ConfigContext } from '../index'
import { ConfigDataProps, FormulaField } from '../../interface'
import { Formula } from '../../enum'
import { findIndex, get } from 'lodash'
import styles from './index.less'
const Option = Select.Option;
export default function ConfigData(props: ConfigDataProps) {
	const { dataConfig, onChange } = props;
	const summary = get(dataConfig, "summary", []);
	const group = get(dataConfig, "group", "");
	const { columns = [] } = useContext(ConfigContext);
	const onGoroupChange = useCallback((group) => {
		onChange({ summary, group })
	}, [onChange, summary])
	const onSummayChange = useCallback((summary: FormulaField[]) => {
		onChange({ summary, group })
	}, [group, onChange])
	return <div className={styles.configContainer} >
		<div className={styles.summayTitle} >
			{tr("统计方式")}：
		</div>
		<Summary value={summary} onChange={onSummayChange} />
		<div className={styles.summayTitle} style={{ marginTop: 15 }} >
			{tr("分组")}：
		</div>
		<Select allowClear={true} onChange={onGoroupChange} value={group} className={styles.groupSelect} placeholder={tr("选择分组")} dropdownClassName={styles.grouDropdown} >
			{columns.map(item => <Option key={item.fieldName} value={item.fieldName} >
				<span style={{ color: "#ddd", marginRight: 4 }} >#</span>{item.title}
			</Option>)}
		</Select>
	</div>
}