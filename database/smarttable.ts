import { gStatus } from './utils'
import { clearObject } from '@/utils/utils'
import { copy } from '@/utils/utils'
export default {
  '/smarttable/findApi': async (params: any) => {
    let { pageInfo: { pageSize, beginIndex }, filterInfo } = params
    let data1 = await db['smarttable'].toArray();
    copy(JSON.stringify({ a: data1 }))
    let data
    if (!_.isEmpty(filterInfo)) {
      filterInfo = clearObject(filterInfo)
      data = await db['smarttable'].where({ ...filterInfo }).offset(beginIndex).limit(pageSize).toArray();
    } else {
      data = await db['smarttable'].offset(beginIndex).limit(pageSize).toArray();
    }
    data = gStatus('success', data)
    return data
  },
  '/smarttable/createApi': async (params: any) => {
    const res = await db['smarttable'].add(params);
    let data = gStatus('success', res)
    return data
  },
  '/smarttable/removeApi': async (params: any) => {
    const { id } = params
    let res = await db['smarttable'].where({ id }).delete();
    let data = gStatus('success', res)
    return data
  },
  '/smarttable/updateApi': async (params: any) => {
    const { id, ...restParams } = params
    let res = await db['smarttable'].where({ id }).modify({ ...restParams });
    let data = gStatus('success', res)
    return data
  },
  '/smarttable/findDomain': [{
    name: 'javascript',
    domain: 'javascript',
  }, {
    name: 'java',
    domain: 'java',
  }, {
    name: 'c',
    domain: 'c',
  }, {
    name: 'c++',
    domain: 'c++',
  }, {
    name: 'swift',
    domain: 'swift',
  }, {
    name: 'go',
    domain: 'go',
  }, {
    name: 'python',
    domain: 'python',
  }, {
    name: 'php',
    domain: 'php',
  }]
}