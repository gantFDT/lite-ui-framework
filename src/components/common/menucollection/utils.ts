import { MenuItem } from './interface'
import { get } from 'lodash'



export const validateMenuItem: (menuList: Array<MenuItem>, filter: string) => Array<MenuItem> = (menuList, filter) => {
    return menuList.map(menu => {
        const name = get(menu, 'name')
        if (!name) return null

        if (name.toLowerCase().includes(filter.toLowerCase())) return menu;
        if (!get(menu, 'children.length')) return null
        const children = validateMenuItem(menu.children, filter)
        if (!children.length) return null
        return (
            {
                ...menu,
                children,
            }
        )
    }).filter(Boolean) as Array<MenuItem>
}