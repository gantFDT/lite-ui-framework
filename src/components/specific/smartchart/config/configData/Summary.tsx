import React, { useEffect, useCallback, useState } from 'react'
import SummaryItem from './SummaryItem'
import { SummaryProps, FormulaField } from '../../interface'
export default function Summary(props: SummaryProps) {
	const { value, onChange } = props;
	const initState: FormulaField[] = []
	const [state, setState] = useState(initState)
	useEffect(() => {
		const initState: FormulaField[] = value ? value : [];
		setState(initState)
	}, [value, setState])
	const changeState = useCallback(state => {
		if (onChange) {
			onChange(state)
		}
		setState(state)
	}, [setState, onChange])
	const onItemChange = useCallback((item, index) => {
		const newState = [...state.slice(0, index), item, ...state.slice(index + 1)]
		changeState(newState)
	}, [changeState, state])
	const onItemAdd = useCallback(item => {
		const newState = [...state, item];
		changeState(newState)
	}, [changeState, state])
	const onItemDelete = useCallback((index: number) => {
		const newState = [...state.slice(0, index), ...state.slice(index + 1)];
		changeState(newState)
	}, [changeState, state])
	return <div>
		{
			state.map((item, index) => <SummaryItem
				key={item.name + item.formula}
				value={item}
				index={index}
				onChange={onItemChange}
				onDelete={onItemDelete}
				allValues={state}
			/>)
		}
		<SummaryItem onChange={onItemAdd} allValues={state} />
	</div>
}