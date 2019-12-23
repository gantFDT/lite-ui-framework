import React, { useCallback, useState, useContext, useMemo, useEffect } from 'react'
import { Anchor } from 'antd'
import { get } from 'lodash'


import { MenuItem } from './interface'
import styles from './index.less'

const { Link } = Anchor

interface AnchorContentProps {
    data: Array<MenuItem>
}

interface AnchorProps {
    setState: (obj: object) => void
}
const anchref = {} as AnchorProps


const findCurrent: (list: Array<MenuItem>, id: string) => boolean = (list, id) => {
    return list.some((item: MenuItem) => {
        if (item.id === id) return true
        const hasChildren = get(item, 'children.length');
        if (hasChildren) {
            return findCurrent(item.children, id)
        }
        return false
    })
}

const recent: MenuItem = {
    id: 'anchor-recent',
    name: tr('最近浏览'),
    children: [{}]
}

const AnchorContent = (props: AnchorContentProps) => {
    const [current, setcurrent] = useState('')
    const [anchorRef, setAnchorRef] = useState(anchref)
    const { data } = props
    // const data = useMemo(() => ([recent, ...props.data]), [props.data])
    useMemo(() => {
        if (anchorRef.setState) {
            if (current) {
                const exist = findCurrent(data, current)
                anchorRef.setState({
                    activeLink: exist ? current : null,
                })
            }
        }
    }, [data, anchorRef, current])

    const getAnchorList = useCallback(
        (list) => {
            return list.map((item: MenuItem) => {
                let subLink = null
                const hasChildren = get(item, 'children.length');
                if (hasChildren) {
                    subLink = getAnchorList(item.children)
                    return (
                        <Link key={item.id} href={item.id} title={item.name} >
                            {subLink}
                        </Link>
                    )
                }
                return null
            })
        },
        [],
    )
    const handleClick = useCallback(
        (e, link) => {
            requestAnimationFrame(() => {
                const anchor = document.querySelector(`#anchor-${link.href}`) as HTMLElement
                anchor.scrollIntoView()
            })
            setcurrent(link.href)
            e.preventDefault();
        }, [anchorRef],
    );
    const ref = useCallback(
        (anchor) => {
            if (anchor) {
                setAnchorRef(anchor)
            }
        }, [anchorRef],
    )
    const getContainer = useCallback(
        () => document.querySelector(`.${styles['categories']}`), [anchorRef],
    )
    return (
        <Anchor affix={false} onClick={handleClick} className={styles['anchor']} ref={ref} getContainer={getContainer}>
            {getAnchorList(data)}
        </Anchor>
    )

}

export default AnchorContent
