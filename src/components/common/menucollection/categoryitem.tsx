import React, { useCallback, useContext } from 'react'
import classnames from 'classnames'
import { get } from 'lodash'


import { MenuItem } from './interface'
import Link from './link'
import styles from './index.less'

interface CategoryItemProps {
    data: MenuItem
}

const CategoryItem = (props: CategoryItemProps) => {
    const { data: { name, children, id } } = props
    const getSubMenu = useCallback(
        (child: Array<MenuItem>) => {
            return (
                <ul className={classnames(styles['category-item-menu'])}>
                    {
                        child && child.map((childItem, index: number) => {
                            const name = childItem.name || childItem.name
                            if (!get(childItem, 'children.length')) {
                                return (
                                    <li key={index} >
                                        <Link className={classnames(styles['category-item-menuitem'])} target={childItem.path} name={name} />
                                    </li>
                                )
                            }
                            return (
                                <li key={index}>
                                    <div className={classnames(styles['category-item-menuitem'])} id={`anchor-${childItem.id}`}>{name}</div>
                                    {getSubMenu(childItem.children)}
                                </li>
                            )
                        })
                    }
                </ul>
            )
        },
        [],
    )

    return (
        <div className={classnames(styles['category-item'])} >
            <h4 className={classnames(styles['category-item-title'])} id={`anchor-${id}`}>
                {name}
            </h4>
            {getSubMenu(children)}
        </div>
    )
}

export default CategoryItem
