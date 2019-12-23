import router, { RouteData } from 'umi/router';
import { MenuTypes } from '@/models/menu'
/**
 * 获取对应key的视图路径
 * @param key 
 * @param flatmenu 
 */
function findMenuPath(key: string, flatmenu: MenuTypes.flatMenu): string {
    for (const routePath in flatmenu) {
        if (routePath.endsWith(key)) {
            if (!routePath.startsWith('/**')) {
                return routePath
            }
            console.error(`没有到${key}对应视图，无法跳转`)
            return key
        }
    }
    console.error(`没有到${key}对应视图，无法跳转`)
    return key
}

/**
 * 获取完整路径
 * @param path 
 * @param flatmenu 
 */
function getFullPath(path: string, flatmenu: MenuTypes.flatMenu): string {
    const [key, ...pathArray] = path.split('/')
    const fullPath = findMenuPath(key, flatmenu)
    pathArray.unshift(fullPath)
    return pathArray.join('/')
}

/**
 * 格式化路径
 * @param param 
 * @param flatmenu 
 */
export function formatParam(param: string | RouteData, flatmenu: MenuTypes.flatMenu): string | RouteData {
    if (typeof param === 'string') {
        const match = param.match(/(^[a-zA-Z]+)(.*)/)
        if (match) {
            const [, keyPath, query] = match
            const path = getFullPath(keyPath, flatmenu)
            return `${path}${query}`
        }
    } else {
        const path = getFullPath(param.pathname, flatmenu)
        return {
            ...param,
            pathname: path
        }
    }
    return ''
}

export default function jump(param: string | RouteData, flatmenu: MenuTypes.flatMenu) {
    const formatedParam = formatParam(param, flatmenu)
    router.push(formatedParam)
}