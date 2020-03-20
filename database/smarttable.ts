import { gStatus } from './utils'
import { clearObject } from '@/utils/utils'
import { copy } from '@/utils/utils'
export default {
  '/smarttable/findApi': async (params: any) => {
    let { pageInfo: { pageSize, beginIndex }, filterInfo } = params
    // let data1 = await db['smarttable'].toArray();
    // copy(JSON.stringify({ a: data1 }))
    pageSize = parseInt(pageSize)
    beginIndex = parseInt(beginIndex)

    let data, totalCount
    if (!_.isEmpty(filterInfo)) {
      filterInfo = clearObject(filterInfo)
      data = await db['smarttable'].where({ ...filterInfo }).offset(beginIndex * pageSize - pageSize).limit(pageSize).toArray();
      totalCount = await db['smarttable'].where({ ...filterInfo }).count();
    } else {
      data = await db['smarttable'].offset(beginIndex * pageSize - pageSize).limit(pageSize).toArray();
      totalCount = await db['smarttable'].count();
    }

    data = gStatus('success', { data, totalCount })
    return data
  },
  '/smarttable/getApi': async (params: any) => {
    let { id } = params
    let data
    data = await db['smarttable'].get(parseInt(id));
    data = gStatus('success', data)
    return data
  },
  '/smarttable/createApi': async (params: any) => {
    const res = await db['smarttable'].add(params);
    let data = gStatus('success', res)
    return data
  },
  '/smarttable/removeApi': async (params: any) => {
    let { id } = params
    let res = await db['smarttable'].where({ id: parseInt(id) }).delete();
    let data = gStatus('success', res)
    return data
  },
  '/smarttable/updateApi': async (params: any) => {
    const { id, ...restParams } = params
    let res = await db['smarttable'].where({ id: parseInt(id) }).modify({ ...restParams });
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