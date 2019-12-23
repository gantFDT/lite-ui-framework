
import CONFIG from '@/.temp'
import moment from 'moment'
import { getLocale } from 'umi/locale'

//处理config,按顺序深度覆盖合并,如果是数组，则会cancat，在使用config时请自行按主键去重
//数组主键不同，没法统一处理
let config={};
if (CONFIG) {
  _.sortBy(CONFIG, function (item) {
    return item['ORDER'];
  });
  const customizer = (objValue?: any, srcValue?: any):any => {
    if (_.isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  }
  config = _.mergeWith(...CONFIG, customizer)
  delete config['ORDER']
}

//设置moment配置
const locale = getLocale()
//默认format格式
moment.defaultFormat = config['COMMON_CONFIG']['defaultDateFormat']
//默认moment语言
switch (locale) {
  case 'zh-CN':
    moment.locale('zh-CN');
  case 'en-US':
    moment.locale('en');
  default:
    break;
}


const Model = {
  namespace: 'config',
  state: {
    ...config
  },
  effects: {

  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  }
}

export default Model;