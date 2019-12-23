import React, { useCallback } from 'react'
import Router from 'umi/router'
import _ from 'lodash'

interface LinkColumnProps {
  text: string // 描述文本
  pathname: string // 路由名称
  params?: Object // 参数对象
  paramNames?: Array<string | string[]> // 参数名列表
}

const INIT_OBJECT = {}
const INIT_ARRAY: any[] = []

/**
 * 页面链接列组件
 */
export default (props: LinkColumnProps) => {
  const {
    text,
    pathname,
    params = INIT_OBJECT,
    paramNames = INIT_ARRAY
  } = props

  const linkTo = useCallback(() => {
    let extra: any = {}
    if (!_.isEmpty(params)) {
      let query = params
      if (paramNames.length > 0) {
        query = paramNames.reduce((res: any, item) => {
          let paramName: string = ''
          let param: any = ''
          if (Array.isArray(item)) {
            paramName = item[1]
            param = params[item[0]]
          } else {
            paramName = item
            param = params[item]
          }
          res[paramName] = typeof param === 'object' ? JSON.stringify(param) : param
          return res
        }, {})
      }
      extra.query = query
    }

    Router.push({
      pathname,
      ...extra
    })
  }, [params])

  return (
    <a href='javascript:void(0)' onClick={linkTo}>{text}</a>
  )
}
