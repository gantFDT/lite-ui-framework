/* eslint-disable compat/compat */
import lnk from 'lnk'
import execa from 'execa'
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import _ from 'lodash';
import defaultSettings from '../config/defaultSettings';

const PAGE_PATH = './src/pages';

//计算编译时的模块
const getSubModuleConfigs = () => {
  let subModules = fs.readdirSync(path.join(__dirname, '../src/pages'), { withFileTypes: true })
    .filter(item => !item.name.includes('.') && (item.isSymbolicLink() || item.isDirectory())); // 过滤掉文件
  // .map(item => item.name);
  let configs = [];
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
          path.join(fs.readlinkSync(path.join(__dirname, '../src/pages', _module.name)), 'config.json') :
          path.join(__dirname, '../src/pages', fs.readlinkSync(path.join(__dirname, '../src/pages', _module.name)), 'config.json')
      } else {
        realPath = path.join(__dirname, '../src/pages', _module.name, 'config.json');
      }
      moduleConfig = require(realPath);
      moduleConfig.dirName = _module.name;
      if (moduleConfig.order >= 0) {
        // config没有order或者order小于0的不加载配置
        configs.push(moduleConfig);
      } else {
        console.log(chalk.yellow(`${_module.name}模块的配置文件缺少order参数或order小于0，所以不加载配置。`))
      }
    } catch (e) { }
  })
  configs.sort((a, b) => a.order - b.order);
  return configs;
}

//格式化路由
const formatRoutePath = (route, pathPrefix) => {
  route.path = route.path[0] === '/' ? route.path : pathPrefix !== '/' ? `${pathPrefix}/${route.path}` : `/${route.path}`;
  route.component && (route.component = route.component.includes(PAGE_PATH) ? route.component : `${PAGE_PATH}/${route.component.replace('./', '')}`);
  route.routes && route.routes.forEach(_route => {
    formatRoutePath(_route, route.path);
  })
}

const validConfigKey = (key) => {
  return /^[A-Z\d_]+$/.test(key)
}

const subModuleConfigs = getSubModuleConfigs();

//合并所需函数
function customizer(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return _.unionWith(objValue, srcValue, _.isEqual);;
  }
}
//编译时的config[config.json]
const generConfig = () => {
  let _define = {};
  let proxyTarget;

  let defaultDefine = {};
  for (const _key in defaultSettings) {
    if (!validConfigKey(_key)) continue;
    const _setting = defaultSettings[_key];
    defaultDefine[_key] = _setting;
  }

  let moduleDefine = {};
  subModuleConfigs.forEach((moduleConfig, index, arr) => {
    Object.keys(moduleConfig).forEach(key => {
      if (key === 'proxyTarget') {
        proxyTarget = moduleConfig[key];
      }
      if (!validConfigKey(key)) return;
      if (key === 'LOGIN_CONFIG') {
        moduleConfig[key].backgroundImage && (moduleConfig[key].backgroundImage = `pages/${moduleConfig.dirName}/${moduleConfig[key].backgroundImage.replace('./', '')}`);
      }
      if (key === 'BASE_CONFIG') {
        moduleConfig[key].favicon && (moduleConfig[key].favicon = `pages/${moduleConfig.dirName}/${moduleConfig[key].favicon.replace('./', '')}`);
        moduleConfig[key].logoImage && (moduleConfig[key].logoImage = `pages/${moduleConfig.dirName}/${moduleConfig[key].logoImage.replace('./', '')}`);
        moduleConfig[key].logoImageWhite && (moduleConfig[key].logoImageWhite = `pages/${moduleConfig.dirName}/${moduleConfig[key].logoImageWhite.replace('./', '')}`);
      }
    })
    moduleDefine = _.mergeWith(moduleDefine, moduleConfig, customizer)
  })
  _define = _.merge(_define, defaultDefine, moduleDefine);
  return {
    define: _define,
    proxyTarget
  };
}

const _config = generConfig();





export default function (api, options) {
  // api.onDevCompileDone(({ isFirstCompile, stats }) => { generRunningConfigs(api) });
  // api.onStart(() => {
  //   generRunningConfigs(api)
  // });

  // 处理prd项目的软连接
  // 删除node_modules链接
  if (process.env.PRD) {
    const opts = { cwd: api.paths.cwd, type: 'directory' }
    const nm = path.resolve(api.paths.cwd, '../node_modules')
    const uiprd = path.resolve(api.paths.cwd, './src/pages/ui-prd')
    api.beforeDevServer(() => {
      if (!fs.existsSync(uiprd)) {
        lnk(['../ui-prd'], 'src/pages', opts).then(() => {
          console.log(chalk.green('创建ui-prd软连接成功'))
        }).catch(console.error)
      }
    })
    // 建立链接
    api.onDevCompileDone(() => {
      if (!fs.existsSync(nm)) {
        console.log(`${nm}文件夹不存在`)
        lnk(['node_modules'], '../', opts).then(() => {
          console.log(chalk.green('建立node_modules软连接成功'))
        }).catch(console.error)
      }
    })
  }


  // TODO path component 路径处理
  api.modifyRoutes(function (routes) {
    let rootRouter = routes.find(rt => rt.path === '/'); // BasicLayout 组件
    let rootRouterIndex = routes.findIndex(rt => rt.path === '/'); // BasicLayout 组件

    function loadRouter(_route) {
      formatRoutePath(_route);
      let _index = rootRouter.routes.findIndex(route => route.path === _route.path);
      if (~_index) {
        // 覆盖已配置路由
        rootRouter.routes[_index] = _route;
      } else {
        rootRouter.routes.splice(rootRouter.routes.length - 1, 0, _route);
      }
    }

    subModuleConfigs.forEach(moduleConfig => {
      let { component: layoutComponentPath, name, path } = moduleConfig.routes;

      if (Array.isArray(moduleConfig.routes)) {
        moduleConfig.routes.forEach(_route => {
          loadRouter(_route)
        })
      } else {
        loadRouter(moduleConfig.routes)
      }
    })
    return routes;
  })

  api.modifyDefaultConfig(config => {
    return {
      // 默认使用单数目录
      ...config,
      define: {
        ...config.define,
        ..._config.define,
        PROXY_TARGET: _config.proxyTarget
      }
    };
  });

  api.chainWebpackConfig((config) => {
    if (_config.proxyTarget) {
      config.devServer.proxy({
        '/api': {
          target: _config.proxyTarget,
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
        }
      })
    }
    return config;
  });
}
