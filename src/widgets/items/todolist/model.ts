import { fetchProcessApi, transApi } from './service';
import { Model } from 'dva'
import { getUserInfo } from '@/utils/user'
import { getImageById } from '@/utils/utils'
import emptyblock from '@/assets/images/emptyblock.png'
export interface ModelProps {
  params: object;
  data: object[];
  modalVisible: boolean
}



const reduxModel: Model = {
  namespace: 'widgetTodoList',
  state: {
    params: {

    },
    data: [],
    modalVisible: false,
  },
  effects: {
    *fetch({ payload }, { call, put, select }) {
      const { params } = yield select((state: object) => state['widgetTodoList']);
      const newsParams = { ...params, ...payload };
      const data = yield call(fetchProcessApi, newsParams);
      const now = Date.now()
      for (const item of data) {
        const employee = yield call(getUserInfo, '', item['createBy']);
        const avatarUrl = getImageById(employee.pictureId) || emptyblock;
        item['createByAvatarUrl'] = avatarUrl
        item['delay'] = false
        const dueTime = new Date(item['dueDate']).getTime();

        if (now > dueTime) {
          item['delay'] = true
        }
        if (item['dueDate'] === item['startDate']) {
          item['dueDate'] = ''
        }
      }

      yield put({
        type: 'save',
        payload: {
          data,
          params: newsParams
        },
      });
    },
    *reload({ payload }, { call, put, select }) {
      const { params } = yield select((state: object) => state['widgetTodoList']);
      const newsParams = { ...params, ...payload };
      const data = yield call(fetchProcessApi, newsParams);
      yield put({
        type: 'save',
        payload: {
          data,
          params: newsParams
        },
      });
    },
    *trans({ payload }, { call, put, select }) {
      const res = yield call(transApi, payload);
      if (res) {
        yield put({
          type: 'fetch',
        });
      }
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
