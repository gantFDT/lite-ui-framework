
import { gStatus } from './utils'

export default {
  '/file/upload': async (params: any) => {
    const { dataType, dataId } = params
    console.log('params',params)
    let data = await db['companyData'].where({ dataType, dataId }).toArray();
    if (!_.isEmpty(data)) {
      data = data[0]
    } else {
      data = null
    }
    data = gStatus('success', data)
    return data
  },
  '/file/turnRight': async (params: any) => {
    const { dataType, dataId } = params
    let data = await db['companyData'].where({ dataType, dataId }).toArray();
    if (!_.isEmpty(data)) {
      data = data[0]
    } else {
      data = null
    }
    data = gStatus('success', data)
    return data
  },
}