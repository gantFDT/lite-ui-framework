import { isEmpty, get } from 'lodash'
import { getLocale } from 'umi/locale'
import router from 'umi/router'
import { getUserIdentity, IEVersion, getPerformanceTiming } from '@/utils/utils'
import fixIE from '@/assets/fixIE'
import cssVars from 'css-vars-ponyfill'

//ie cssvar兼容
const ieVersion = IEVersion();
if (ieVersion !== -1 && ieVersion !== 'edge') {
  console.time('cssVars', cssVars)
  cssVars({});
  // console.time('append style')
  // let style = document.createElement('style');
  // document.body.appendChild(style);
  // style.innerHTML = fixIE;
  // console.timeEnd('append style')
}


export function render(oldRender: Function) {
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

setTimeout(() => {
  let Timer = getPerformanceTiming();
  Timer && console.table({
    '重定向耗时': Timer['redirectTime'],
    'DNS解析时间': Timer['lookupDomainTime'],
    'TCP建立时间': Timer['connectTime'],
    'HTTP请求耗时': Timer['requestTime'],
    '解析dom树耗时': Timer['domReadyTime'],
    '白屏时间耗时': Timer['whiteTime'],
    'DOMready时间': Timer['domLoadTime'],
    '页面加载完成的时间': Timer['loadTime'],
  })
}, 5000)








export const dva = {
  config: {
    onError(e: any) {
      e.preventDefault();
      console.error(e.message);
    },
    onEffect: (effect: any, { select }: any, model: any, actionType: any) => {
      return function* Gen(action: { stateName: any }, ...args: any[]) {
        const { stateName } = action
        const state = yield select((store: { [x: string]: any }) => store[model.namespace])
        const data = get(state, stateName)
        // 如果所需要验证的数据为空，就执行请求，
        // 不需要验证的情况下，stateName可以留空
        // stateName支持 'a.b[0].c'这样的写法
        // if (stateName) { console.log('data', data) }
        if (isEmpty(data)) {
          yield effect(action, ...args)
        }
      }
    }
  },
  plugins: [
    require('../plugins/dvaLogoutPlugin')
  ]
};