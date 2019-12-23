import React, { useCallback, useRef } from 'react'
import CommentInput from './commentInput';
import CommentList from './commentlist';
import { createCommentApi } from './service'
import styles from './index.less'
import { CommentProps } from './interface'
export default function Comment(props: CommentProps) {
	const { objId } = props;
	const listRef = useRef<any>(null)
	const createComment = useCallback(async (content) => {
		const commentItem = await createCommentApi({ content, objId })
		const { addComment } = listRef.current;
		addComment(commentItem)
		return true
	}, [objId, listRef]);
	return <div className={styles.commentWrapper} >
		<CommentInput placeholder={tr("请输入")} type='comment' onSubmit={createComment} />
		<CommentList {...props} ref={listRef} />
	</div>
}