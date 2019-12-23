import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar';
const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION, TEST, NODE_ENV, EXAMPLE } = process.env;

// 生成运行时的config[config.js]
const generRunningConfigs = (api) => {
    let subModules = fs.readdirSync(path.join(__dirname, '../src/pages'), { withFileTypes: true })
        .filter(item => !item.name.includes('.') && (item.isSymbolicLink() || item.isDirectory())); // 过滤掉文件
    let orders = [];
    let configStr = ``;
    // 子模块
    subModules.forEach(_module => {
        // 子模块配置
        let moduleConfig;
        // 兼容找不到config.js的情况
        try {
            // 路径
            let realPath;
            if (_module.isSymbolicLink()) {
                let linkPath = fs.readlinkSync(path.join(__dirname, '../src/pages', _module.name));
                let isAbsolutePath = /^([A-Z]\:\\|\/)/.test(linkPath);
                realPath = isAbsolutePath ?
                    path.join(fs.readlinkSync(path.join(__dirname, '../src/pages', _module.name)), 'config.js') :
                    path.join(__dirname, '../src/pages', fs.readlinkSync(path.join(__dirname, '../src/pages', _module.name)), 'config.js')
            } else {
                realPath = path.join(__dirname, '../src/pages', _module.name, 'config.js');
            }

            let fileStr = fs.readFileSync(realPath, { encoding: 'utf-8' });
            let [_, order] = fileStr.match(/const\s+ORDER\s?=\s?(\d)+/);
            fs.writeFileSync(path.join(__dirname, `../src/.temp/config${order}.js`), fileStr);
            // api.writeTmpFile(`config${order}.js`, fileStr);
            orders.push(`config${order}`)
            configStr += `\nimport config${order} from './config${order}'`
        } catch (e) { }
    })
    configStr += `\nexport default [${orders.join(',')}]`
    fs.writeFileSync(path.join(__dirname, `../src/.temp/index.js`), configStr);
    // api.writeTmpFile('config.js', configStr);
}


const watchers = new Map()
function createWatcher(key, file, cwd) {
    const watcher = chokidar.watch(file, {
        ignored: /example/,
        cwd
    })
    watchers.set(key, watcher)

    return watcher
}

function watch(api) {
    for (const w of watchers.values()) {
        w.on('change', (filePath) => {
            console.log(filePath, 'changed')
            api.restart()
        })
    }
}

function unwatch() {
    for (const w of watchers.values()) {
        w.close()
    }
}

export default api => {

    generRunningConfigs()

    if (NODE_ENV === 'production') { return }

    const { pagesPath } = api.paths

    // json文件变化重启服务
    const JSONWatcher = createWatcher('JSON_FILE', './*/config.json', pagesPath)
    // JSONWatcher.on('change', (filePath) => {
    //     console.log(filePath, 'changed')
    //     api.restart()
    // })
    // js文件变化，重构文件，触发webpack更新
    const JSWatcher = createWatcher('JS_FILE', './*/config.js', pagesPath)
    // JSWatcher.on('change', filePath => {
    //     console.log(filePath, 'changed')
    //     // generRunningConfigs()
    //     api.restart()
    // })

    watch(api)

    process.on('exit', unwatch)
}




