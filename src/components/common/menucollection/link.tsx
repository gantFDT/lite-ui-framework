import React, { useContext, useCallback } from 'react'
import router from 'umi/router'

import FilterContext from './filtercontext';

interface LinkProps {
    target: string,
    name: string,
    [prop: string]: any
}

const Link = (props: LinkProps) => {
    const { target, name, ...prop } = props
    const { onClose } = useContext(FilterContext)
    const onClick = useCallback(
        () => {
            onClose()
            router.push(target)
        },
        [onClose, target],
    )
    return <div onClick={onClick} {...prop}>{name}</div>
}

export default Link
