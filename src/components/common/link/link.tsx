import React, { useMemo } from 'react'
import UmiLink from 'umi/link';
import { LinkProps } from 'react-router-dom'
import { connect } from 'dva';
import { isEmpty } from 'lodash'

import { formatParam } from './utils'
import { Store } from '@/models/connect'
import { MenuTypes } from '@/models/menu'

interface Props extends LinkProps {
    flatmenu: MenuTypes.flatMenu
}

const Link = (props: Props) => {
    const { flatmenu, to } = props
    const formatTo = useMemo(() => {
        if (isEmpty(flatmenu)) return to
        return formatParam(to as string, flatmenu)
    }, [flatmenu, to])

    return (
        <UmiLink {...props} to={formatTo} />
    )
}

export default connect(({ menu }: Store) => ({
    flatmenu: menu.flatmenu
}))(Link)