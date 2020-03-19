import { Model } from './connect'

const collapsed = localStorage.getItem('mainMenuCollapsed') === 'false' ? false : true

const initalState = {
  collapsed,
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
  effects: {},
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