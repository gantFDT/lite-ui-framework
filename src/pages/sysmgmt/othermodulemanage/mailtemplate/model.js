import {
  findMailTemplateAPI,
  sendMailAPI,
  publishMailTemplateAPI,
  modifierMailTemplateAPI,
  removeMailTemplateAPI
} from './service'
import { notification } from 'antd';

const formatParams = ({page = 1,pageSize = 20,...restParams} = {}) => ({
  pageInfo:{
    pageSize,
    beginIndex: (page - 1) * pageSize
  },
  ...restParams
})

export default {
  namespace : 'mailtemplate',
  state:{
    mailParams:formatParams(),
    mailTemplateList:[],
    mailListTotal:0,
    selectedRowKeys:[],
    selectedRows:[],
    modalType:'create',
    visible:false,
    visibleTeat:false
  },
  effects:{
    *getMailTemplate({ payload } , { call , put , select }){
      const { mailParams } = yield select( state => state.mailtemplate)
      const newParams = Object.assign({}, mailParams, formatParams(payload));

      yield put({
        type:'save',
        payload:{
          selectedRowKeys:[],
          selectedRows:[],
        }
      })

      const ret = yield call(findMailTemplateAPI , { data : newParams })
     
      yield put({
        type:'save',
        payload:{
          mailTemplateList: ret || [],
        }
      })
    },
    *sendMail({ payload } , { call , put , select }){
      const ret = yield call(sendMailAPI , { data : payload })
      notification.success({message: tr('测试邮件模版发布成功')});
      yield put({ type:'getMailTemplate' })
    },
    *publishMailTemplate({ payload } , { call , put , select }){

      const { imageIds,content } = payload

      let reg = /(\/mailTemplate\/imgDownload\?id=)(\S+)"/mg
      let idRes = undefined
      while (idRes = reg.exec(content)) {
        imageIds.push({ id: idRes[2] })
      }
      const ret = yield call(publishMailTemplateAPI , { data : payload })
      notification.success({message: tr('发布邮件模版成功')});
      yield put({ type:'getMailTemplate' })
    },
    *modifierMailTemplate({ payload } , { call , put , select }){
      const { imageIds,content } = payload
      let reg = /(\/mailTemplate\/imgDownload\?id=)(\S+)"/mg
      let idRes = undefined
      while (idRes = reg.exec(content)) {
        imageIds.push({ id: idRes[2] })
      }
      const ret = yield call(modifierMailTemplateAPI , { data : payload })
      notification.success({message: tr('更新邮件模版成功')});
      yield put({ type:'getMailTemplate' })
    },
    *removeMailTemplate({ payload } , { call , put , select }){
      const { selectedRowKeys: [id] } = yield select(state => state.mailtemplate);
      const ret = yield call(removeMailTemplateAPI , { data : {id} })
      notification.success({message: tr('删除邮件模版成功')});
      yield put({ type:'getMailTemplate' })
    }
  },
  reducers:{
    save(state , { payload } ){
      return{
        ...state,
        ...payload
      }
    }
  }
}




