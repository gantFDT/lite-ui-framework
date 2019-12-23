import React, { useContext, useCallback, useEffect, useState } from 'react'
import { APIContext } from '../context'
import TreeSelect from './selectpath'


const formatRouter = (data) => data.reduce((list, item) => {
  if (!['/login', '/example', '/home'].includes(item.value)) {
    let { children, title } = item
    const { value, parentKey } = item
    if (title === '/' && value !== '/') {
      // title = '/' + value.split('/').pop()
      title = value.replace(parentKey, '')
    }
    if (children && children.length) {
      children = formatRouter(children)
    }
    list.push({ ...item, title, children })
  }
  return list
}, [])


const SelectPath = (props) => {
  const { ...resetProps } = props
  const { api } = useContext(APIContext)
  const [dataSource, setdataSource] = useState()
  const getRoutes = useCallback(
    async () => {
      const { data } = await api.callRemote({
        type: 'org.umi.block.routes',
      });
      setdataSource(formatRouter(data))
    },
    [],
  )

  useEffect(() => {
    getRoutes()
  }, [])
  return (
    <TreeSelect treeData={dataSource} {...resetProps} />
  )
}

export default SelectPath

