import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { map, get } from 'lodash'
import { withResizeDetector } from 'react-resize-detector';
import CategoryItem from './categoryitem'
import { MenuItem, HistoryItem } from './interface'
import styles from './index.less'

interface MenuContentProps {
    data: Array<MenuItem>,
    history: Array<HistoryItem>,
    width: number
}

const MenuContent = (props: MenuContentProps) => {
    const { data: categories, width } = props
    const [node, setnode] = useState(null)
    const colCount = useMemo(() => Math.floor(width / 240), [width])

    const menuGroup = useMemo(
        () => {
            const menugroups = categories.reduce((groups: Array<Array<MenuItem>>, item: MenuItem, index) => {
                const inde = index % colCount;
                const listItem: Array<MenuItem> = groups[inde] || []
                if (listItem) {
                    listItem.push(item)
                }
                groups[inde] = listItem
                return groups
            }, [])
            return map(menugroups, (menuList: Array<MenuItem>, ind: number) => {
                return (
                    <div className={styles['category-list']} key={ind}>
                        {
                            map(menuList, (menu: MenuItem, index) => <CategoryItem key={index} data={menu} />)
                        }
                    </div>
                )
            })
        },
        [categories, colCount],
    )
    const ref = useCallback(
        (dom) => {
            if (dom && !node) {
                setnode(dom)
                if (dom.offsetWidth > dom.clientWidth) { //出现滚动条，隐藏
                    const bannerWidth = dom.offsetWidth - dom.clientWidth
                    const { cssText } = dom.style
                    requestAnimationFrame(() => {
                        dom.style.cssText = `${cssText};margin-right: -${bannerWidth}px; padding-right: ${bannerWidth}px`
                    })
                }
            }
        },
        [node],
    )
    return (
        <>
            {/* <RecentLink data={history} /> */}
            <div className={styles['categories']} ref={ref}>
                {menuGroup}
            </div>
        </>
    )
}

export default withResizeDetector(MenuContent, { handleWidth: true })
