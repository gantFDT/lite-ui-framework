import React, { useRef, useState, useContext, useCallback, useMemo, useEffect, } from 'react'
import classnames from 'classnames';
import { findDOMNode } from 'react-dom'
import { Tabs, Tooltip, Icon, Popover } from 'antd'
import { ConfigContext } from '../index'
import { SummaryItemProps } from '../../interface'
import { get, findIndex } from 'lodash'
import { getSummaryColumns } from '../../utils'
import formulas from '../../formula'
import styles from './index.less'
export default function SummaryItem(props: SummaryItemProps) {
	const { value, onChange, index, onDelete, allValues } = props;
	const popRef = useRef<HTMLDivElement>(null);
	const popContentRef = useRef<HTMLDivElement>(null)
	const { columns } = useContext(ConfigContext);
	const [tabkey, setTabkey] = useState("formula");
	const [formula, setFormula] = useState();
	const [visible, setVisible] = useState(false);
	const [width, setWidth] = useState(200)
	const selectFormula = useCallback((item) => {
		setFormula(item)
		setTabkey('name')
		if (value && item.formula === value.formula) {
			const element = document.getElementById(value.name)
			element && element.scrollIntoView()
		}
	}, [setFormula, setTabkey, value]);
	const selectedChange = useCallback((name) => {
		if (onChange) onChange({ name, formula: formula.formula }, index)
		setVisible(false)
		setTabkey("formula")
	}, [formula, onChange, setVisible, setTabkey, index])

	const toggerVisible = useCallback((event) => {
		event.stopPropagation();
		setVisible(!visible)
	}, [visible, setVisible]);
	const clickEvent = useCallback((event) => {
		const ele = event.target;
		if (popContentRef.current) {
			const tabEle = findDOMNode(popContentRef.current);
			if (tabEle && tabEle.contains(ele)) return
			if (visible) setVisible(false);
			setTabkey("formula")
		}

	}, [setVisible, popContentRef.current, visible, setTabkey])
	useEffect(() => {
		window.addEventListener('click', clickEvent)
		return () => window.removeEventListener('click', clickEvent)
	}, [clickEvent])
	const label = useMemo(() => {
		if (!value) return {}
		const index: number = findIndex(columns, { fieldName: value.name });
		const formulaIndex = findIndex(formulas, { formula: value.formula });
		return {
			name: get(columns, `[${index}].title`, ""),
			formula: get(formulas, `[${formulaIndex}].name`, "")
		}
	}, [value, formulas, columns])
	const clearSummary = useCallback((event) => {
		event.stopPropagation();
		index !== undefined && onDelete && onDelete(index)
	}, [index, onDelete])
	const newColumns = useMemo(() => {
		return getSummaryColumns(columns, allValues, formula)
	}, [formula, columns, getSummaryColumns, allValues])
	const onVisibleChange = useCallback((visible) => {
		if (visible) {
			if (popRef.current && popRef.current.clientWidth !== width) setWidth(popRef.current.clientWidth)
		}
	}, [popRef.current, width, setWidth])
	const content = (
		<div ref={popContentRef}  >
			<Tabs activeKey={tabkey} className={styles.summarizePopoverContent} >
				<Tabs.TabPane key="formula" tab="formula">
					<ul className={styles.summarizeList} >
						{
							formulas.map((item) => <li className={classnames(value && item.formula === value.formula && styles.selected)} key={item.formula} onClick={selectFormula.bind(null, item)} >
								<div>
									{item.name}
								</div>
								<span className={styles.questionTips} >
									<Tooltip title={item.tips}
										placement="bottomRight"
										overlayStyle={{ maxWidth: 120 }}
										arrowPointAtCenter={true}  >
										<Icon type="question-circle" />
									</Tooltip>
								</span>
							</li>)
						}
					</ul>
				</Tabs.TabPane>
				<Tabs.TabPane key="name" tab="name"  >
					<div className={styles.namelist} >
						<div className={styles.namelisTitle} >
							<span className={styles.icon} onClick={() => setTabkey('formula')} >
								<Icon type="left" />
							</span>
							{
								formula && formula.name
							}
						</div>
						<ul className={styles.summarizeList}>
							{
								newColumns.map(item => {
									const selected = (formula && value && formula.formula === value.formula && item.fieldName === value.name);
									const disabled = (!selected && item.disabled)
									return <li key={item.fieldName}
										id={item.fieldName}
										className={classnames(selected && styles.selected, disabled && styles.disabled)}
										onClick={disabled ? () => { } : selectedChange.bind(null, item.fieldName)} >
										<span style={{ color: "#ddd", marginRight: 4 }}>#</span>
										{item.title}
									</li>
								})
							}
						</ul>
					</div>
				</Tabs.TabPane>
			</Tabs>
		</div>
	)
	return <div ref={popRef} className={styles.summarize}  >
		<Popover placement='bottom' content={content}
			visible={visible}
			autoAdjustOverflow={false}
			overlayStyle={{ width }}
			overlayClassName={styles.popoverContent}
			onVisibleChange={onVisibleChange}
		>
			<div className={classnames(styles.summarizeButton, value && styles.hasSummary)}
				onClick={toggerVisible} >
				{
					value ? <div className={styles.summarizelabel} >
						<div>{label.name}{label.formula}</div>
						<span onClick={clearSummary} ><Icon type="close" /></span>
					</div> : <div className={styles.summarizeadd} ><Icon type="plus" /><span>{tr('添加数据公式')}</span></div>
				}
			</div>
		</Popover>
	</div>
}