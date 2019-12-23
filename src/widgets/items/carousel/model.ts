
import { fetchDataApi, modifyDataApi } from './service';
import { getImageById } from '@/utils/utils'

export default {
  namespace: 'carouselWidget',
  state: {
    list: [],
    activeIndex: 0,
    autoPlay: true,
    interval: 3,
    actionPosition: 'bottom',
    effect: 'scrollx',
  },
  effects: {
    *fetchData({ payload }, { call, put }) {
      try {
        const { widgetKey } = payload;
        const response = yield call(fetchDataApi, payload);
        const activeIndex = 0;
        if (!response.bigData) { return }
        let {list,...restParams} = JSON.parse(response.bigData)
        list && list.map((item) => {
          if (item.pictureId) {
            item.img = getImageById(item.pictureId)
          }
        })
        yield put({
          type: 'save',
          payload: {
            list,
            ...restParams,
            activeIndex
          },
        });
      } catch (err) {
        console.warn(err);
      }
    },
    *modifyData({ payload }, { call, put, select }) {
      try {
        const {
          widgetKey,
          list,
          ...restParams
        } = payload;
        const {
          autoPlay,
          interval,
          actionPosition,
          effect
        } = yield select((state: any) => state['carouselWidget'])
        const newRestParams = {
          autoPlay,
          interval,
          actionPosition,
          effect,
          ...restParams
        }
        const response = yield call(modifyDataApi, {
          widgetKey,
          data: {
            list,
            ...newRestParams
          }
        });
        yield put({
          type: 'save',
          payload: {
            list,
            ...newRestParams
          },
        });
      } catch (err) {
        console.warn(err);
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
  },
};
