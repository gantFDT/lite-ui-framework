import React, { useMemo, useEffect, useState } from 'react'
import { Icon as AntIcon, Tooltip } from 'antd'
import pathToRegexp from 'path-to-regexp'
import withRouter from 'umi/withRouter'
import { RouteComponentProps } from 'react-router-dom'
// import { findHelpTopicByPathApi } from '@/pages/sysmgmt/help/doc/service'
import { Link } from 'umi'
import classnames from 'classnames'
import { getModelData } from '@/utils/utils'
import styles from './index.less'

interface TitleProps extends RouteComponentProps {
  title?: string // 标题文本
  route?: any // 当前路由
  routePath?: any // 当前路由路径 route和routePath二选一
  showSplitLine?: boolean // 是否显示右边分割线
  showShortLine?: boolean // 是否显示左边断线
}

interface MergedItem {
  name: string,
  icon: string | React.ReactNode,
  path: string
}


export default withRouter(function Title(props: TitleProps) {
  const {
    title,
    showSplitLine = false,
    showShortLine = false,
    location: { pathname }
  } = props
  const [showQustion, setShowQuetion] = useState<boolean>(false)
  const menu = getModelData('menu')

  const { name, icon, path } = useMemo((): MergedItem => {
    const empty = {} as MergedItem
    if (!menu.merged) return empty
    for (const [megerdPath, mergedItem] of Object.entries(menu.merged)) {
      if (pathToRegexp(megerdPath).test(pathname)) {
        return mergedItem as MergedItem
      }
    }
    return empty
  }, [pathname, menu])

  return (
    <div
      className={classnames(styles.title, {
        [styles[`title-split-line`]]: showSplitLine,
        [styles[`title-short-line`]]: showShortLine
      })}
    >
      {icon && !title && <span className="gant-margin-h-5">{icon}</span>}
      {title || name}
      {showQustion && (
        <Tooltip title={tr('查看帮助文档')}>
          <Link to={`/help/globalhelpdoc?path=${path}`}>
            <AntIcon type="question-circle" className={styles.pointer} />
          </Link>
        </Tooltip>
      )}
    </div>
  )
})
