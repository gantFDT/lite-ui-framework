import { fetch, update, fetchCurrentLayout, updateCurrentLayout, removeCurrentLayout } from './service';
import _ from 'lodash'
import { Model } from 'dva'
import { widgets } from '@/widgets'
import { getWidgetType } from '@/widgets/utils'
export interface ModelProps {
  data: object[];
}

const getPureData = (data: object[]) => {
  let Temp = _.cloneDeep(data)
  Temp.map((item) => {
    delete item['currentLayout']
    delete item['currentLayoutCopy']
  })
  return Temp
}

const reduxModel: Model = {
  namespace: 'dashboardmgmt',
  state: {
    data: [],
    repositoryData: []
  },
  effects: {
    *fetch({ payload, callback }, { call, put, select }) {
      const { type } = payload
      let res = yield call(fetch, {
        ...payload
      })
      if (res) {
        const data = JSON.parse(res.bigData).data
        if (type == 'user') {
          if (!_.find(data, (item) => item['id'] === 'default')) {
            data.unshift({
              id: 'default',
              name: tr('基础仪表板'),
              description: tr('默认系统自带仪表板') + ',' + tr('不能删除') + ',' + tr('可以设计') + ',' + tr('可以通过此仪表板复制')
            })
          }
        }
        // _.uniqWith(data, (arrVal: any, othVal: any) => arrVal['id'] == othVal['id']);
        for (const item of data) {
          const { id } = item
          const layoutRes = yield call(fetchCurrentLayout, { id, type })
          if (layoutRes && layoutRes.bigData) {
            item.currentLayout = JSON.parse(layoutRes.bigData).currentLayout
            item.currentLayoutCopy = JSON.parse(layoutRes.bigData).currentLayout
            item.currentLayout && item.currentLayout.map((item: object) => {
              const widgetType = getWidgetType(item['i'])
              if (!widgetType) { return }
              item['widgetType'] = widgetType
              item['name'] = widgets[widgetType]['name']
              item['iconBackground'] = widgets[widgetType]['iconBackground']
              item['icon'] = widgets[widgetType]['icon']
              item['snapShot'] = widgets[widgetType]['snapShot']
            })
          }
        }
        if (type == 'user') {
          yield put({
            type: 'save',
            payload: {
              data
            }
          })
          yield put({
            type: 'menu/saveDashBoards',
            payload: {
              dashboards: data
            }
          })
        } else {
          yield put({
            type: 'save',
            payload: {
              repositoryData: data
            }
          })
        }
      }
    },
    *create({ payload, callback }, { call, put, select }) {
      const { row, type } = payload
      let data;
      if (type == 'user') {
        data = yield select((state: object) => state['dashboardmgmt']['data'])
      } else {
        data = yield select((state: object) => state['dashboardmgmt']['repositoryData'])
      }
      const pureData = getPureData(data)

      let res = yield call(update, {
        type,
        data: pureData.concat([row])
        // data: []
      })
      if (res) {
        yield put({
          type: 'fetch',
          payload: {
            type
          }
        })
        callback && callback()
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const { row, type } = payload
      let data;
      if (type == 'user') {
        data = yield select((state: object) => state['dashboardmgmt']['data'])
      } else {
        data = yield select((state: object) => state['dashboardmgmt']['repositoryData'])
      }
      const pureData = getPureData(data)
      pureData.map((item: object, index: number, arr: object[]) => {
        if (item['id'] == row.id) {
          pureData.splice(index, 1, row)
        }
      })
      let res = yield call(update, {
        type,
        data: pureData
      })
      if (res) {
        yield put({
          type: 'fetch',
          payload: {
            type
          }
        })
        callback && callback()
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const { id, row, type } = payload
      let data;
      if (type == 'user') {
        data = yield select((state: object) => state['dashboardmgmt']['data'])
      } else {
        data = yield select((state: object) => state['dashboardmgmt']['repositoryData'])
      }
      let pureData = getPureData(data)
      pureData = pureData.filter((item: object) => item['id'] != row['id'])
      let res = yield call(update, {
        type,
        data: pureData
      })
      yield call(removeCurrentLayout, {
        id,
        type
      })
      if (res) {
        yield put({
          type: 'fetch',
          payload: {
            type
          }
        })
        callback && callback()
      }
    },
    *copy({ payload, callback }, { call, put, select }) {
      const { data } = yield select((state: object) => state['dashboardmgmt'])
      let pureData = getPureData(data)
      const { row, type, currentLayout, id } = payload
      yield call(update, {
        type,
        data: pureData.concat([row])
      })
      yield call(updateCurrentLayout, {
        id,
        type,
        data: {
          currentLayout
        }
      })
      yield put({
        type: 'fetch',
        payload: {
          type
        }
      })
      callback && callback()
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
}

export default reduxModel