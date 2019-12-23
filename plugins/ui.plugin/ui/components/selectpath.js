import React, { useRef, useCallback, useMemo } from 'react'
import { TreeSelect, Input } from 'antd'

const CustomTreeSelect = (props) => {
  const { onChange: propsOnChange, value = '/', ...resetProps } = props

  const onChange = useCallback(
    (pathname, filename) => {
      propsOnChange(`${pathname}/${filename}`)
    },
    [],
  )

  const pathArray = useMemo(() => value.split('/'), [value])
  const treeValue = useMemo(() => pathArray.slice(0, -1).join('/') || '/', [pathArray])
  const pathValue = useMemo(() => pathArray.slice(-1)[0], [pathArray])
  const ref = useRef()
  return (
    <div ref={ref}>
      <Input.Group compact>
        <TreeSelect
          {...resetProps}
          labelInValue
          showSearch
          dropdownMatchSelectWidth={400}
          style={{ width: '30%' }}
          dropdownStyle={{
            backgroundColor: '#23232e',
          }}
          getPopupContainer={() => ref.current || document.body}
          onChange={({ value: treePath }) => onChange(treePath, pathValue)}
          value={{ value: treeValue }}
        />
        <Input style={{ width: '70%' }} value={pathValue} onChange={e => onChange(treeValue, e.target.value)} />
      </Input.Group>
    </div>
  )
}

export default CustomTreeSelect
