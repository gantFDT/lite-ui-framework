
export interface Operator {
  key: string // 操作符标识
  name: string // 操作符中文名称
  symbol?: string // 操作符符号
}

export interface OperatorObj {
  [key: string]: Operator
}

export interface TypeOperator {
  [key: string]: string[]
}

// 操作符类型
export type OperatorType = 'EQ' | 'NOT_EQ' | 'LIKE' | 'NOT_LIKE' | 'START_WITH' | 'END_WITH' | 'IN' | 'NOT_IN' | 'IS_NULL' | 'IS_NOT_NULL' | 'LT' | 'LT_EQ' | 'GT' | 'GT_EQ' | 'EMPTY'

const ALL_OPERATORS: OperatorObj = {
  EQ: {
    key: 'EQ',
    symbol: '=',
    name: tr('等于'),
  },
  NOT_EQ: {
    key: 'NOT_EQ',
    symbol: '!=',
    name: tr('不等于'),
  },
  LIKE: {
    key: 'LIKE',
    name: tr('包含'),
  },
  NOT_LIKE: {
    key: 'NOT_LIKE',
    name: tr('不包含'),
  },
  START_WITH: {
    key: 'START_WITH',
    name: tr('以..开头'),
  },
  END_WITH: {
    key: 'END_WITH',
    name: tr('以..结尾'),
  },
  IN: {
    key: 'IN',
    name: tr('属于'),
  },
  NOT_IN: {
    key: 'NOT_IN',
    name: tr('不属于'),
  },
  IS_NULL: {
    key: 'IS_NULL',
    name: tr('为空'),
  },
  IS_NOT_NULL: {
    key: 'IS_NOT_NULL',
    name: tr('不为空'),
  },
  LT: {
    key: 'LT',
    name: tr('小于'),
    symbol: '<'
  },
  LT_EQ: {
    key: 'LT_EQ',
    name: tr('小于等于'),
    symbol: '<='
  },
  GT: {
    key: 'GT',
    name: tr('大于'),
    symbol: '>'
  },
  GT_EQ: {
    key: 'GT_EQ',
    name: tr('大于等于'),
    symbol: '>='
  },
  EMPTY: {
    key: 'EMPTY',
    name: tr('无')
  }
}


// 类型与操作符对应
const TYPE_OPERATORS: TypeOperator = {
  string: ['EQ', 'NOT_EQ', 'LIKE', 'NOT_LIKE', 'START_WITH', 'END_WITH', 'IN', 'NOT_IN', 'IS_NULL', 'IS_NOT_NULL'],
  number: ['EQ', 'NOT_EQ', 'LT', 'LT_EQ', 'GT', 'GT_EQ', 'IN', 'NOT_IN', 'IS_NULL', 'IS_NOT_NULL'],
  date: ['EQ', 'NOT_EQ', 'LT', 'LT_EQ', 'GT', 'GT_EQ', 'IS_NULL', 'IS_NOT_NULL'],
  boolean: ['EQ', 'IS_NULL', 'IS_NOT_NULL'],
  codelist: ['EQ', 'IN', 'NOT_IN', 'IS_NULL', 'IS_NOT_NULL'],
  object: ['EQ', 'IN', 'NOT_IN', 'IS_NULL', 'IS_NOT_NULL']
}

export {
  ALL_OPERATORS as allOperators,
  TYPE_OPERATORS as typeOperators
}
