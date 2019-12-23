import cache from './cache'
import request from '@/utils/request'

interface CodeTypeItem {
  value: string,
  name: string,
  [prop: string]: any
}

type CodeList = Array<CodeTypeItem>

const { codelist } = cache as { codelist: any }

// 异步获取
function CodeList(type: string): Promise<CodeList>
// 同步获取
function CodeList(type: string, sync: boolean): CodeList
// 设置值
function CodeList(type: string, sync: boolean, value: any): void
function CodeList(type: string, sync = false, value?: CodeList) {
  // 存
  if (value) {
    if (sync) {
      codelist(`${type}:sync`, value)
    } else {
      codelist(type, value)
    }
  }
  // 取
  else if (sync) {
    return codelist(`${type}:sync`)
  } else {
    return codelist(type)
  }
}

const API = '/codeList/findByType'

function query(listType: string) {
  const task: Promise<CodeList> = request.post(API, {
    data: {
      type: listType,
    },
  }).then(list => {
    // 缓存数据
    CodeList(listType, true, list)
    return list
  })
  // 缓存任务
  CodeList(listType, false, task)
  return task
}

/**
 * 异步获取编码列表
 * @param listType 编码类型
 * @param [cb] 获取list的回调，可以方便的与hooks函数结合
 */
export function getCodeList(listType: string, cb?: (list: CodeList) => any) {
  return (CodeList(listType) || query(listType)).then(
    (list: CodeList) => {
      if (cb) {
        cb(list)
      }
      return list
    }
  )
}

/**
 *  异步获取编码值
 * @param listType 编码类型
 * @param codeType 编码的值
 * @param [cb] 获取name的回调，可以方便的与hooks函数结合
 */
export function getCodeName(listType: string, codeType: string, cb?: (name: string) => any) {
  return getCodeList(listType).then(
    (list: CodeList) => {
      for (const item of list) {
        if (item.value === codeType) {
          if (cb) {
            cb(item.name)
          }
          return item.name
        }
      }
      return ''
      throw new Error(`在${listType}类型里面，没有找到${codeType}的编码`)
    }
  )
}

/**
 * 根据列表查找编码
 * @param list codelist列表
 * @param codeType 需要查找name的code
 */
export function getCodeNameSync(list: CodeList, codeType: string) {
  for (const item of list) {
    if (item.value === codeType) {
      return item.name
    }
  }
  return;
}

/**
 * 同步获取编码值
 * @param listType 类型
 * @param codeType 编码
 */
export function getCodeNameSyncSto(listType: string, codeType: string) {
  const list = CodeList(listType, true)
  if (!list || !list.length) return ''
  for (const item of list) {
    if (item.value === codeType) {
      return item.name
    }
  }
  return ''
}
