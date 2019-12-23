import { queryNotices } from '@/services/user';
import { Model } from './connect'

// 通知
interface NoticeItem {
  read: boolean,
  id: string,
  type: string
}

const collapsed = localStorage.getItem('mainMenuCollapsed') === 'false' ? false : true

const initalState = {
  collapsed,
  notices: [] as Array<NoticeItem>,
  startMenu: null,
  filterDrawerStack: {
    activeKey: ''
  }, // 用于快捷键展开筛选器抽屉时区分哪一个
}

export type GlobalModelState = Readonly<typeof initalState>

interface GlobalModel extends Model {
  state: GlobalModelState
}

const globalModel: GlobalModel = {
  namespace: 'global',
  state: initalState,
  effects: {
    *fetchNotices(_, { call, put, select }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount = yield select(state => state.global.notices.filter(item => !item.read).length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },

    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const { count, unreadCount } = yield select(state => (
        {
          count: state.global.notices.length,
          unreadCount: state.global.notices.filter(item => !item.read).length
        }
      ));
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },

    *changeNoticeReadState({ payload }, { put, select }) {
      const notices: Array<NoticeItem> = yield select(state => state.global.notices.map(
        ({ ...notice }) => {
          if (notice.id === payload) {
            notice.read = true;
          }
          return notice;
        })
      );
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },
  },
  reducers: {
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed,
      },
      { payload },
    ) {
      localStorage.setItem('mainMenuCollapsed', payload)
      return { ...state, collapsed: payload };
    },

    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },

    saveClearedNotices(
      state = { notices: [] },
      { payload },
    ): GlobalModelState {
      return {
        ...state,
        notices: (state.notices as Array<NoticeItem>).filter(item => item.type !== payload),
      };
    },

    setFilterDrawerVisible(state, { payload }) {
      let filterDrawerStack = {
        ...state.filterDrawerStack
      };
      if (payload && payload.filterKey) {
        filterDrawerStack[payload.filterKey] = payload.visible
      } else {
        filterDrawerStack[filterDrawerStack.activeKey] = !filterDrawerStack[filterDrawerStack.activeKey];
      }
      return {
        ...state,
        filterDrawerStack
      };
    },

    save(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
  },
  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
export default globalModel;