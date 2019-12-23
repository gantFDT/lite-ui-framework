import React, { useCallback, useState, useEffect } from 'react'
import { Selector } from 'gantd'
import proptypes from 'prop-types'

import { getCodeList } from '@/utils/codelist'

const boolMap = new Map(
  [
    ['false', false],
    ['true', true],
    [false, "false"],
    [true, 'true']
  ]
)

function formatBoolValue(value) {
  if (boolMap.has(value)) {
    return boolMap.get(value)
  }
  return value
}

const CodeList = React.forwardRef(
  (props, ref) => {
    const { type, value, onChange, onSave, ...prop } = props
    const [labelFn, setlabelFn] = useState(null)
    const [list, setList] = useState([])

    useEffect(
      () => {
        if (labelFn && list.length) {
          list.forEach(item => {
            if (item.value === formatBoolValue(value)) {
              labelFn(item.name)
            }
          })
        }
      },
      [list, labelFn]
    )

    const query = useCallback(
      () => getCodeList(type).then(data => {
        setList(data)
        return data
      }),
      [labelFn]
    )

    const [boolValue, setboolValue] = useState(formatBoolValue(value))

    useEffect(() => {
      setboolValue(formatBoolValue(value))
    }, [value])

    const onValueChange = useCallback(
      (val) => {
        onChange(formatBoolValue(val))
      },
      []
    )

    // 保存修改label的方法
    const getLabelText = useCallback(
      (v, cb) => {
        setlabelFn(() => cb)
      }
    )

    const save = useCallback(
      (id, val, cb) => {
        onSave(id, formatBoolValue(val), cb)
      },
      []
    )

    return (
      <div ref={ref}>
        <Selector useStorage={false} selectorId={type} query={query} valueProp='value' labelProp='name' value={boolValue} getLabelText={getLabelText} onChange={onValueChange} onSave={save} {...prop} />
      </div>
    )
  }
)

CodeList.propTypes = {
  type: proptypes.string.isRequired
}

export default CodeList