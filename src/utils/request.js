/* eslint-disable compat/compat */
/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import React from 'react'
import { extend } from 'umi-request';
import { notification, Modal, message, Typography } from 'antd';
import { promised } from 'q';
import event from './events'
import { tr } from '@/components/common/formatmessage'
import { getUserIdentity, delCookie,TokenBucket } from '@/utils/utils'


const { Paragraph } = Typography
const codeMessage = {
  200: tr('服务器成功返回请求的数据。'),
  201: tr('新建或修改数据成功。'),
  202: tr('一个请求已经进入后台排队（异步任务）。'),
  204: tr('删除数据成功。'),
  400: tr('发出的请求有错误，服务器没有进行新建或修改数据的操作。'),
  401: tr('用户没有权限（令牌、用户名、密码错误）。'),
  403: tr('用户得到授权，但是访问是被禁止的。'),
  404: tr('发出的请求针对的是不存在的记录，服务器没有进行操作。'),
  406: tr('请求的格式不可得。'),
  410: tr('请求的资源被永久删除，且不会再得到的。'),
  422: tr('当创建一个对象时，发生一个验证错误。'),
  500: tr('服务器发生错误，请检查服务器。'),
  502: tr('网关错误。'),
  503: tr('服务不可用，服务器暂时过载或维护。'),
  504: tr('网关超时。'),
};

export const sucMessage = {
  createMes: tr('创建成功'),
  removeMes: tr('删除成功'),
  modifyMes: tr('修改成功'),
  operateMes: tr('操作成功'),
  sortMes: tr('排序成功'),
  saveMes: tr('保存成功'),
  deployMes: tr('发布成功')
}

export const getSucMessage = (type, custom) => {
  return custom || sucMessage[`${type}Mes`]
}
/**
 * 异常处理程序
 */
const TraceIdKey = 'X-CommonInfo-TraceId'
const StateKey = 'X-Process-Result'
const errorHandler = (error) => {
  const { response } = error
  const TraceId = response.headers.get(TraceIdKey)
  // 其他错误
  // const errortext = codeMessage[status] || response.statusText;
  Modal.error({
    title: tr('系统错误'),
    content: (
      <div style={{ marginTop: '10px' }}>
        <div>{tr('请将错误跟踪号')}{tr('提交给系统管理员以便进一步分析')}</div>
        <div><Paragraph copyable>{TraceId}</Paragraph></div>
        <div>{tr('错误信息：')}<span>{tr('未知异常')}</span></div>
      </div>
    ),
    bodyStyle: {
      margin: 10
    },
    maskClosable: true,
    okText: tr("知道了"),
    okButtonProps: {
      size: 'small'
    },
    onOk: (cb) => {
      cb()
    }
  })

  // eslint-disable-next-line compat/compat
  return Promise.reject(error)
};
/**
 * 配置request请求时的默认参数
 */

// const prefix = process.env.NODE_ENV === "development" ? '/api' : ''
const prefix = '/api'

const extendRequest = extend({
  errorHandler,
  prefix,
  getResponse: true,
  // suffix: ".api", // 统一使用api后缀
  // credentials: 'include', // 默认请求是否带上cookie
});

let extraHeader = getUserIdentity()

event.on('setExtraHeader', (header) => { // 由login模块带入, 更新extraHeader
  extraHeader = header
})
// // 请求拦截, 验证登陆状态
extendRequest.interceptors.request.use(function requestInterceptor(url, options) {

  const newOption = { ...options }
  // eslint-disable-next-line compat/compat
  newOption.headers = Object.assign({}, options.headers, extraHeader)
  return {
    url,
    options: newOption
  }
})

//请求前置令牌桶
const RequestTokenBucket = new TokenBucket(50,50,1000)
RequestTokenBucket.start()
export default function request(url, options, { showSuccess = false, successMessage, showWraning = true, isStream = false } = {}) {
  RequestTokenBucket.use()
  return extendRequest(url, options).then(({ data: serveData, response }) => {
    const { state, message: msg, warnDescription, errorDescription } = serveData
    const TraceId = response.headers.get(TraceIdKey)
    if (state === 'success') { // 后台返回成功
      if (showSuccess) {
        notification.success({
          message: successMessage || msg || tr("操作成功")
        })
      }
    }
    // // 警告
    if (state === 'warn' && showWraning) {
      notification.warning({
        message: warnDescription || msg,
        description: (
          <>
            {tr('错误跟踪号')}:<Paragraph copyable>{TraceId}</Paragraph>
          </>
        )
      })
    }
    if (state === 'error') {
      notification.error({
        duration: 10,
        message: (
          <div>
            <div>{tr('信息')}: {serveData.message}</div>
            <div>{tr('详细描述')}: {errorDescription}</div>
            <div>{tr('错误跟踪号')}: <Paragraph copyable>{TraceId}</Paragraph></div>
          </div>
        )
      })
      if (msg.match(tr('无访问权限'))) {
        delCookie('userIdentity')
        window.location.href = '/login'
      }
      return Promise.reject(msg)
    }
    if (state === 'sys-error') {
      Modal.error({
        title: tr('系统错误'),
        content: (
          <div style={{ marginTop: '10px' }}>
            <div>{tr('请将错误跟踪号')}{tr('提交给系统管理员以便进一步分析')}</div>
            <div><Paragraph copyable>{TraceId}</Paragraph></div>
            <div>{tr('错误信息：')}<span>{msg}</span></div>
          </div>
        ),
        bodyStyle: {
          margin: 10
        },
        maskClosable: true,
        okText: tr("知道了"),
        okButtonProps: {
          size: 'small'
        },
        onOk: (cb) => {
          cb()
        }
      })
      return Promise.reject(msg)
    }

    return isStream ? response : serveData.data
  })
}

;['post', 'get', 'put', 'delete'].forEach(method => { request[method] = function namedRequest(url, options, ...behaver) { return request(url, { ...options, method }, ...behaver) } })
