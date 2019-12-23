import React, { useReducer, useMemo, useEffect, useCallback } from 'react'
import { Button } from 'antd'
import { TableTransferModal } from '@/components/specific'
import RelateGroupSelect from '../RelateGroupSelect'
import reducer, { initState } from './reducer'
import { Props } from './interface'
import { TableTransferInnerProps } from '@/components/specific/tabletransfer'
import { difference } from 'lodash'
const itemState = {
	width: 1000,
	height: 600
}
export default function RelateModal(props: Props) {
	const { visible, transKey, title, onCancel, schema, columns,
		query, relate, removeRelate, rowKey,
		initRelateParams, initUnRelateParams,
		userInfo,
		uiSchema
	} = props;
	const [unRelateState, unRelateDispatch] = useReducer(reducer, initState);
	const [relateState, relateDispatch] = useReducer(reducer, initState);
	useEffect(() => {
		if (initUnRelateParams && initRelateParams&&visible) {
			queryUnRelate({
				filterInfo: initUnRelateParams,
				pageInfo: {
					beginIndex: 0,
					pageSize: 50
				}
			})
			queryRelate({
				filterInfo: initRelateParams,
				pageInfo: {
					beginIndex: 0,
					pageSize: 50
				}
			})
		}
	}, [initUnRelateParams, initRelateParams,visible]);
	const queryUnRelate = useCallback(async (params) => {
		unRelateDispatch({
			type: "save", payload: {
				loading: true,
				params: params
			}
		})
		try {
			const { content, totalCount } = await query(params)
			unRelateDispatch({
				type: "save", payload: {
					list: content,
					total: totalCount,
					loading: false
				}
			})
		} catch (error) {
			unRelateDispatch({
				type: "save", payload: {
					loading: false,
					params: { ...unRelateState.params }
				}
			})
		}
	}, [query, unRelateState.params, unRelateDispatch])
	const queryRelate = useCallback(async (params) => {
		relateDispatch({
			type: "save", payload: {
				loading: true,
				params: params
			}
		})
		try {
			const { content, totalCount } = await query(params)
			relateDispatch({
				type: "save", payload: {
					list: content,
					total: totalCount,
					loading: false
				}
			})
		} catch (error) {
			relateDispatch({
				type: "save", payload: {
					loading: false,
					params: { ...relateState.params }
				}
			})
		}
	}, [query, relateState.params, relateDispatch])
	const leftParams: TableTransferInnerProps = useMemo(() => {
		const { loading, params, total } = unRelateState;
		return {
			title: `${tr("未关联")}${title}`,
			loading,
			extraSearchProps: {
				uiSchema: {
					'ui:col': 12,
					...uiSchema
				},
				customComponents: [{
					name: "RelateGroupSelect",
					component: RelateGroupSelect
				}]
			},
			pagination: {
				...params.pageInfo,
				total
			}
		}
	}, [unRelateState, title])
	const rightParams: TableTransferInnerProps = useMemo(() => {
		const { loading, params, total } = relateState;
		return {
			title: `${tr("已关联")}${title}`,
			loading,
			extraSearchProps: {
				uiSchema: {
					'ui:col': 12,
					...uiSchema
				},
				customComponents: [{
					name: "RelateGroupSelect",
					component: RelateGroupSelect
				}]
			},
			pagination: {
				...params.pageInfo,
				total
			}
		}
	}, [relateState, title]);
	const dataSource: any[] = useMemo(() => {
		return [...unRelateState.list, ...relateState.list]
	}, [relateState.list, unRelateState.list])
	const targetKeys: any[] = useMemo(() => {
		return relateState.list.map((item: any) => item[rowKey])
	}, [rowKey, relateState.list])
	const onChange = useCallback(async (changeKeys) => {
		//关联
		if (changeKeys.length > targetKeys.length) {
			const keys = difference(changeKeys, targetKeys);
			const newUnRelateList: any[] = [], changeList: any[] = []
			unRelateState.list.map((item: any) => {
				if (keys.indexOf(item[rowKey]) >= 0) {
					changeList.push(item)
				} else {
					newUnRelateList.push(item)
				}
			})
			unRelateDispatch({
				type: "save", payload: {
					list: newUnRelateList,
					total: unRelateState.total - keys.length
				}
			})
			relateDispatch({
				type: "save", payload: {
					list: [...relateState.list, ...changeList],
					total: relateState.total + keys.length
				}
			})
			try {
				relate(keys)
			} catch (error) {
				unRelateDispatch({
					type: "save", payload: {
						list: unRelateState.list,
						total: unRelateState.total
					}
				})
				relateDispatch({
					type: "save", payload: {
						list: relateState.list,
						total: relateState.total
					}
				})
			}
		} else {
			//取消关联
			const keys = difference(targetKeys, changeKeys);
			const newRelateList: any[] = [], changeList: any[] = [];
			relateState.list.map((item: any) => {
				if (keys.indexOf(item[rowKey]) >= 0) {
					changeList.push(item)
				} else {
					newRelateList.push(item)
				}
			})
			unRelateDispatch({
				type: "save", payload: {
					list: [...unRelateState.list, ...changeList],
					total: unRelateState.total + keys.length
				}
			})
			relateDispatch({
				type: "save", payload: {
					list: newRelateList,
					total: relateState.total - keys.length
				}
			})
			try {
				removeRelate(keys)
			} catch (error) {
				unRelateDispatch({
					type: "save", payload: {
						list: unRelateState.list,
						total: unRelateState.total
					}
				})
				relateDispatch({
					type: "save", payload: {
						list: relateState.list,
						total: relateState.total
					}
				})
			}
		}
	}, [targetKeys, relateState.list, relateState.total, unRelateState.list, unRelateState.total, relateDispatch, unRelateDispatch, rowKey])
	const onSearch = useCallback((direction, searchFilterInfo, searchpageInfo) => {
		if (direction === "left") {
			queryUnRelate({ filterInfo: { ...initUnRelateParams, ...searchFilterInfo }, pageInfo: { ...searchpageInfo } })
		} else {
			queryRelate({ filterInfo: { ...initRelateParams, ...searchFilterInfo }, pageInfo: { ...searchpageInfo } })
		}
	}, [queryUnRelate, queryRelate, initRelateParams, initUnRelateParams])
	return <TableTransferModal
		transKey={transKey}
		title={`${tr("关联")}${title}-${userInfo}`}
		visible={visible}
		onCancel={onCancel}
		extraModalProps={{
			itemState,
			footer: null
		}}
		rowKey={rowKey}
		schema={schema}
		columns={columns}
		left={leftParams}
		right={rightParams}
		dataSource={dataSource}
		onSearch={onSearch}
		targetKeys={targetKeys}
		onChange={onChange}
	/>
}