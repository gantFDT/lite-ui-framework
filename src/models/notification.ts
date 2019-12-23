import {
    getNotificationListApi,          //获取所有消息列表
    getLatest20newsApi,              //获取最新20条信息
    getUnreadCountApi,               //获取未读消息总数
    setNoticesReadedApi,             //设置为已读
    createAnnouncementApi,           //创建公告
    editAnnouncementApi,             //编辑公告
    removeNoticesApi                 //删除消息
} from '@/services/notification';
import { initParams } from '@/utils/utils';
import { Model } from './connect'

type DataSource = Array<{
    id: string,
    status: string
}>

const initialState = {
    visible: false,
    dataSource: [] as DataSource,
    unreadCount: 0,
    listParams: initParams,
    listData: [],
    listTotal: 0,
    observers: {},
}

export type NotificationState = Readonly<typeof initialState>

interface Notification extends Model {
    state: NotificationState
}

export const namespace = 'notification';

export default {
    namespace,
    state: initialState,

    effects: {
        //获取最新数据和未读消息总数
        *fetch(action, { call, put }) {
            try {
                const dataSource = yield call(getLatest20newsApi);
                const unreadCount = yield call(getUnreadCountApi);
                yield put({
                    type: 'save',
                    payload: { dataSource, unreadCount }
                })
            } catch (err) {
                console.warn(err)
            }
        },
        //接受并新增新的信息
        *receiveNew({ payload }, { put, select }) {
            const { dataSource, unreadCount, listParams } = yield select(state => state.notification);
            yield put({
                type: 'save',
                payload: {
                    dataSource: [payload, ...dataSource],
                    unreadCount: unreadCount + 1
                }
            });
            yield put({ type: 'getListData', payload: listParams });
        },
        //获取所有消息列表
        *getListData({ payload }, { call, put, select }) {
            try {
                const { listParams } = yield select((state: object) => state[namespace]);
                const newsParams = { ...listParams, ...payload };
                yield put({ type: 'save', payload: { listParams: newsParams } })
                const res = yield call(getNotificationListApi, newsParams);
                yield put({
                    type: 'save',
                    payload: {
                        listData: res.content,
                        listTotal: res.totalCount,
                    }
                })
            } catch (err) {
                console.warn(err)
            }
        },
        //创建公告
        *createAnnouncement({ payload, callback }, { call }) {
            try {
                yield call(createAnnouncementApi, payload);
                callback && callback();
            } catch (err) {
                console.warn(err)
            }
        },
        //编辑公告
        *editAnnouncement({ payload, callback }, { call }) {
            try {
                yield call(editAnnouncementApi, payload);
                callback && callback();
            } catch (err) {
                console.warn(err)
            }
        },
        //设置已读
        *markReaded({ payload, callback }, { call, put, select }) {
            const { ids, showMsg } = payload;
            const { dataSource, unreadCount, listParams }: NotificationState = yield select(state => state.notification);
            const _dataSource = dataSource.map(({ ...notice }) => {
                if (_.includes(ids, notice.id)) {
                    notice.status = '00';
                }
                return notice;
            });
            let _unreadCount = unreadCount - ids.length;
            _unreadCount < 0 ? _unreadCount = 0 : _unreadCount;
            try {
                yield put({
                    type: 'save',
                    payload: { dataSource: _dataSource, unreadCount: _unreadCount }
                })
                yield call(setNoticesReadedApi, { ids }, showMsg);
                callback && callback();
                yield put({ type: 'getListData', payload: listParams })
            } catch (err) {
                console.warn(err)
            }
        },
        //移除消息
        *removeNotices({ payload, callback }, { call, put, select }) {
            const { ids } = payload;
            const { dataSource, listParams }: NotificationState = yield select(state => state.notification)
            let cloneDataSource = _.cloneDeep(dataSource);
            _.remove(cloneDataSource, item => { return _.includes(ids, item.id) });
            try {
                yield put({
                    type: 'save',
                    payload: { dataSource: cloneDataSource }
                })
                yield call(removeNoticesApi, { ids });
                callback && callback();
                yield put({ type: 'fetch' })
                yield put({ type: 'getListData', payload: listParams })
            } catch (err) {
                console.warn(err)
            }
        },
        //更新观察者状态
        *updateObserver({ payload }, { put, select }) {
            const { id, data } = payload;
            const { observers } = yield select(state => state.notification);
            if (observers[id]) {
                let cloneData = _.cloneDeep(observers);
                cloneData[id] = data;
                yield put({
                    type: 'save',
                    payload: { observers: cloneData }
                })
            } else {
                yield put({
                    type: 'save',
                    payload: { observers: { ...observers, [id]: data } }
                })
            }
        },
        //移除观察者
        *removeObserver({ payload }, { put, select }) {
            const { observers } = yield select(state => state.notification);
            let cloneData = _.cloneDeep(observers);
            delete cloneData[payload];
            yield put({
                type: 'save',
                payload: { observers: cloneData }
            })
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
} as Notification