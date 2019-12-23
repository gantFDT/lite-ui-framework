// import { formatMessage, setLocale, getLocale, FormattedMessage } from 'umi/locale';

import { setLocale, getLocale } from 'umi/locale';

//获取本地英文信息
import enData from '@/locales/en-US';
import customEnData from '@/localescustom/en-US';
const enDataMerge = { ...enData, ...customEnData }

//获取激活的语言类型

//获取远程信息

function getMessage(id:string) {
  const currentLangulage = window.localStorage.getItem('umi_locale') || 'zh-CN';
  let remoteLangulages = window['remoteLangulages'];
  let message = id;
  //如果有远程信息，以远程信息为准
  if (remoteLangulages && remoteLangulages[currentLangulage]) {
    _.map(remoteLangulages[currentLangulage], langulage => {
      if (langulage.keyword == id) {
        message = langulage.value;
      }
    })
  }
  //如果没有远程信息，以本地信息为准
  if (message == id) {
    if (currentLangulage == 'zh-CN') {
      return message
    } else if (currentLangulage == 'en-US') {
      return enDataMerge[message] || message
    }
  } else {
    return message
  }
}



function tr(id:string) {
  return getMessage(id)
}

window['tr'] = tr

export default tr
export { tr, setLocale, getLocale }
