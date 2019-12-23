import React, { useContext, useCallback, useEffect, useState } from 'react'
import { APIContext } from '../context'
import TreeSelect from './selectpath'

const SelectFolder = (props) => {
  const { ...resetProps } = props
  const { api } = useContext(APIContext)
  const [dataSource, setdataSource] = useState()
  const getRoutes = useCallback(
    async () => {
      const { data } = await api.callRemote({
        type: 'org.umi.block.pageFolders',
      });

      const folder = data.reduce((list, item) => {
        // 只能添加到已存在的业务模块中
        if (item.title !== 'example' && item.title !== '/') {
          list.push(item)
        }
        return list
      }, [])
      setdataSource(folder)
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

export default SelectFolder

