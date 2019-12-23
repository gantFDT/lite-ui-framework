import React, { useState, useCallback, memo } from 'react'
import { Input, Button } from 'antd'
import styles from './index.less'
import { CommentInputProps } from './interface'
const TextArea = Input.TextArea
const CommentInput: React.SFC<CommentInputProps> = ({ placeholder = "", onSubmit = () => true, type = 'comment', defaultValue }) => {
	const [value, setValue] = useState(defaultValue);
	const onChange = useCallback((e) => {
		const targetVal = e.target.value;
		setValue(targetVal)
	}, [setValue])
	const handleSubmit = useCallback(async () => {
		const cb = await onSubmit(value);
		if (cb) setValue("")
	}, [value, onSubmit])

	return <div className={styles.commentInput} >
		<TextArea
			placeholder={placeholder}
			autoSize={{ minRows: 2, maxRows: 6 }}
			value={value}
			onChange={onChange}
			onPressEnter={handleSubmit}
			autoComplete="on"
		/>
		<Button type='primary' onClick={handleSubmit} size="small"
			disabled={!value}
			className="btn-solid" >{
				type === 'comment' ? tr("评论") : tr("回复")
			}</Button>
	</div>
}

export default memo(CommentInput)