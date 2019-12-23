import React, { useReducer, useCallback, useEffect, useMemo } from 'react';
import { List, Button, Spin } from 'antd'
import {
	findListApi, createCommentApi,
	deleteCommentApi,
	findReplyListApi,
	modifyThumbUpApi, modifyThumbDownApi
} from './service'
import CommentItem, { Item } from './commentItem'
import { ResizableModal, ResizableProvider } from '@/components/common/modal'
import CardList from '@/components/list/cardlist'
import { findIndex } from 'lodash'
import styles from './index.less'
import { CommentProps } from './interface'
import { initState, reducers } from './reducer'
function CommentList(props: CommentProps, ref: any) {
	const { objId: initObjId, user, bodyHeight, loadType } = props;
	const [state, dispatch] = useReducer(reducers, initState);
	useEffect(() => {
		dispatch({ type: "save", payload: { objId: initObjId } })
	}, [initObjId, dispatch])
	const { data, objId, pageInfo, total, replyVisible, initLoading, loading, replyData, replyListLoading } = state;
	const findListInit = useCallback(async (pageInfo?: any) => {
		dispatch({
			type: "save", payload: {
				loading: true
			}
		})
		const { content, totalCount } = await findListApi({ filterInfo: { objId }, pageInfo: { ...initState.pageInfo, ...pageInfo } });
		dispatch({
			type: "save", payload: {
				data: content,
				total: totalCount,
				loading: false
			}
		})
	}, [objId, dispatch]);
	useEffect(() => {
		objId && findListInit()
	}, [objId])
	const findListMore = useCallback(async (beginIndex, pageSize) => {
		dispatch({
			type: "save", payload: { loading: true }
		})
		if (beginIndex + 1 >= total) return
		const newPageInfo = {
			beginIndex,
			pageSize
		}
		dispatch({ type: "save", payload: { pageInfo: newPageInfo } })
		const { content, totalCount } = await findListApi({ filterInfo: { objId }, pageInfo: newPageInfo });
		dispatch({
			type: "save", payload: {
				data: [...data, ...content],
				total: totalCount,
				loading: false,
			}
		})
	}, [objId, pageInfo.pageSize, dispatch, data, total]);

	const deleteComment = useCallback(async (id) => {
		await deleteCommentApi(id);
		const index = findIndex(data, { id });
		dispatch({
			type: "save", payload: {
				data: [...data.slice(0, index), ...data.slice(index + 1)]
			}
		})
		if (replyVisible) {
			const replyIndex = findIndex(replyData, { id });
			dispatch({
				type: "save", payload: {
					replyData: [...replyData.slice(0, replyIndex), ...replyData.slice(replyIndex + 1)]
				}
			})
		}
	}, [data, dispatch, replyVisible, replyData])
	const modifyThumbUp = useCallback(async (commentItem) => {
		const { id, thumbUp, thumbUpCount } = commentItem;
		await modifyThumbUpApi({ commentId: id, thumbUp: !thumbUp });
		const index = findIndex(data, { id });
		dispatch({
			type: "save", payload: {
				data: [...data.slice(0, index), { ...commentItem, thumbUp: !thumbUp, thumbUpCount: !thumbUp ? thumbUpCount + 1 : thumbUpCount - 1 }, ...data.slice(index + 1)]
			}
		})
		if (replyVisible) {
			const replyIndex = findIndex(replyData, { id });
			dispatch({
				type: "save", payload: {
					replyData: [...replyData.slice(0, replyIndex), { ...commentItem, thumbUp: !thumbUp, thumbUpCount: !thumbUp ? thumbUpCount + 1 : thumbUpCount - 1 }, ...replyData.slice(replyIndex + 1)]
				}
			})
		}
	}, [data, dispatch, replyVisible, replyData])
	const modifyThumbDown = useCallback(async (commentItem) => {
		const { id, thumbDown } = commentItem;
		await modifyThumbDownApi({ commentId: id, thumbDown: !thumbDown });
		const index = findIndex(data, { id });
		dispatch({
			type: "save", payload: {
				data: [...data.slice(0, index), { ...commentItem, thumbDown: !thumbDown }, ...data.slice(index + 1)]
			}
		})
		if (replyVisible) {
			const replyIndex = findIndex(replyData, { id });
			dispatch({
				type: "save", payload: {
					replyData: [...replyData.slice(0, replyIndex), { ...commentItem, thumbDown: !thumbDown }, ...replyData.slice(replyIndex + 1)]
				}
			})
		}
	}, [data, dispatch, replyVisible, replyData])

	const findReplyList = useCallback(async (id) => {
		dispatch({
			type: "save", payload: {
				replyListLoading: true
			}
		})
		const data = await findReplyListApi(id);
		dispatch({
			type: "save", payload: {
				replyListLoading: false,
				replyId: id,
				replyData: data
			}
		})
	}, [dispatch, findReplyListApi])
	const checkReply = useCallback((id) => {
		dispatch({ type: "save", payload: { replyVisible: true } });
		findReplyList(id)
	}, [dispatch, findReplyList])
	const closeReplyModal = useCallback(() => {
		dispatch({
			type: "save", payload: {
				replyVisible: false
			}
		})
	}, [dispatch])
	const addComment = useCallback((item) => {
		dispatch({
			type: "save", payload: {
				data: (loadType === 'default' || !loadType) ? [item, ...data].slice(0, pageInfo.pageSize) : [item, ...data],
				total: total + 1
			}
		})
		if (replyVisible) {
			dispatch({
				type: "save", payload: {
					replyData: [item, ...replyData]
				}
			})
		}
	}, [data, dispatch, replyVisible, replyData, total, pageInfo, loadType])
	const createReply = useCallback(async (content, id) => {
		const commentItem = await createCommentApi({ content, objId, parentId: id });
		addComment(commentItem)
		return true
	}, [objId, addComment]);
	useEffect(() => {
		ref.current = { addComment }
	}, [addComment])
	const onPageChange = useCallback((beginIndex, pageSize) => {
		findListInit({ beginIndex, pageSize })
	}, [findListInit])
	return <div className={styles.commentList} >
		<CardList
			loading={initLoading}
			dataSource={data}
			columnNumber={1}
			columnGutter={10}
			pageIndex={pageInfo.beginIndex}
			pageSize={pageInfo.pageSize}
			rowKey="id"
			itemRender={(item: Item) => <CommentItem key={item.key} {...item}
				loginId={user.id}
				handleSetting={{
					deleteComment,
					modifyThumbUp,
					modifyThumbDown,
					createReply,
					checkReply
				}}
			/>}
			totalCount={total}
			onPageChange={onPageChange}
			onLoadMore={findListMore}
			bodyHeight={bodyHeight}
			loadType={loadType}
		/>
		<ResizableProvider maxZIndex={12} initalState={{ height: 400, width: 600 }} >
			<ResizableModal isModalDialog={true}
				visible={replyVisible}
				onOk={closeReplyModal}
				onCancel={closeReplyModal}
				footer={null}
				title={tr("相关评论")}  >
				<List
					className={styles.commentList}
					loading={replyListLoading}
					itemLayout="horizontal"
					dataSource={replyData}
					renderItem={(item) => <CommentItem key={item.key} {...item}
						loginId={user.id}
						isReply={true}
						handleSetting={{
							deleteComment,
							modifyThumbUp,
							modifyThumbDown,
							createReply
						}}
					/>}
				/>
			</ResizableModal>
		</ResizableProvider>
	</div>
}
export default React.forwardRef(CommentList)