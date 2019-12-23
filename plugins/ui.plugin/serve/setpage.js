const path = require('path')
const fs = require('fs');
const chalk = require('chalk');
const ncp = require('ncp').ncp
const { pathToArray } = require('./utils')


// 找到数组中匹配的哪个路由
// 没有返回null
function findRoute(pathStr, route, parentPath) {
    for (const item of route) {
        let routePath = item.path
        // 相对路径 
        if (!routePath.startsWith(parentPath)) {
            routePath = `${parentPath}/${routePath}`
        }
        if (routePath === pathStr && !item.redirect) {
            return item
        }
    }
    return null
}
/**
 * 
 * @param {*} pathArray ['/', '/123', '/123/456']
 * @param {*} routes 
 * @param {*} parentPath 
 */
function resolvePath(pathArray, routes, parentPath, component) {
    if (pathArray.length === 1) {
        const route = findRoute(pathArray[0], routes, parentPath)
        if (route) {
            throw new Error('路由已存在，请修改模板页面路径')
        } else {
            routes.push({
                path: pathArray[0],
                component: `.${component}`
            })
        }
        return routes
    }
    // 是否在当前级的routes中找到了子级路由
    let isFindInCurrentRoutes = false
    for (const pathStr of pathArray) {
        const currentRoute = findRoute(pathStr, routes, parentPath)
        if (currentRoute) {
            isFindInCurrentRoutes = true
            const subRoutes = currentRoute.routes || []
            const pathStrIndex = pathArray.indexOf(pathStr)
            currentRoute.routes = resolvePath(pathArray.slice(pathStrIndex + 1), subRoutes, pathStr, component)
            break;
        }
    }
    // 如果没有找到，直接插入
    if (!isFindInCurrentRoutes) {
        routes.push({
            path: pathArray[0],
            component: `.${component}`
        })
    }
    return routes
}

const mergePathToConfig = (route, pagesPath, folder, failure) => {

    // 1、 计算模板和模板目录路径
    // 模板目标路径
    const templatePath = path.resolve(`${pagesPath}${folder}`)
    // 模块所在目录
    const templateDirName = path.dirname(templatePath)
    console.log(chalk.blue(`模块所在目录：${templateDirName}`))


    // 2、读取配置文件
    // 模块所在目录配置文件
    const configPath = path.resolve(templateDirName, 'config.json')
    console.log(chalk.blue(`读取模块配置文件：${configPath}`))
    if (!fs.existsSync(configPath)) {
        failure([
            [`当前模块所在目录${templateDirName}没有配置文件,`, { textAlign: 'left' }],
            [`请先在${templateDirName}目录添加config.json文件,`, { textAlign: 'left' }],
            [`文件内容格式如下：`, { textAlign: 'left' }],
            [`{`, { textAlign: 'left' }],
            [`"order": 101, // 配置文件的优先级`, { textAlign: 'left', textIndent: '2em' }],
            [`"proxyTarget": "http://v5.ip2fw.gantcloud.com", // 请求的服务端地址`, { textAlign: 'left', textIndent: '2em' }],
            [`"routes":{} // array or object`, { textAlign: 'left', textIndent: '2em' }],
            [`}。`, { textAlign: 'left' }],
            [`更多详情请参考https://gant.yuque.com/fdt/gantreact/config#RoM6m`, { textAlign: 'left' }]
        ])
        throw new Error('模块所在目录不存在')
    }
    // 路径搜寻的起点
    let rootPath = '/'
    // 找到已配置的路由
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    let { routes = [] } = config
    const pathArray = pathToArray(route)
    if (!Array.isArray(routes)) {
        // sysmgmt中的情况
        routes = routes.routes
        rootPath = routes.path
    }


    // 3、将当前路径插入到路由中,并写入
    try {
        const computedRoutes = resolvePath(pathArray, routes, rootPath, folder)
        config.routes = computedRoutes
        fs.writeFileSync(configPath, Buffer.from(JSON.stringify(config, null, 4)))
    } catch (e) {
        failure(e.message)
        throw e
    }


}

module.exports = (api, payload, { success, failure }) => {

    // 1、计算路径
    const { routePath, folderPath, template } = payload
    const { absPagesPath, absSrcPath } = api.paths;
    // 模板源路径
    const templatePath = path.resolve(absSrcPath, `templates${template}`)
    // 模板目标路径
    const templateDistPath = path.resolve(`${absPagesPath}${folderPath}`)

    // 2、判断模板是否已存在
    const isExists = fs.existsSync(templateDistPath)
    if (isExists) {
        failure('模块已存在');
        return
    }

    // 3、写入路径
    try {
        mergePathToConfig(routePath, absPagesPath, folderPath, failure)
    } catch (e) {
        console.log(chalk.red(e))
        return
    }
    // 4、复制模板
    ncp(templatePath, templateDistPath, (err) => {
        if (!err) {
            const message = `模板${template}添加成功`
            const data = {
                message
            }
            console.log(chalk.green(message))
            api.rebuildTmpFiles()
            success(data)
            return
        }
        failure(err)
    })
}