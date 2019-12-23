import expireCache from 'expire-cache'

const timer = 3600 * 8

const exporter = {};

([
  'organization', // 组织信息
  'user', // 用户信息,
  'userExtra',
  'codelist',
  'language',
  'selector',
  'role',
  'userGroup'
]).forEach(code => {
  exporter[code] = expireCache.namespace(code, timer)
})

export default exporter