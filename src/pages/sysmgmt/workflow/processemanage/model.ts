import { listFlowProcessAPI } from './service';

export const namespace: string = 'processManage';
export default {
  namespace,
  state: {
    filterInfo: {},
    pageInfo: {
      pageSize: 50,
      beginIndex: 0
    },
    data: [],
    total: 0
  },
  effects: {
    *listFlowProcess({ payload }: any, { call, put, select }: any) {
      const { filterInfo, pageInfo } = yield select((store: any) => store[namespace]);
      const newsParams = { filterInfo, pageInfo, ...payload };
      const { content, totalCount } = yield call(listFlowProcessAPI, newsParams);
      yield put({
        type: 'save',
        payload: {
          data: content,
          total: totalCount,
          filterInfo: newsParams.filterInfo,
          pageInfo: newsParams.pageInfo
        }
      });
    }
  },
  reducers: {
    save(state: any, { payload }: any) {
      return {
        ...state,
        ...payload,
      };
    },
  },
}
