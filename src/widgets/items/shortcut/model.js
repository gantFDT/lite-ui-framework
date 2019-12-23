
import { fetchDataApi, modifyDataApi } from './service';
export default {
  namespace: 'shortcutWidget',
  state: {
    shortcut: [],
    columns:3,
  },
  effects: {
    *fetchData({ payload }, { call, put, select }) {
      try {
        const response = yield call(fetchDataApi);
        if (!response) { return }
        let shortcut = JSON.parse(response.bigData).shortcut;
        const {flatmenu} = yield select(state=>state.menu)
        shortcut.map(item=>{
          item.name = flatmenu[item.path] ? flatmenu[item.path].name : item.name
        })
        yield put({
          type: 'save',
          payload: {
            shortcut,
            columns: JSON.parse(response.bigData).columns,
          },
        });
      } catch (err) {
        console.warn(err);
      }
    },
    *updateConfigShortcut({ payload }, { call, put }) {
      try {
        const { shortcut ,columns} = payload;
        const response = yield call(modifyDataApi, {
          shortcut: shortcut,
          columns:columns
        });
        yield put({
          type: 'save',
          payload: {
            shortcut:shortcut,
            columns:columns
          },
        });
      } catch (err) {
        console.warn(err);
      }
    }
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
