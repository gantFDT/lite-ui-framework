import React, { useCallback, ReactNode } from 'react'
import { Icon, Tag, Tooltip, Popconfirm, Empty } from 'antd'
import _ from 'lodash'
import styles from './index.less'
import { UpdateViewProps, ViewType, DefaultView } from './index'
import { Header } from 'gantd'
interface PanelProps {
  viewId?: string // 当前视图id
  viewType: ViewType// 视图类型
  title: string // 标题
  views: any[] // 视图列表
  isSystemDefault?: boolean // 是否在系统视图显示默认
  switchActiveView: Function // 切换视图的回调
  updateView: Function // 更新视图的回调
  setShowModal?: Function // 显示修改名称modal的回调
  setViewName?: Function // 修改名称的回调
  setEditView?: Function // 修改当前编辑中的视图回调
  defaultViewId: string // 默认视图id
  onDefaultViewChange: (params: DefaultView) => void // 默认视图更新回调
  extra?: string | ReactNode// 插槽
}

export default (props: PanelProps) => {
  const {
    viewId,
    title,
    views,
    viewType,
    switchActiveView,
    updateView,
    setShowModal,
    setViewName,
    setEditView,
    defaultViewId,
    onDefaultViewChange,
    extra
  } = props

  const onViewChange = useCallback((item: any) => {
    switchActiveView && switchActiveView(item)
  }, [switchActiveView])

  // 删除
  const onDelete = useCallback((item: any, e: any) => {
    e.stopPropagation()
    let newViews: any[] = []
    newViews = views.filter(item_ => !_.isEqual(item, item_))
    let res: UpdateViewProps = {
      views: newViews,
      type: 'delete',
      operateView: item
    }
    updateView && updateView(res)
  }, [views, updateView])

  // 重命名
  const onEditView = useCallback((item: any, e: any) => {
    e.stopPropagation()
    setViewName && setViewName(item.name)
    setShowModal && setShowModal(true)
    setEditView && setEditView(item)
  }, [])

  // 设置默认
  const onSetDefault = (type: ViewType, viewId: string) => {
    onDefaultViewChange && onDefaultViewChange({
      type,
      viewId
    })
  }

  return (
    <div className={styles.panel}>
      <Header title={title} type="none" extra={extra} />
      <ul className={styles.content}>
        {views.length === 0 && (<Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            tr('暂无视图')
          }
        >
        </Empty>)}
        {views.map((item) => {
          const { viewId: id, name } = item
          return (
            <li key={name}>
              <div className={styles.leftContent} onClick={onViewChange.bind(null, item)}>
                <span>{name}</span>
                {id === defaultViewId && (
                  <Tag className={styles.tag}>&nbsp;{tr('默认')}</Tag>
                )}
              </div>
              <div className={styles.operates}>
                {id !== defaultViewId && (
                  <span
                    className={styles.operate}
                    onClick={onSetDefault.bind(null, viewType, id)}>{tr('设为默认')}</span>
                )}
                {viewType === 'custom' && (
                  <>
                    <Tooltip title={tr('重命名')}>
                      <Icon
                        className={`gant-margin-h-5 ${styles.operate}`}
                        type='edit'
                        onClick={onEditView.bind(null, item)}
                      />
                    </Tooltip>
                    {viewId !== id && (
                      <Popconfirm
                        placement="topRight"
                        title={tr('确认删除当前视图？')}
                        onConfirm={onDelete.bind(null, item)}
                      >
                        <Tooltip title={tr('删除')}>
                          <Icon
                            className={`${styles.operate} ${styles.delete}`}
                            type='delete'
                          />
                        </Tooltip>
                      </Popconfirm>
                    )}
                  </>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
