import { Model } from './connect.d';
import {
  getTreeOrgAPI,
  getTreeOrgByAuthAPI,//under分级授权

  getRoleListAPI,
  getRoleListByAuthAPI,//under分级授权

  getUserListAPI,
  getUserListByAuthAPI,//under分级授权

  getUserGroupCategoryAPI,
  getUserGroupCategoryByAuthAPI,//under分级授权
  getUserGroupListByCategoryIdAPI,
} from '@/services/selectors';

import { formatTreeData, initParams, deepCopy4JSON } from '@/utils/utils';
const selectorDefaultParams = {
  pageInfo: { page: 0, pageSize: 20 }
};

interface Param {
  filterInfo: {
    filterModel: boolean,
    [prop: string]: any
  },
  pageInfo: PageInfo
}

interface Category {
  id: string,
  value: string,
  key: string,
  title: string,
  categoryName: string,
  selectable: boolean
}

type CategoryList = Array<Category>

export const formatParamsUserRole: (obj: { page: number, pageSize: number, [p: string]: any }) => Param = ({ page, pageSize, ...restParams } = {} as any) => {
  return {
    filterInfo: {
      filterModel: true,
      ...restParams
    },
    pageInfo: {
      pageSize,
      beginIndex: (page - 1) * pageSize
    }
  };
}

const initialState = {
  //组织机构
  treeOrganizations: [],
  treeOrganizationsByAuth: [],
  listOrganizations4selectorParams: initParams,
  listOrganizations4selector: [],
  listOrganizations4selectorTotal: 0,

  //用户
  listUsers: [],
  listUsersByAuth: [],
  listUsersFilters: null,
  listUsers4selectorParams: initParams,
  listUsers4selector: [],
  listUsers4selectorTotal: 0,
  listUsers4selectorCurrent: 1,

  //角色
  listRoles: [],
  listRolesByAuth: [],
  listRolesFilters: null,
  listRole4selectorParams: initParams,
  listRole4selector: [],
  listRole4selectorTotal: 0,
  listRole4selectorCurrent: 1,

  //用户组
  listUserGroupCategory: [],
  listUserGroupCategoryByAuth: [],
  listUserGroupCategoryTree: [],
  listUserGroupCategoryTreeByAuth: [],
  listUserGroupTree: [],
}

export type SelectorsState = Readonly<typeof initialState>

interface Selectors extends Model {
  state: SelectorsState
}

const SelectorsModel: Selectors = {
  namespace: 'selectors',
  state: initialState,
  effects: {
    //获取所有组织机构信息(树形)
    *fetchTreeOrg({ payload, cb }, { call, put }) {
      const { withAuth } = payload;
      let res = yield call(withAuth && getTreeOrgByAuthAPI || getTreeOrgAPI);
      formatTreeData(res, 'children', { title: 'orgName' });
      cb && cb();
      yield put({
        type: 'save',
        payload: withAuth ? { treeOrganizationsByAuth: res } : { treeOrganizations: res }
      });
    },
    //获取下拉框角色信息(前20条)
    *fetchAllRole({ payload }, { call, put }) {
      const { withAuth, keywords } = payload;
      const api = withAuth ? getRoleListByAuthAPI : getRoleListAPI;
      let data = keywords ? { ...selectorDefaultParams, filterInfo: { filterModel: true, roleName: keywords } } : selectorDefaultParams;
      const res = yield call(api, { data });
      let _payload = keywords ? { listRolesFilters: res.content } : withAuth ? { listRolesByAuth: res.content } : { listRoles: res.content };
      yield put({ type: 'save', payload: _payload });
    },
    //获取放大镜弹窗分页下角色信息
    *listRole({ payload }, { call, put, select }) {
      const { withAuth, params } = payload;
      const { listRole4selectorParams } = yield select(state => state['selectors']);
      const api = withAuth ? getRoleListByAuthAPI : getRoleListAPI;
      const newsParams = Object.assign({}, listRole4selectorParams, formatParamsUserRole(params));
      yield put({
        type: 'save',
        payload: {
          listRole4selectorParams: newsParams
        },
      });
      const ret = yield call(api, { data: newsParams });
      yield put({
        type: 'save',
        payload: {
          listRole4selector: ret.content || [],
          listRole4selectorTotal: ret.totalCount,
          listRole4selectorCurrent: ret.currentPage
        },
      });
    },
    //获取下拉框用户信息(前20条)
    *fetchAllUser({ payload }, { call, put }) {
      const { withAuth, keywords } = payload;
      const api = withAuth && getUserListByAuthAPI || getUserListAPI;
      let data = keywords ? { ...selectorDefaultParams, filterInfo: { filterModel: true, userName: keywords } } : selectorDefaultParams;
      const res = yield call(api, { data });
      let content = (res.content || []) as Array<{ id: string }>;
      let dataSource = content.map(user => ({
        ...user,
        id: user.id.toString() // 兼容 Selector 的value不支持number格式
      }));
      let _payload = keywords ? { listUsersFilters: dataSource } : withAuth ? { listUsersByAuth: dataSource } : { listUsers: dataSource };
      yield put({ type: 'save', payload: _payload });
    },
    //获取放大镜弹窗分页下用户信息
    *listUser({ payload }, { call, put, select }) {
      const { withAuth, params } = payload;
      const api = withAuth && getUserListByAuthAPI || getUserListAPI;
      const { listUsers4selectorParams } = yield select(state => state['selectors']);
      const newsParams = Object.assign({}, listUsers4selectorParams, formatParamsUserRole(params));
      yield put({
        type: 'save',
        payload: {
          listUsers4selectorParams: newsParams
        },
      });
      const res = yield call(api, { data: newsParams });
      let content = (res.content || []) as Array<{ id: string }>;
      let data = content.map(user => ({
        ...user,
        id: user.id
      }));
      yield put({
        type: 'save',
        payload: {
          listUsers4selector: data,
          listUsers4selectorTotal: res.totalCount,
          listUsers4selectorCurrent: res.currentPage,
        },
      });
    },
    //获取所有用户组分类信息(平铺)
    *fetchListCategory({ payload }, { call, put }) {
      const { withAuth, params } = payload;
      const api = withAuth && getUserGroupCategoryByAuthAPI || getUserGroupCategoryAPI;
      const ret: CategoryList = yield call(api, { data: { pageInfo: {} } });
      ret.forEach(item => {
        item.key = item.value = item.id;
        item.title = item.categoryName;
        item.selectable = false;
      });
      yield put({
        type: 'save',
        payload: withAuth ? { listUserGroupCategoryByAuth: ret || [], listUserGroupCategoryTreeByAuth: ret || [] }
          : { listUserGroupCategory: ret || [], listUserGroupCategoryTree: ret || [] },
      });
    },
    //获取对应用户组分类下用户组信息(树形)
    *fetchListUserGroup({ payload }, { call, put, select }) {
      const { id, withAuth } = payload;
      const { listUserGroupCategoryTree, listUserGroupCategoryTreeByAuth } = yield select(state => state['selectors']);
      let targetCategory = withAuth && listUserGroupCategoryTreeByAuth || listUserGroupCategoryTree;
      let data = { id, node: 'root', pageInfo: {} };
      let ret = yield call(getUserGroupListByCategoryIdAPI, { data });
      formatTreeData(ret, 'children', { title: 'groupName' }, V => {
        if (V.children && V.children.length) {
          V.isLeaf = false;
        } else {
          V.isLeaf = true;
        }
      });
      let newTree = deepCopy4JSON(targetCategory);
      let categoryNode = newTree.find((_node: { id: string }) => _node.id === id);
      if (ret.length) {
        categoryNode.children = ret || [];
      } else {
        categoryNode.isLeaf = true;
      }
      let _payload = { listUserGroupTree: ret || [] } as {
        listUserGroupTree: [],
        listUserGroupCategoryTreeByAuth?: [],
        listUserGroupCategoryTree?: []
      };
      withAuth ? _payload.listUserGroupCategoryTreeByAuth = newTree : _payload.listUserGroupCategoryTree = newTree;
      yield put({ type: 'save', payload: _payload });
      return true;
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
};

export default SelectorsModel;