import React, { useMemo, useCallback } from 'react'
import { Input } from 'antd'
import { EditStatus, withEdit } from 'gantd'
import { compose, toClass, defaultProps } from 'recompose'
import CodeList from '../codelist'

import { getCodeNameSyncSto } from '@/utils/codelist'

import style from './index.less'


export enum UnitOrder {
    Left = 'left',
    Right = 'right'
}

interface Value {
    text?: string,
    type?: string
}

interface Props {
    unitType: string,
    value?: Value,
    onChange?: (v: Value) => void,
}

interface UnitInputPropsInner extends Props {
    addonAfter?: React.ReactNode,
    unitOrder: UnitOrder
}

interface UnitInputPropsOuter extends Props {
    unitOrder?: UnitOrder
}

const UnitInput: React.FC<UnitInputPropsInner> = (props) => {

    const { unitType, unitOrder, value, onChange, addonAfter, ...restProps } = props
    const { text, type } = useMemo(() => {
        if (value && typeof value === 'object') {
            return value
        }
        return {}
    }, [value])

    const onUnitChange = useCallback(
        (t) => {
            if (onChange) onChange({ text, type: t })
        },
        [text],
    )


    const addon = useMemo(() => <CodeList edit={EditStatus.EDIT} type={unitType} value={type} style={{ minWidth: 80 }} onChange={onUnitChange} />, [unitType, type])

    const addonProps = useMemo(() => {
        const obj = {}
        if (unitOrder === UnitOrder.Left) {
            obj['addonAfter'] = addonAfter
            obj['addonBefore'] = addon
        } else if (addonAfter) {
            obj['addonAfter'] = (
                <>
                    <span style={{ display: "inline-block", "borderRight": "1px solid #d9d9d9", "marginRight": 12 }}>{addon}</span>
                    {addonAfter}
                </>
            )
        } else {
            obj['addonAfter'] = addon
        }
        return obj
    }, [addon, unitOrder, addonAfter])

    const onInputChange = useCallback((e) => {
        const text = e.target.value
        if (onChange) onChange({ text, type })
    }, [type])

    return (
        <>
            <Input {...restProps} {...addonProps} value={text} onChange={onInputChange} className={style['unit-input']} />
        </>
    )
}

export default compose<UnitInputPropsInner, UnitInputPropsOuter>(
    toClass,
    defaultProps({
        allowEdit: false,
        edit: EditStatus.EDIT,
        unitOrder: UnitOrder.Right
    }),
    withEdit((props: UnitInputPropsInner) => {
        if (props.value) {
            const { text, type } = props.value
            const { unitOrder, unitType } = props
            const unit = getCodeNameSyncSto(unitType, type as string)
            return (unitOrder === UnitOrder.Right ? [text, unit] : [text, unit].reverse()).join('\u0020')
        }
        return ''
    })
)(UnitInput)