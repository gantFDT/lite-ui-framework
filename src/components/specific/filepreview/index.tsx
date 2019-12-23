import React, { useRef, useReducer, useCallback, useState } from 'react'
import { debounce } from 'lodash'
import { Icon, message } from 'antd'
import { getFilePreviewInfoApi, previewFileApi, TEXT_FILES, IMAGE_FILES } from '@/services/file'
import TransformFilePreview from './TransformFilePreview'
import DirectFilePreview from './DirectFilePreview'
const INIT_SATTE = {
  currentPreviewFile: {// 预览文件
    id: '', // 预览文件id
    name: '', // 文件名称
    text: '', // 预览文本文件的内容
    imageUrl: '', // 预览图片文件的地址
    content:''
  },
  dirVisible:false,
  showPreviewModal:false
}

const updateState = (state: any, action: any) => {
  const { payload } = action
  return {
    ...state,
    ...payload
  }
}

interface FilePreviewProps {
  [propName: string]: any
}

function FilePreview(props: FilePreviewProps) {

  const {
    icon = 'eye',//默认图标为eye
    noIcon = false,//默认采用图标显示 ,如果不用图标设置为 true，且传入showText文本
    showText = '',
    directShow = false, //是否是直接传的content来直接显示，默认为false
    file = {}
  } = props

  const [state, dispatch] = useReducer(updateState, INIT_SATTE)
  const { currentPreviewFile ,dirVisible , content } = state
  const zmageRef = useRef(null)

  //文件预览
  const FilePreview = useCallback(() => {
    directShow ? directFilePreview(file) : transformFilePreview(file)
  }, [directShow, file])

  // 通过id转换以后预览文件
  const transformFilePreview = debounce(async (file: any) => {
    const currentZmage = zmageRef.current.coverRef.current
    // 当前预览文件和上次是同一个
    if (currentPreviewFile.id === file.id && currentPreviewFile.text) {
      return dispatch({ payload: { showPreviewModal: true } })
    }
    if (currentPreviewFile.id === file.id && currentPreviewFile.imageUrl) {
      return currentZmage.click()
    }
    try {
      message.loading(tr('正在生成预览文件，请等待...'))
      let previewInfo = await getFilePreviewInfoApi(file.id)
      let { previewId, mimeType } = previewInfo
      let previewFile = await previewFileApi(previewId, mimeType)
      if (TEXT_FILES.some((item: string) => mimeType.indexOf(item) !== -1)) {
        dispatch({ payload: { currentPreviewFile: { id: file.id, text: previewFile, name: file.name }, showPreviewModal: true } })
      } else if (IMAGE_FILES.some((item: string) => mimeType.indexOf(item) !== -1)) {
        dispatch({ payload: { currentPreviewFile: { id: file.id, imageUrl: previewFile, name: file.name } } })
        try {
          currentZmage.click()
        } catch (error) {
          message.error(tr('图片预览失败'))
          console.error(error)
        }
      }
    } catch (error) {
    }
    message.destroy()
  }, 300)

  //将转过来的content直接解析预览
  const directFilePreview = useCallback((file: any) => {

    const { content , name } = file
    dispatch({ payload: { currentPreviewFile: { content, name }, dirVisible: true } })

  }, [file,dirVisible])

  return (
    <>
      {noIcon ? <span style={{ color: '#1890FF', padding: '0 10px' }} onClick={FilePreview}>{showText}</span>:<Icon style={{ color: '#1890FF', padding: '0 10px' }} type={icon} onClick={FilePreview} />}
      <TransformFilePreview
        state={state}
        zmageRef={zmageRef}
        dispatch={dispatch}
      />
      <DirectFilePreview
        state={state}
        dispatch={dispatch}
      />
    </>
  )
}

export default FilePreview