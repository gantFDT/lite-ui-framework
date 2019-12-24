import {gStatus} from './utils'

export default {
  '/companyData/getCompanyData': async (params: any) => {
    const { dataType, dataId } = params
    let data = await db['companyData'].where({ dataType, dataId }).toArray();
    if (!_.isEmpty(data)) {
      data = data[0]
    } else {
      data = null
    }
    data = gStatus('success',data)
    return data
  },
  '/companyData/setCompanyData': async (params: any) => {
    const { dataType, dataId, bigData } = params
    const collection = await db['companyData'].where({ dataType, dataId }).toArray();
    let res
    if (!_.isEmpty(collection)) {
      res = await db['companyData'].where({ dataType, dataId }).modify({ bigData });
    } else {
      res = await db['companyData'].add(params);
    }
    let data = gStatus('success',res)
    return data
  },
  '/companyData/delCompanyData': async (params: any) => {
    const { dataType, dataId } = params
    let res = await db['companyData'].where({ dataType, dataId }).delete();
    let data = gStatus('success',res)
    return data
  },
}