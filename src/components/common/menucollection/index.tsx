import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Icon, Divider } from 'antd'
import { Input, EditStatus } from 'gantd'
import { connect } from 'dva'
import classnames from 'classnames'

import MenuContent from './menucontent'
import AnchorContent from './anchercontent'
import RecentLink from './recentlink'

import { MenuItem, HistoryItem } from './interface'
import FilterContext from './filtercontext';
import { validateMenuItem } from './utils'

import styles from './index.less'

enum Layout {
    SIDE = 'sidemenun',
    TOP = 'topmenu',
}

type po = number | string | null
interface Position {
    width?: po,
    height?: po,
    top?: po,
    left?: po,
    right?: po,
    bottom?: po,
    transitionDelay?: string
}

interface SettingsParam {
    MAIN_CONFIG: {
        layout: Layout,
        slideCollapsedWidth: number,
        slideWidth: number,
    }
}
interface GlobalParam { collapsed: boolean }
interface MenuParam {
    serveMenu: Array<MenuItem>,
    history: Array<HistoryItem>,
}
type Params = SettingsParam & GlobalParam & MenuParam

interface MenuCollectionProps extends Params {
    // className: string,
    // defaultNode: React.ReactNode
    visible: boolean,
    setvisible: (visible: boolean) => void,
}

const innerCls = styles['all-menu-popover-inner-wrapper']

const MenuCollection = (props: MenuCollectionProps) => {
    const { collapsed, serveMenu = [], history = [], MAIN_CONFIG: { layout, slideCollapsedWidth, slideWidth }, visible: display, setvisible: setdisplay } = props
    const [filter, setfilter] = useState('')
    const [popoverstyle, setpopoverstyle] = useState(() => ({}))
    const [innerstyle, setinnerstyle] = useState(() => ({}))
    const search = useMemo(() => filter.trim(), [filter])
    // const [display, setdisplay] = useState(false)
    const data = useMemo(() => validateMenuItem(serveMenu, search), [search, serveMenu])

    useEffect(() => {
        const click = (e: any) => {
            const { target } = e
            const inner = document.querySelector(`.${innerCls}`)
            // 输入框清空按钮
            if (['path', 'svg'].includes(target.tagName.toLowerCase())) return
            const innerClick = (inner as HTMLElement).contains(target)
            if (!innerClick) {
                setdisplay(false)
            }
        }
        const keydown = (e: any) => {
            if (e.key === 'Escape' || e.keyCode === 27) {
                setdisplay(false)
            }
        }
        window.addEventListener('click', click, false)
        window.addEventListener('keydown', keydown, false)
        return () => {
            window.removeEventListener('click', click)
            window.removeEventListener('keydown', keydown)
        }
    })

    // const onMouseEnter = useCallback(
    //     () => {
    //         setdisplay(true)
    //     },
    //     [],
    // )
    const onClose = useCallback(
        () => {
            setdisplay(false)
        },
        [],
    )
    const value = useMemo(() => ({ filter: search, onClose }), [search])
    useEffect(() => {
        const popoverStyle: Position = {}
        const innerStyle: Position = {}

        // 纵向显示
        if (layout === Layout.TOP) {
            popoverStyle.top = 0
            popoverStyle.left = 0
            popoverStyle.bottom = display ? 0 : '100%'
            innerStyle.height = '80vh'
            innerStyle.left = 0
            innerStyle.right = 0
            innerStyle.bottom = display ? 0 : '100%'
        }
        else {
            popoverStyle.bottom = 0
            popoverStyle.left = display ? (collapsed ? slideCollapsedWidth : slideWidth) : '100%';
            innerStyle.width = '80vw'
            innerStyle.left = display ? 0 : '-100%';
            innerStyle.bottom = 0
        }
        popoverStyle.transitionDelay = display ? '0s' : '.3s'

        // if (display) {
        //     const left = layout === Layout.TOP ? 0 : (collapsed ? collapsedWidth : siderWidth)
        //     setpopoverstyle(() => ({ left, transitionDelay: '0s' }))
        //     setinnerstyle(() => ({ left: 0 }))
        // } else {
        //     setpopoverstyle(() => ({ left: '100%', transitionDelay: '.3s' }))
        //     setinnerstyle(() => ({ left: '-100%' }))
        // }
        setpopoverstyle(() => (popoverStyle))
        setinnerstyle(() => (innerStyle))
    }, [display, collapsed, layout])

    // 渲染完成以后将弹出层插入到指定位置
    const node = useMemo(() => {
        return (
            <div className={styles['all-menu-popover']} style={popoverstyle}>
                <div className={innerCls} style={innerstyle}>
                    <Icon type="close" className={styles['all-menu-popover-inner-close']} onClick={onClose} />
                    <FilterContext.Provider value={value}>
                        <div className={styles['all-menu-popover-inner']}>
                            <Input edit={EditStatus.EDIT} placeholder={tr('请输入关键字搜索')} allowClear onChange={setfilter} style={{ width: `calc(100% - 200px)` }} />
                            <Divider />
                            <div className={styles['all-menu-popover-inner-content']}>
                                <div className={styles['all-menu-popover-inner-content-scroll']}>
                                    <RecentLink data={history} />
                                    <MenuContent data={data} history={history} />
                                </div>
                                <AnchorContent data={data} />
                            </div>
                        </div>

                    </FilterContext.Provider>
                </div>
            </div>
        )
    }, [popoverstyle, innerstyle, onClose, value])
    // return (
    //     <span className={classnames(className, styles['all-menu'])}>
    //         <span className={classnames(styles['event'])} onMouseEnter={onMouseEnter}>
    //             <Icon type="appstore" theme="filled" />
    //             {defaultNode}
    //         </span>
    //         {node}
    //     </span>
    // )
    return node
}

export default connect(
    ({ settings, global, menu }: { settings: SettingsParam, global: GlobalParam, menu: MenuParam }) => ({
        ...settings,
        collapsed: global.collapsed,
        ...menu,
    }),
)(MenuCollection)
