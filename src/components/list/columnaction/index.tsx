import React, { ReactNode, useMemo } from 'react'
import { Icon, Popconfirm, Tooltip } from 'antd'
import styles from './index.less'

interface ColumnActionProps {
  children: ReactNode;
  showEdit?: boolean;
  onEditClick?: Function;
  showDelete?: boolean;
  onDeleteClick?: Function;
  extraLeft?: ReactNode;
  extraRight?: ReactNode;
}

const Comp = (props: ColumnActionProps) => {
  const {
    showEdit = true,
    showDelete = true,
    onEditClick = () => { },
    onDeleteClick = () => { },
    extraLeft,
    extraRight,
    children,
  } = props

  const EditNode = useMemo(() =>
    showEdit && onEditClick && <Tooltip title={tr('编辑')} >
      <Icon type="edit" onClick={onEditClick} />
    </Tooltip>,
    [showEdit, onEditClick])

  const DeleteNode = useMemo(() =>
    showEdit && onDeleteClick && <Popconfirm
      title={`${tr('确定删除')}？`}
      okText={tr('确定')}
      cancelText={tr('取消')}
      onConfirm={onDeleteClick}
      okButtonProps={{
        type: 'danger'
      }}
    ><Tooltip title={tr('删除')} >
        <Icon type="delete" className='delete_icon' />
      </Tooltip>
    </Popconfirm>,
    [showEdit, onDeleteClick])

  return (<>
    <div className={styles.dynamic_action_button_wrap}>
      <div className={styles.dynamic_action_text}>{children}</div>
      {extraLeft}
      {EditNode}
      {DeleteNode}
      {extraRight}
    </div>
  </>)
}

export default Comp

