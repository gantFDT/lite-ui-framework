import { get, omit } from 'lodash'

import { getMainMenuAPI, createMenuAPI, removeMenuAPI, updateMenuAPI, moveToRootAPI, moveUpAPI, moveDownAPI, moveToParentAPI } from './service'

const initialState = {}

function resolveMenu(list) {
  return list.map(item => {
    if (!get(item, 'children.length')) {
      return omit(item, 'children')
    }
    return { ...item, children: resolveMenu(item.children) }
  })
}

const umiModule = {
  namespace: 'menumanage',

  state: initialState,

  effects: {
    *queryMenuData({ payload, menuType }, { call, put }) {
      try {
        const response = yield call(getMainMenuAPI, payload)

        yield put({
          type: 'saveMenu',
          payload: {
            [menuType]: {
              menuList: resolveMenu(response)
            }
          }
        })
      }
      catch{
        // 错误上报
      }
    },
  },

  reducers: {
    saveMenu(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    resetState: () => initialState
  }

}


const methods = [
  {
    method: 'create',
    api: createMenuAPI
  },
  {
    method: 'remove',
    api: removeMenuAPI
  },
  {
    method: 'update',
    api: updateMenuAPI
  },
  {
    method: 'move',
    api: moveToRootAPI
  },
  {
    method: 'up',
    api: moveUpAPI
  },
  {
    method: 'down',
    api: moveDownAPI
  },
  {
    method: 'moveToParent',
    api: moveToParentAPI
  },
]
methods.forEach(({ method, api }) => {
  umiModule.effects[`${method}Menu`] = function* effect({ payload, callback, final }, { call, put }) {
    try {
      yield call(api, payload)
      if (callback) { callback() }
    }
    catch{
      // 错误上报
    }
    finally {
      if (final) { final() }
    }
  }
});

export default umiModule