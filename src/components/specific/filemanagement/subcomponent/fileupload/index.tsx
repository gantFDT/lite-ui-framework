import React, { useState, useMemo, useCallback } from 'react'
import { Table } from 'gantd'
import { Modal, Button, Input, Upload, Icon, Tooltip, Popconfirm } from 'antd'
import { getUserIdentity, getFileUnit, CARD_BORDER_HEIGHT, TABLE_HEADER_HEIGHT, MODAL_HEADER_HEIGHT, MODAL_FOOTER_HEIGHT } from '@/utils/utils'
import { turnRightFileApi, removeFileApi, BaseFileProps, UPLOAD_URL, UPLOAD_DIR_URL } from '@/services/file'
import { SmartModal } from '@/components/specific'
import _ from 'lodash'
import { useFileSize } from '@/utils/hooks'
import columns from './schema'

interface FileUploadProps extends BaseFileProps {
  show: boolean, // 是否显示上传modal
  dispatch: Function, // reducer的dispatch方法
  pageFiles: any // 当前页的文件列表
  findFilesFunc: Function // 查询文件列表的方法
  isDir: boolean
  pathId: string //文件夹id
}

const data = {
  tempFile: true,
  recTypeId: 0,
  recId: 0,
  subRecTypeId: 0,
  subRecId: 0
}

const INIT_ITEM_STATE = {
  width: 960,
  height: 660
}

/**
 * 文件上传
 * @param props
 */
export default function FileUpload(props: FileUploadProps) {
  const {
    show,
    dispatch,
    pageFiles,
    findFilesFunc,
    recTypeId,
    recId,
    subRecTypeId,
    subRecId,
    isDir,
    pathId
  } = props

  if (!show) return null

  const [files, setFiles] = useState<any[]>([])
  const [saveFileLoading, setSaveFileLoading] = useState<boolean>(false)
  const [modalHeight, setModalHeight] = useState(0)
  // 上传大小限制
  const [UPLOAD_FILE_SIZE, BEYOND_THE_HINT] = useFileSize(tr('单个文件不能超过'))
  const uploadData = useMemo(() => {
    let extraData: any = {}
    if (isDir) {
      extraData.pathId = pathId || ''
    }
    return {
      ...data,
      ...extraData
    }
  }, [isDir, pathId])
  const tableHeight = useMemo(() => {
    return modalHeight - MODAL_HEADER_HEIGHT - 20 - CARD_BORDER_HEIGHT - TABLE_HEADER_HEIGHT - MODAL_FOOTER_HEIGHT
  }, [modalHeight])

  const closeMalImpl = useCallback(() => {
    dispatch({ payload: { showFileUploadModal: false } })
    findFilesFunc({})
    _.delay(() => {
      setFiles([])
    }, 1000)
  }, [findFilesFunc])

  const closeModal = useCallback(() => {
    let length = files.filter((item: any) => item.state && item.state.status === 'done').length
    if (length > 0) {
      Modal.confirm({
        title: tr('提示'),
        content: tr(`当前有${length}个文件已上传但未保存，是否关闭？`),
        okText: tr('是'),
        okType: 'danger',
        cancelText: tr('否'),
        centered: true,
        okButtonProps: { size: 'small' },
        cancelButtonProps: { size: 'small' },
        onOk: closeMalImpl,
        onCancel: () => { }
      })
    } else {
      closeMalImpl()
    }
  }, [files, closeMalImpl])

  const headers = useMemo(getUserIdentity, [])

  const onFileChange = useCallback((res: any) => {
    let newFiles = _.cloneDeep(files)
    const { file } = res
    const { uid, name, size, percent, response, status } = file
    let currentIndex = newFiles.findIndex((item: any) => item.uid === uid)
    let currentFile = newFiles[currentIndex] || {}
    if (currentFile.state && currentFile.state.status === 'error') {
      return
    }
    let errorMsg = ''
    let currentPercent = Math.round(percent)
    let currentStatus = status
    if (response && response.state !== 'success') {
      currentStatus = 'error'
      currentPercent = 100
      errorMsg = response.message
    }
    if (size > UPLOAD_FILE_SIZE) {
      currentStatus = 'error'
      currentPercent = 100
      errorMsg = BEYOND_THE_HINT
    }
    if (!_.isEmpty(currentFile)) {
      currentFile = {
        ...currentFile,
        state: {
          percent: currentPercent,
          status: currentStatus,
          errorMsg
        },
        responseId: response && response.data ? response.data[0].id : undefined
      }
      newFiles[currentIndex] = currentFile
      setFiles([...newFiles])
    } else {
      currentFile = {
        uid,
        name,
        size: getFileUnit(size),
        state: {
          percent: currentPercent,
          status: currentStatus,
          errorMsg
        }
      }
      newFiles.push(currentFile)
      setFiles([...newFiles])
    }
  }, [files, UPLOAD_FILE_SIZE, BEYOND_THE_HINT])

  const fileTurnRightImpl = useCallback(async (toSaveFiles: any[], deleteIds?: string[]) => {
    // 记录保存的responseId
    let responseIds: any[] = []
    setSaveFileLoading(true)
    if (deleteIds) {
      try {
        await removeFileApi(deleteIds, false)
      } catch (error) {

      }
    }
    let requests = toSaveFiles.map((item: any) => {
      const { responseId, description } = item
      responseIds.push(responseId)
      return turnRightFileApi({
        description: description,
        id: responseId,
        recId,
        recTypeId,
        subRecId,
        subRecTypeId
      })
    })
    try {
      let promiseAll = await Promise.all(requests)
      let newFiles = JSON.parse(JSON.stringify(files))
      promiseAll.forEach((item: any, index: number) => {
        let fileIndex = newFiles.findIndex((item: any) => item.responseId === responseIds[index])
        let file = newFiles[fileIndex]
        if (item === 'OK') {
          file.state = {
            isTurnRight: true,
            status: true
          }
        } else {
          file.state = {
            isTurnRight: true,
            status: false
          }
        }
      })
      setFiles(newFiles)
    } catch (err) {
      console.error(err)
    }
    setSaveFileLoading(false)
  }, [recId, recTypeId, subRecId, subRecTypeId, files])

  const fileTurnRight = useCallback(async () => {
    // 判断是否有名称重复的
    // 获取当前已上传成功，且没有保存的文件列表
    let toSaveFiles = files.filter((item: any) => !!item.responseId && item.state.status === 'done')
    let toSaveFilesNames = toSaveFiles.map((item: any) => item.name)
    // 查找当前
    let sameNameFilesIds = pageFiles.filter((item: any) => toSaveFilesNames.includes(item.name)).map((item: any) => item.id)
    if (sameNameFilesIds.length === -1) {
      Modal.confirm({
        title: tr(`页面上已存在${sameNameFilesIds.length}个文件与待保存文件同名，是否覆盖？`),
        content: tr('注意：文件同名可能不是同一个文件，覆盖后原有文件将被删除'),
        okText: tr('是'),
        okType: 'danger',
        cancelText: tr('否'),
        centered: true,
        okButtonProps: { size: 'small' },
        cancelButtonProps: { size: 'small' },
        onOk: () => {
          fileTurnRightImpl(toSaveFiles, sameNameFilesIds)
        },
        onCancel: () => {
          fileTurnRightImpl(toSaveFiles)
        }
      })
    } else {
      fileTurnRightImpl(toSaveFiles)
    }
  }, [files, fileTurnRightImpl, pageFiles])

  const onInputChange = useCallback((value: string, uid: string) => {
    let newFiles = JSON.parse(JSON.stringify(files))
    let file = newFiles.find((item: any) => item.uid === uid)
    if (file) {
      file.description = value
      setFiles(newFiles)
    }
  }, [files])

  const saveFileAble = useMemo(() => {
    return files.some((item: any) => item.state && item.state.status === 'done')
  }, [files])

  const onFileDelete = useCallback((index: number) => {
    let newFiles = JSON.parse(JSON.stringify(files))
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }, [files])

  const showColumns = useMemo(() => {
    let tempColumns = columns.map((item: any) => {
      const { dataIndex } = item
      if (dataIndex === 'description') {
        item.render = (description: string, recode: any) => {
          const { state } = recode
          return (
            <Input
              value={description}
              readOnly={state.status !== 'done'}
              onChange={(e) => onInputChange(e.target.value, recode.uid)}
            />
          )
        }
      } else if (dataIndex === 'operate') {
        item.render = (operate: any, recode: any, index: number) => {
          const { state } = recode
          let res = state && state.status === 'done'
            ? <Popconfirm
              title={tr('当前文档已上传但还未保存，确认删除？')}
              placement="topRight"
              onConfirm={() => onFileDelete(index)}
            >
              <Tooltip title={tr('删除')}>
                <Icon type='delete' />
              </Tooltip>
            </Popconfirm>
            : <Tooltip title={tr('删除')}>
              <Icon type='delete' onClick={() => onFileDelete(index)} />
            </Tooltip>
          return <div className='aligncenter'>{res}</div>
        }
      }
      return item
    })
    return tempColumns
  }, [files])

  const onModalSizeChange = useCallback((width: number, height: number) => {
    setModalHeight(height)
  }, [])

  return (
    <SmartModal
      id='fileManageMentUploader'
      itemState={INIT_ITEM_STATE}
      title={tr('添加文档')}
      visible={show}
      onCancel={closeModal}
      footer={[
        <Button size="small" key='close' onClick={closeModal}>{tr('关闭')}</Button>,
        <Button size="small"
          key='save'
          type='primary'
          disabled={!saveFileAble}
          loading={saveFileLoading}
          onClick={fileTurnRight}>{tr('保存文档')}</Button>,
        <Upload
          key='add'
          style={{ marginLeft: '8px' }}
          showUploadList={false}
          multiple
          action={isDir ? UPLOAD_DIR_URL : UPLOAD_URL}
          data={uploadData}
          headers={headers}
          onChange={onFileChange}
        >
          <Button size="small" type='primary' >{tr('添加文档')}</Button>
        </Upload>
      ]}
      onSizeChange={onModalSizeChange}
    >
      <Table
        tableKey='fileManagementFileUpload'
        dataSource={files}
        columns={showColumns}
        pagination={false}
        scroll={{ y: tableHeight }}
        resizeCeil
      />
    </SmartModal>
  )
}
