import React, { useMemo, useState, useCallback } from 'react'
import { Comment, Avatar, Tooltip, Icon, Popconfirm } from 'antd';
import Link from 'umi/link'
import CommentInput from './commentInput'
import { getImageById } from '@/utils/utils'
import moment from 'moment'
import styles from './index.less'
import { CommentItem } from './interface'
export interface Item extends CommentItem {
	handleSetting: Setting,
}
interface Setting {
	deleteComment: (arg: any) => any,
	modifyThumbUp: (arg: any) => any,
	modifyThumbDown: (arg: any) => any,
	createReply: (content: string, id: string) => any,
	checkReply?: (id: string) => any
}

const primaryColor = "var(--primary-color)";
const color = "var(--comment-action-color)"
export default function CommentItem(props: Item) {
	const { handleSetting, isReply, loginId, ...item } = props;
	const { userName, content, createDate,
		pictureId, thumbUp, thumbDown,
		thumbUpCount, createdBy,
		parentCreatedByName,
		parentCreatedBy,
		id,
	} = item;
	const [visible, setVisible] = useState(false)
	const modifyThumbUp = useCallback(() => {
		handleSetting.modifyThumbUp(item)
	}, [handleSetting.modifyThumbUp, item])
	const modifyThumbDown = useCallback(() => {
		handleSetting.modifyThumbDown(item)
	}, [handleSetting.modifyThumbDown, item])
	const deleteComment = useCallback(() => {
		handleSetting.deleteComment(id)
	}, [handleSetting.deleteComment, id])
	const createReply = useCallback(async (content) => {
		const cb = await handleSetting.createReply(content, id);
		if (cb) setVisible(false)
	}, [id])
	const checkReply = useCallback(() => {
		handleSetting.checkReply && handleSetting.checkReply(id)
	}, [handleSetting.checkReply, id])
	const actions = useMemo(() => {
		return [
			<span key="comment-basic-like" onClick={modifyThumbUp} style={{ color: thumbUp ? primaryColor : color, verticalAlign: 1 }} >
				<Tooltip title={tr("赞")}>
					<Icon
						type="like"
						theme={thumbUp ? 'filled' : 'outlined'}
					/>
				</Tooltip>
				<span style={{ paddingLeft: 2, cursor: 'auto' }}>({thumbUpCount})</span>
			</span>,
			createdBy != loginId && <span key="comment-basic-dislike"
				onClick={modifyThumbDown}
				style={{ color: thumbDown ? primaryColor : color }}
			>
				<Tooltip title={tr("踩")}>
					<Icon
						type="dislike"
						theme={thumbDown ? 'filled' : 'outlined'}
					/>
				</Tooltip>
			</span>,
			createdBy == loginId ? <span key="comment-basic-delete">
				<Popconfirm
					title={tr("确认删除该条评论") + "?"}
					onConfirm={deleteComment}
					okText={tr("删除")}
					okType='danger'
					okButtonProps={{
						size: 'small'
					}}
					cancelButtonProps={{
						size: 'small'
					}}

				>
					<Tooltip title={tr("删除")}>
						<Icon
							type="delete"
						/>
					</Tooltip>
				</Popconfirm>

			</span>
				:
				<span key="comment-basic-reply-to"
					onClick={() => setVisible(visible => !visible)}
					style={{ color: visible ? primaryColor : color }}  >{tr('回复')}</span>,
			!isReply && parentCreatedBy && <span key="comment-basic-check-reply"
				onClick={checkReply}  >{tr('查看相关回复')}</span>
		]
	}, [item, visible, modifyThumbUp, modifyThumbDown, deleteComment, checkReply])


	return <div className={styles.commentItem} >
		<Comment
			actions={actions}
			author={<span><Link to={`/common/user/${createdBy}`} >{userName}</Link>{parentCreatedBy && <><span style={{ margin: "0px 4px" }} >{tr("回复")}</span><Link to={`/common/user/${parentCreatedBy}`} >{parentCreatedByName}</Link></>}</span>}
			avatar={<Avatar size={32} src={getImageById(pictureId)} />}
			content={content}
			datetime={<Tooltip
				title={moment(createDate)
					.format('YYYY-MM-DD HH:mm:ss')}
			>
				<span>
					{moment(createDate).fromNow()}
				</span>
			</Tooltip>}
		/>
		{
			visible && <div className={styles.replyInput}  >
				<CommentInput onSubmit={createReply} placeholder={`${tr("回复")}${userName}...`} type='reply' />
			</div>
		}
	</div>
}