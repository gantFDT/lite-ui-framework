import { Icon } from 'gantd'
import defaultSettings from '../../config/defaultSettings';
import {
  JSONisEqual,
  deepCopy4JSON,
  cssVar2camel,
  camel2cssVar
} from '@/utils/utils';
import { themes as themeConfigs, JS_VAR_KEYS } from '@/themes/themes';
import themes from '@/themes';
import { merge } from 'lodash';
import themeColor from '@/utils/themecolor.ts';
import { Model } from './connect'


interface CssVars {
  [key: string]: string
}
type BaseConfig = Readonly<typeof defaultSettings.BASE_CONFIG>
type LoginConfig = Readonly<typeof defaultSettings.LOGIN_CONFIG>
type MainConfig = Readonly<typeof defaultSettings.MAIN_CONFIG>


const updateFavicon = (img: string) => {
  var link = document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = img;
  document.getElementsByTagName('head')[0].appendChild(link);
}

const updateColorWeak = (colorWeak: string) => {
  const root = document.getElementById('root');

  if (root) {
    root.className = colorWeak ? 'colorWeak' : '';
  }
};

/**
 * 比较两个对象对应字段是否相等
 * @param {object} dataSource 数据源
 * @param {object} dataSource 待比较的数据
 * @param {array} keys2Compare 需要比较的字段
 */
const isObjectDiff = (target: object, origin: object, keys2Compare: Array<string>): boolean => {
  let diff = false;
  for (const tK in target) {
    const tV = target[tK];
    if (keys2Compare.includes(tK) && tV !== origin[tK]) {
      diff = true
    }
  }
  return diff;
}

// 注入ICON
const buildIcon = () => {
  // 更新Icon
  const { iconfontUrl, iconWareHouse } = defaultSettings as { iconfontUrl?: string, iconWareHouse?: string }
  Icon.updateFromIconfontCN({
    scriptUrl: iconfontUrl
  })
  Icon.createFromIconfontCN('House', {
    scriptUrl: iconWareHouse
  })
}

//获取用户本地UI配置信息
const defaultCssVars = deepCopy4JSON(themes.antd);
let localeUIConfigStr = window.localStorage.getItem('UIConfig');
let mergedBaseConfig = BASE_CONFIG as BaseConfig;
let mergedLoginConfig = LOGIN_CONFIG as LoginConfig;
let mergedMainConfig = MAIN_CONFIG as MainConfig;
let mergedCssVars: CssVars = _.merge(defaultCssVars, themes[mergedMainConfig.theme]);
if (localeUIConfigStr) {
  let localeUIConfig = JSON.parse(localeUIConfigStr);
  let BASE_CONFIG_lOCALE = localeUIConfig.BASE_CONFIG;
  if (BASE_CONFIG_lOCALE) {
    mergedBaseConfig = _.defaults(BASE_CONFIG_lOCALE, mergedBaseConfig)
  }
  let LOGIN_CONFIG_lOCALE = localeUIConfig.LOGIN_CONFIG;
  if (LOGIN_CONFIG_lOCALE) {
    mergedLoginConfig = _.defaults(LOGIN_CONFIG_lOCALE, mergedLoginConfig)
  }
  let MAIN_CONFIG_lOCALE = localeUIConfig.MAIN_CONFIG;
  if (MAIN_CONFIG_lOCALE) {
    mergedMainConfig = _.defaults(MAIN_CONFIG_lOCALE, mergedMainConfig)
  }
  let CSS_VARS_lOCALE = localeUIConfig.cssVars;
  if (CSS_VARS_lOCALE) {
    mergedCssVars = _.defaults(CSS_VARS_lOCALE, mergedCssVars)
  }
}

// 格式化配置里面图片路径
const context = require.context('..', true, /\.(png|jgp|jpeg)$/);
const images = context.keys() as Array<string>;
const formatImgPath = (config: object) => {
  for (const _key in config) {
    if (config.hasOwnProperty(_key)) {
      const configItem = config[_key];
      const imagePath = images.find(path => path.includes(configItem));
      imagePath && (config[_key] = context(imagePath))
    }
  }
}

formatImgPath(mergedBaseConfig);
formatImgPath(mergedLoginConfig);
updateFavicon(mergedBaseConfig.favicon);
buildIcon()





const initalState = {
  ...defaultSettings,
  BASE_CONFIG: mergedBaseConfig,
  LOGIN_CONFIG: mergedLoginConfig,
  MAIN_CONFIG: mergedMainConfig,
  // ROUTE_MAP: ROUTE_MAP,
  // IP2_ROUTE_MAP: IP2_ROUTE_MAP,
  fixSiderbar: mergedMainConfig.fixSiderbar,
  fixedHeader: mergedMainConfig.fixedHeader,
  cssVars: mergedCssVars
}

export type SettingsState = Readonly<typeof initalState>

interface Settings extends Model {
  state: SettingsState
}

const SettingModel: Settings = {
  namespace: 'settings',
  state: initalState,
  reducers: {
    getSetting(state = defaultSettings) {

      let mainConfigCssVars;
      let personalConfig;
      if (!localeUIConfigStr) {
        // 初始化
        mainConfigCssVars = {};

        const theme = themeConfigs.find(V => V.value === state.MAIN_CONFIG.theme);
        if (theme) {
          const { uiConfig } = theme

          const themeStyles = themes[state.MAIN_CONFIG.theme];

          personalConfig = merge({}, uiConfig, {
            MAIN_CONFIG: {
              ...cssVar2camel(themeStyles, JS_VAR_KEYS),
              theme: state.MAIN_CONFIG.theme
            }
          }
          )
        };
      } else {
        mainConfigCssVars = camel2cssVar(state.MAIN_CONFIG, JS_VAR_KEYS)
      }

      if (state.MAIN_CONFIG.theme !== 'antd') {
        themeColor.changeTheme(state.MAIN_CONFIG.theme, mainConfigCssVars)
      } else if (isObjectDiff(state.MAIN_CONFIG, MAIN_CONFIG, JS_VAR_KEYS)) {
        themeColor.changeSomeCssVars(mainConfigCssVars);
      }

      const mergedState = merge({}, state, personalConfig);
      window.localStorage.setItem('UIConfig', JSON.stringify(mergedState))
      return mergedState;
    },

    changeSetting(state = defaultSettings, {
      payload
    }) {
      const {
        MAIN_CONFIG,
        BASE_CONFIG
      } = payload;
      let cssVars = {};
      const themeConfig = themes[MAIN_CONFIG.theme];
      const mainConfig = camel2cssVar(MAIN_CONFIG, JS_VAR_KEYS);

      if (MAIN_CONFIG.theme && isObjectDiff(state.MAIN_CONFIG, MAIN_CONFIG, ['theme'])) {
        cssVars = _.merge(defaultCssVars, themeConfig, mainConfig)
        themeColor.changeTheme(MAIN_CONFIG.theme, mainConfig);
        formatImgPath(BASE_CONFIG)
      } else if (isObjectDiff(state.MAIN_CONFIG, MAIN_CONFIG, JS_VAR_KEYS)) {
        cssVars = _.merge(state.cssVars, mainConfig)
        themeColor.changeSomeCssVars(mainConfig);
      }
      payload.cssVars = cssVars;
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 1500)

      const mergedState = merge({}, state, payload);
      window.localStorage.setItem('UIConfig', JSON.stringify(mergedState))
      return mergedState;
    },
    togglefullscreen(state) {
      return {
        ...state,
        MAIN_CONFIG: {
          ...state.MAIN_CONFIG,
          fullscreen: !state.MAIN_CONFIG.fullscreen
        }
      }
    }
  },
};
export default SettingModel;
