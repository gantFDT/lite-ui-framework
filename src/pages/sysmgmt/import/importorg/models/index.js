import { submitFileAPI } from '../service';
import { message } from 'antd';

const namespace = 'importorg'

export default {
  namespace,
  state:{

  },
  effects:{
    *submitFile({ payload } , { call , put }){
      const { id } = payload;
      const ret = yield call(submitFileAPI , {data:{id:id}})
      if (ret.resultFileId) {
        message.success(tr(`组织数据总数：${ret.total}条，导入成功：${ret.success}条，导入失败：${ret.failure}条`))
      }else{
        console.log(ret)
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






