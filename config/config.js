// https://umijs.org/config/
import os from 'os';
import path from 'path';
import slash from 'slash2';
import defaultSettings from './defaultSettings';
import webpackPlugin from './plugin.config';
import demoRouter from '../src/pages/example/router.json';
import pkg from '../package.json';

const { pwa, MAIN_CONFIG: { primaryColor } } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。


const extraBabelPlugins = ['dynamic-import-node']
const gantdVersionMatch = pkg.dependencies.gantd.match(/\d+/g)
if (gantdVersionMatch && gantdVersionMatch.length) {
  const version = gantdVersionMatch.slice(-1)[0]
  if (version >= 37) {
    extraBabelPlugins.push(['import', require('gantd/babel-plugin-import-gantd-options')])
  }
}


const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION, TEST, NODE_ENV, EXAMPLE } = process.env;



const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/common/pageloading',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
          workboxPluginMode: 'InjectManifest',
          workboxOptions: {
            importWorkboxFrom: 'local',
          },
        }
        : false,
      headScripts: [
        {
          src: 'https://polyfill.alicdn.com/polyfill.min.js'
        },
        {
          //iconfont全局引入
          src: '/iconfont/iconfont.js'
        },
        {
          //react
          // src: 'https://unpkg.com/react@^16.8.6/umd/react.production.min.js' //支持语义化版本范围
          // src: 'https://gw.alipayobjects.com/os/lib/react/16.8.6/umd/react.production.min.js'
          src: '/js/react.production.min.js'
        },
        {
          //react-dom
          // src: 'https://unpkg.com/react-dom@^16.8.6/umd/react-dom.production.min.js' //支持语义化版本范围
          // src: 'https://gw.alipayobjects.com/os/lib/react-dom/16.8.6/umd/react-dom.production.min.js'
          src: '/js/react-dom.production.min.js'
        },
        {
          //antv/data-set
          // src: 'https://gw.alipayobjects.com/os/antv/pkg/_antv.data-set-0.10.2/dist/data-set.min.js'
          src: '/js/data-set.min.js'
        },
        {
          //antv/g6-plugins
          // src: '/js/g6Plugins.js'
        },
        {
          //antv/g6
          // src: '/js/g6.js'
        },
        {
          //lodash
          // src: 'https://unpkg.com/lodash@^4.17.11/lodash.min.js'
          src: '/js/lodash.min.js'
        },
        {
          //moment
          // src: 'https://cdn.jsdelivr.net/npm/moment@2.24.0/moment.min.js'
          src: '/js/moment-with-locales.min.js'
        },
        {
          //bizcharts
          // src: 'https://unpkg.com/bizcharts@^3.5.5/umd/BizCharts.min.js'
          src: '/js/BizCharts.min.js'
        },
        {
          src: '/js/xlsx.min.js'
        }
      ],
      ...(!TEST && os.platform() === 'darwin'
        ? {
          // dll: {
          //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
          //   exclude: ['@babel/runtime', 'netlify-lambda', 'gantd'],
          // },
          hardSource: false,
        }
        : {}),
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
  [path.join(__dirname, '../plugins/rebuild')],
  [path.join(__dirname, '../plugins/module.plugin')],
  [path.join(__dirname, '../plugins/ui.plugin')],
];

// 针对 preview.pro.ant.design 的 GA 统计代码
// preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
// if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
//   plugins.push([
//     'umi-plugin-ga',
//     {
//       code: 'UA-72788897-6',
//     },
//   ]);
// }

const uglifyJSOptions =
  NODE_ENV === 'production'
    ? {
      uglifyOptions: {
        // remove console.* except console.error
        compress: {
          drop_console: true,
          pure_funcs: ['console.error'],
        },
      },
    }
    : {};
const routes = EXAMPLE === 'NONE' ? [] : [demoRouter.routes]
export default {
  // add for transfer to umi
  plugins,
  hash: true,
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
    "process.env.EXAMPLE": EXAMPLE
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    '@antv/data-set': 'DataSet',
    // '@antv/g6': 'G6',
    // '@antv/g6/plugins': 'G6Plugins',
    'lodash': '_',
    'moment': 'moment',
    'bizcharts': 'BizCharts',
    'xlsx': 'XLSX',
  },
  block: {
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  treeShaking: true,
  targets: {
    ie: 11,
  },
  devtool: ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION ? 'source-map' : false,
  // 路由配置
  routes: [
    {
      name: 'login',
      path: '/login',
      component: './common/login',
    },
    {
      path: '/',
      component: '../layouts/BasicLayout',
      Routes: ['./src/layouts/loginauthen'],
      routes,
    },
  ],
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor
  },
  // proxy: {
  //   '/server/api/': {
  //     target: 'https://preview.pro.ant.design/',
  //     changeOrigin: true,
  //     pathRewrite: { '^/server': '' },
  //   },
  // },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  uglifyJSOptions,
  extraBabelIncludes: [
    path.join(__dirname, '../../ui-prd'),
    path.join(__dirname, '../../ui-prj'),
    (filePath) => {
      if (filePath.includes('node_modules')) {
        return false;
      }
      return true;
    }
  ],
  extraBabelPlugins,
  publicPath:'/lite-ui-framework/',
  chainWebpack: webpackPlugin,
  // proxy: {
  //   '/api': {
  //     target: '',
  //     changeOrigin: true,
  //     pathRewrite: {
  //       '^/api': '',
  //     },
  //   },
  // },
};
