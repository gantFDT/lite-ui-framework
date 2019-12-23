import { submitFileAPI } from '../service';
import { message } from 'antd';

const namespace = 'importuser'

export default {
  namespace,
  state:{

  },
  effects:{
    *submitFile({ payload } , { call , put }){
      const { id } = payload;
      const ret = yield call(submitFileAPI , {data:{id:id}})
      if (ret.resultFileId) {
        message.success(tr(`账号数据总数：${ret.total}条，导入成功：${ret.success}条，导入失败：${ret.failure}条`))
      }
    },
  },
  reducers:{
    save(state , { payload }){
      return {
        ...state,
        ...payload
      }
    }
  }
}






