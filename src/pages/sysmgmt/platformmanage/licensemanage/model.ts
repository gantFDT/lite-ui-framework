import { Reducer } from 'redux'
import { Model } from 'dva'
import { deepCopy4JSON } from '@/utils/utils'
import _ from 'lodash'
import { getLicenseManagerInfoApi, analyseLicenseInfoApi, updateLicenseApi, updateNotificationUserApi } from './service'

export interface LicenseInfo {
  deadline: string
  notificationUser: string
  orgName: string
  productName: string
}

interface State {
  licenseInfo: LicenseInfo  // 当前许可证信息
  newLicenseInfo: LicenseInfo // 新增许可证信息
  showAddModel: boolean // 是否显示新增确认弹框
  fileId: string // 当前上传许可证的文件id
}

const INIT_STATE: State = {
  licenseInfo: {} as LicenseInfo,
  newLicenseInfo: {} as LicenseInfo,
  showAddModel: false,
  fileId: ''
}

interface ModelType extends Model {
  state: State,
  reducers: {
    updateState: Reducer<State>
  }
}

export default {
  namespace: 'licenseManage',
  state: {
    ...INIT_STATE
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    cancelAdd(state: State) {
      return {
        ...state,
        newLicenseInfo: {},
        showAddModel: false,
        fileId: ''
      }
    }
  },
  effects: {
    // 获取许可证信息
    *getLicenseManagerInfo(action, { put, call }) {
      let { licenseInfo } = deepCopy4JSON(INIT_STATE)
      try {
        let res = yield call(getLicenseManagerInfoApi)
        licenseInfo = res
      } catch (error) {
        console.log('getLicenseManagerInfo error\n', error)
      }
      yield put({
        type: 'updateState',
        payload: {
          licenseInfo
        }
      })
    },
    // 分析许可证信息
    *analyseLicenseInfo(action, { put, call }) {
      let { newLicenseInfo, showAddModel } = deepCopy4JSON(INIT_STATE)
      const { payload: { fileId } } = action
      try {
        newLicenseInfo = yield call(analyseLicenseInfoApi, fileId)
        showAddModel = true
      } catch (error) {
        console.log('analyseLicenseInfo error\n', error)
      }
      yield put({
        type: 'updateState',
        payload: {
          newLicenseInfo,
          showAddModel,
          fileId
        }
      })
    },
    // 更新许可证信息
    *updateLicense(action, { put, call, select }) {
      const { fileId } = yield select((store: any) => store.licenseManage)
      try {
        yield call(updateLicenseApi, fileId)
        yield put({ type: 'cancelAdd' })
        yield put({ type: 'getLicenseManagerInfo' })
      } catch (error) {
        console.log('updateLicense error\n', error)
      }
    },
    // 更改通知用户
    *updateNotificationUser(action, { put, call }) {
      const { payload: { userloginName = '' } } = action
      try {
        yield call(updateNotificationUserApi, userloginName)
        yield put({ type: 'getLicenseManagerInfo' })
      } catch (error) {
        console.log('updateNotificationUser error\n', error)
      }
    }
  }
} as ModelType
