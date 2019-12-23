import request from '@/utils/request';
import moment from 'moment'

//获取系统时间
export async function getSystemDate() {
  var systemDate = null;
  const data = await request('/gantPlatform/getSystemDate', {
    method: 'POST'
  })
  systemDate = data
  return systemDate;
}

//获取系统时间格式化字符串
export async function getSystemDateString(formate: string = '') {
  var systemDateString = null;
  let data = await request('/gantPlatform/getSystemDate', {
    method: 'POST'
  })
  let systemDate = moment(data).format('YYYY-MM-DD HH:mm:ss')
  const allModels = window['g_app']['_models']
  const config = _.find(allModels, (item) => {
    return item.namespace == 'config'
  })
  const {
    state: {
      COMMON_CONFIG: {
        defaultDateFormat
      }
    }
  } = config
  if (systemDate) {
    if (!formate) {
      systemDateString = moment(systemDate).format(defaultDateFormat)
    } else {
      systemDateString = moment(systemDate).format(formate)
    }
  }
  return systemDateString
}