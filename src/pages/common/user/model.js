import { notification } from 'antd';
import { getUserInfo } from '@/utils/user'
import { getImageById } from '@/utils/utils'
import emptyblock from '@/assets/images/emptyblock.png'
import { getCodeName } from '@/utils/codelist'
import { getOrganizationInfo } from '@/utils/organization'

export default {
  namespace: 'userpagemodel',

  state: {
    employee: {},
    organizationInfo: {},
  },

  effects: {

    *getEmployee({ payload }, { call, put, select }) {
      const { employeeId, userLoginName } = payload
      try {
        let employee = yield call(getUserInfo, employeeId, userLoginName);
        employee.orgInfo = getOrganizationInfo(employee.organizationId)
        employee.genderName = yield getCodeName('FW_USER_GENDER', employee.gender)
        employee.userTypeName = yield getCodeName('FW_USER_TYPE', employee.userType)
        // console.log('a',a)
        const avatarUrl = getImageById(employee.pictureId) || emptyblock;
        employee.avatarUrl = avatarUrl
        yield put({
          type: 'save',
          payload: { employee }
        });
      } catch (err) {
        console.warn(err);
      }
    }
  },
  reducers: {
    // 改变state状态
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
  },
};
