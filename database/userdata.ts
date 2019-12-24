import {gStatus} from './utils'

export default {
  '/accountUserSelf/getUserData': async (params: any) => {
    const { dataType, dataId } = params
    let data = await db['userData'].where({ dataType, dataId }).toArray();
    if (!_.isEmpty(data)) {
      data = data[0]
    } else {
      data = null
    }
    data = gStatus('success',data)
    return data
  },
  '/accountUserSelf/setUserData': async (params: any) => {
    const { dataType, dataId, bigData } = params
    const collection = await db['userData'].where({ dataType, dataId }).toArray();
    let res
    if (!_.isEmpty(collection)) {
      res = await db['userData'].where({ dataType, dataId }).modify({ bigData });
    } else {
      res = await db['userData'].add(params);
    }
    let data = gStatus('success',res)
    return data
  },
  '/accountUserSelf/delUserData': async (params: any) => {
    const { dataType, dataId } = params
    let res = await db['userData'].where({ dataType, dataId }).delete();
    let data = gStatus('success',res)
    return data
  },
}