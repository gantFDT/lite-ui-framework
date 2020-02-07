import { isEmpty, get } from 'lodash'
import { getLocale } from 'umi/locale'
import router from 'umi/router'
import { getUserIdentity, IEVersion } from '@/utils/utils'
import cssVars from 'css-vars-ponyfill'
import { initDB } from '../database'
import tr from '@/components/common/formatmessage'
window['tr'] = tr
//ie cssvar兼容
const ieVersion = IEVersion();
if (ieVersion !== -1 && ieVersion !== 'edge') {
  cssVars({});
}


export function render(oldRender: Function) {
  initDB()
  const locale = getLocale()
  //设置网页title
  switch (locale) {
    case 'zh-CN':
      document.title = BASE_CONFIG['appTitle']
    case 'en-US':
      document.title = BASE_CONFIG['appTitleEn']
    default:
      break;
  }
  //用户身份前置判断
  const userToken = getUserIdentity()
  if (_.isEmpty(userToken)) {
    router.replace({
      pathname: '/login'
    })
  }
  oldRender()
}


export const dva = {
  config: {
    onError(e: any) {
      e.preventDefault();
      console.error(e.message);
    },
    // onEffect: (effect: any, { select }: any, model: any, actionType: any) => {
    //   return function* Gen(action: { stateName: any }, ...args: any[]) {
    //     const { stateName } = action
    //     const state = yield select((store: { [x: string]: any }) => store[model.namespace])
    //     const data = get(state, stateName)
    //     // 如果所需要验证的数据为空，就执行请求，
    //     // 不需要验证的情况下，stateName可以留空
    //     // stateName支持 'a.b[0].c'这样的写法
    //     // if (stateName) { console.log('data', data) }
    //     if (isEmpty(data)) {
    //       yield effect(action, ...args)
    //     }
    //   }
    // }
  },
  plugins: [
    require('../plugins/dvaLogoutPlugin')
  ]
};