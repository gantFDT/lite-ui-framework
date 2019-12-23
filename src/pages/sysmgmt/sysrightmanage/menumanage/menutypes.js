import React from 'react'
import { getLocale } from 'umi/locale'

import { zip } from 'lodash'
import { Icon } from 'gantd';
import { getRealIcon } from '@/utils/utils'

const locale = getLocale()


// 主菜单
// export const MAINTYPES = ["WEBMENU_CATEGORY", "WEBMENU_CATEGORY_ITEM"]
// react版菜单配置
export const MAINTYPES = ["REACTMENU_CATEGORY", "REACTMENU_CATEGORY_ITEM"]
export const NAINNAME = ['菜单分类', '菜单项']
export const MAINMAP = new Map(zip(MAINTYPES, NAINNAME))

// 移动端菜单
export const MOBILETYPES = ["MOBILEMENU_CATEGORY", "MOBILEMENU_CATEGORY_ITEM"]
export const MOBILENAME = ["菜单页面", "菜单项"]
export const MOBILEMAP = new Map(zip(MOBILETYPES, MOBILENAME))

// 上下文菜单
export const CONTEXTTYPES = ["CONTEXTPAGE_CATEGORY", "CONTEXTPAGE_CATEGORY_ITEM"]
export const CONTEXTNAME = ["context分类", "context菜单项"]
export const CONTEXTMAP = new Map(zip(CONTEXTTYPES, CONTEXTNAME))

export const TYPESMAP = {
    main: MAINTYPES,
    mobile: MOBILETYPES,
    context: CONTEXTTYPES,
}

export const NAMEMAP = {
    main: NAINNAME,
    mobile: MOBILENAME,
    context: CONTEXTNAME,
}

export const MAP = {
    main: MAINMAP,
    mobile: MOBILEMAP,
    context: CONTEXTMAP,
}

export const renderCode = type => code => MAP[type].get(code)


const renderIcon = iconString => {
    if (!iconString) return null
    const icon = getRealIcon(iconString)
    if (!icon) return null
    return <Icon type={icon} /> // 使用的是图标库的图标
}


const renderName = name => {
    try {
        const data = JSON.parse(name)
        for (const key of Object.keys(data)) {
            if (key.startsWith(locale.slice(0, 2))) {
                return data[key]
            }
        }
    }
    catch{
        return tr('未知名称')
    }
    return ''
}
export const COLUMNS = {
    main: [
        {
            title: tr('名称'),
            fieldName: 'name',
            align: 'left',
            width: 200,
            render: renderName
        },
        {
            title: tr('类型'),
            fieldName: 'type',
            align: 'left',
            width: 150,
        },
        {
            title: tr('菜单项操作地址'),
            fieldName: "path",
            align: 'left',
        },
        {
            title: tr('图标'),
            fieldName: 'icon',
            align: 'center',
            width: 50,
            render: renderIcon
        },
        {
            title: tr('描述'),
            fieldName: 'description',
            align: 'left',
        },
    ],
    mobile: [
        {
            title: tr('名称'),
            fieldName: 'name',
            align: 'left',
            width: 200,
            render: renderName
        },
        {
            title: tr('类型'),
            fieldName: 'type',
            align: 'left',
            width: 150,
        },
        {
            title: tr('页面编码/菜单项操作地址'),
            fieldName: "path",
            align: 'left',
        },
        {
            title: tr('图标'),
            fieldName: 'icon',
            align: 'center',
            width: 50,
            render: renderIcon
        },
        {
            title: tr('描述'),
            fieldName: 'description',
            align: 'left',
        },
    ],
    context: [
        {
            title: tr('名称'),
            fieldName: 'name',
            align: 'left',
            width: 200,
            render: renderName
        },
        {
            title: tr('类型'),
            fieldName: 'type',
            align: 'left',
            width: 150,
        },
        {
            title: tr('关联记录类型/菜单项操作地址'),
            fieldName: "path",
            align: 'left',
        },
        {
            title: tr('记录操作类型'),
            fieldName: "transactionCode",
            align: 'left',
        },
        {
            title: tr('图标'),
            fieldName: 'icon',
            align: 'center',
            width: 50,
            render: renderIcon
        },
        {
            title: tr('描述'),
            fieldName: 'description',
            align: 'left',
        },
    ]
}