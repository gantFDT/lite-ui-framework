import { notification } from 'antd';
import {
  listGroupAPI,
  listExcludeGroupAPI,
  createGroupAPI,
  updateGroupAPI,
  removeGroupAPI,
  moveGroupToRootAPI,
  moveGroupToParentAPI
} from '../service';
import { formatTreeData } from '@/utils/utils';

const namespace = 'group';

const emptyParams = {
  id: "",
  categoryId: "",
  parentGroupId: "ROOT",
  groupCode: "",
  groupName: "",
  groupDesc: "",
  userCount: 0,
  leaf: false,
  optCounter: 0,
  children: "",
  parentId: "",
  index: -1,
  depth: 0,
  expanded: false,
  expandable: true,
  checked: null,
  cls: "",
  iconCls: "",
  icon: "",
  root: false,
  isLast: false,
  isFirst: false,
  allowDrop: true,
  allowDrag: true,
  loaded: false,
  loading: false,
  href: "",
  hrefTarget: "",
  qtip: "",
  qtitle: "",
  qshowDelay: 0,
  visible: true
}

export default {
  namespace,
  state: {
    selectedRowKeys: [],
    selectedRows: [],

    groupList: [],
    groupListTotal: 0,
    excludeGroupList: [],
    excludeGroupSelectedKeys: [],
    excludeGroupListTotal: 0,
    formModalVisible: false,
    aimModalVisible: false,
    drawerVisible: false,
    createMode: 'root'
  },
  effects: {
    *listGroup({ payload }, { call, put, select }) {
      const { selectedRowKeys: [groupCategoryId] } = yield select(state => state['groupCategory']);
      const ret = yield call(listGroupAPI, {
        data: {
          id: groupCategoryId,
          node: "root",
          pageInfo: {}
        }
      });
      formatTreeData(ret);
      yield put({
        type: 'save',
        payload: {
          groupList: ret || [],
          groupListTotal: ret.length,
          selectedRowKeys: [],
          selectedRows: []
        },
      });
    },
    *listExcludeGroup({ payload }, { call, put, select }) {
      const { selectedRowKeys: [groupCategoryId] } = yield select(state => state['groupCategory']);
      const { selectedRowKeys: [groupId] } = yield select(state => state[namespace]);
      const ret = yield call(listExcludeGroupAPI, {
        data: {
          categoryId: groupCategoryId,
          excludeGroupId: groupId,
          node: "root",
          pageInfo: {}
        }
      });
      formatTreeData(ret);
      yield put({
        type: 'save',
        payload: {
          excludeGroupList: ret || [],
          excludeGroupListTotal: ret.length,
          excludeGroupSelectedKeys: []
        },
      });
    },
    *createGroup({ payload, callback }, { call, put, select }) {
      const { selectedRowKeys: [groupCategoryId] } = yield select(state => state['groupCategory']);
      const { selectedRowKeys: [groupId], createMode } = yield select(state => state[namespace]);
      yield call(createGroupAPI, {
        data: {
          ...emptyParams,
          categoryId: groupCategoryId,
          parentGroupId: createMode === 'root' ? "ROOT" : groupId,
          ...payload
        }
      });
      notification.success({ message: tr('新增用户组成功') });
      callback && callback()
      yield put({ type: 'listGroup' });
      yield put({type:"organization/fetchAllUserGroup"});
      yield put({
        type: 'save',
        payload: {
          formModalVisible: false
        },
      });
    },
    *removeGroup({ payload, callback }, { call, put, select }) {
      const { selectedRowKeys: [id] } = yield select(state => state[namespace]);
      yield call(removeGroupAPI, { data: { id } });
      callback && callback()
      notification.success({ message: tr('删除用户组成功') });

      yield put({ type: 'listGroup' });
    },
    *updateGroup({ payload, callback }, { call, put, select }) {
      const { selectedRowKeys: [id], selectedRows: [rowData] } = yield select(state => state[namespace]);
      yield call(updateGroupAPI, {
        data: {
          id,
          ...rowData,
          ...payload
        }
      });
      notification.success({ message: tr('编辑用户组成功') });
      callback && callback()
      yield put({ type: 'listGroup' });
      yield put({type:"organization/fetchAllUserGroup"});
      yield put({
        type: 'save',
        payload: {
          formModalVisible: false
        },
      });
    },
    *moveGroupToRoot({ payload }, { call, put, select }) {
      const { selectedRowKeys: [id] } = yield select(state => state[namespace]);
      yield call(moveGroupToRootAPI, {
        data: {
          id
        }
      });
      notification.success({ message: tr('移动用户组成功') });
      yield put({ type: 'listGroup' });
      yield put({type:"organization/fetchAllUserGroup"});
    },
    *moveGroupToParent({ payload }, { call, put, select }) {
      const { selectedRowKeys: [id], excludeGroupSelectedKeys: [aimId] } = yield select(state => state[namespace]);
      yield call(moveGroupToParentAPI, {
        data: {
          id,
          parentGroupId: aimId
        }
      });
      notification.success({ message: tr('移动用户组成功') });
      yield put({ type: 'listGroup' });
      yield put({type:"organization/fetchAllUserGroup"});
      yield put({
        type: 'save',
        payload: {
          aimModalVisible: false
        },
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    }
  },
};
