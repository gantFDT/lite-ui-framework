import React, { useMemo } from 'react'
import { FuncTypes } from './interface'
// import { Select, EditStatus } from 'gantd'
import { Selector, EditStatus } from 'gantd'
import { SelectProps } from 'antd/es/select'
import { keys } from 'lodash'

interface FuncTypeProps extends SelectProps {

}


const FuncType = (props: FuncTypeProps) => {
    const dataSource = useMemo(() => keys(FuncTypes).map(value => ({ value, label: FuncTypes[value] })), [])
    return (
        <Selector edit={EditStatus.EDIT} dataSource={dataSource} {...props} />
    )
}

export default FuncType

export { FuncTypes }
export { FuncTypeKeys } from './interface'
