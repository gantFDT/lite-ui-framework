import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Checkbox, Row, Col } from 'antd';
import { CheckboxGroupProps } from 'antd/lib/checkbox'
import { isEqual } from 'lodash'
import styles from './index.less'
const CheckboxGroup = Checkbox.Group;
interface State {
	checkedList: any,
	indeterminate: boolean,
	checkAll: boolean,
}
interface Props extends CheckboxGroupProps {
	title?: string,
	span?: number
}
const CheckboxAll: React.SFC<Props> = ({ options = [], defaultValue = [],
	span = 8,
	value = [], title = "全部", ...props }, ref: any) => {
	const { onChange, ...checkProps } = props;
	const [state, setState] = useState({
		checkedList: defaultValue,
		indeterminate: false,
		checkAll: false,
	} as State)
	useEffect(() => {
		setState((_state: State) => {
			const checkedList = value ? value : [];
			if (isEqual(_state.checkedList, checkedList)) return _state
			return ({ ..._state, checkedList: value })
		})
	}, [setState, value])
	const allValue = useMemo(() => options.map((item: string | any) => {
		if (typeof item === "string") return item
		return item.value
	}), [options])
	const onGroupChange = useCallback((checkedList) => {
		setState({
			checkedList,
			indeterminate: !!checkedList.length && checkedList.length < options.length,
			checkAll: checkedList.length === options.length,
		});
		onChange && onChange(checkedList)
	}, [setState, options, onChange])

	const onCheckAllChange = useCallback(e => {
		const checkedList = e.target.checked ? allValue : []
		setState({
			checkedList,
			indeterminate: false,
			checkAll: e.target.checked,
		});
		onChange && onChange(checkedList)
	}, [setState, allValue])
	const { checkedList, checkAll, indeterminate } = state;
	return (
		<div className={styles.checkboxAll} >
			<span>
				{title}
			</span>
			<Checkbox
				indeterminate={indeterminate}
				onChange={onCheckAllChange}
				checked={checkAll}
			>
			</Checkbox>
			<p style={{ marginBottom: 8 }} />
			<CheckboxGroup
				{...checkProps}
				ref={ref}
				value={checkedList}
				onChange={onGroupChange}
				style={{ width: "100%" }}
			>
				<Row gutter={10} >
					{
						options && options.map((item: any) => <Col span={span} key={item.value} >
							<Checkbox value={item.value}>{item.label}</Checkbox>
						</Col>)
					}
				</Row>
			</CheckboxGroup>
		</div>
	);
}
export default React.forwardRef(CheckboxAll)