import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { Button, Upload, Tooltip, message } from 'antd'
import { TooltipProps } from 'antd/lib/tooltip'
import { ButtonProps } from 'antd/lib/button'
import { UPLOAD_URL, File } from '@/services/file'
import { getUserIdentity, getFileUnit } from '@/utils/utils'
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface'
import { useFileSize } from '@/utils/hooks'
import { ProgressModal } from '@/components/common'
import styles from './index.less'

interface FileUploadProps {
  tooltip?: string // 按钮tooltip文字
  btnText?: string // 上传按钮文字
  extraTooltipProps?: TooltipProps // 额外的tooltip配置
  extraBtnProps?: ButtonProps // 额外的按钮配置
  uploadUrl?: string // 上传地址
  tempFile?: boolean // 是否为临时文件
  recTypeId?: number, // 关联业务类型id
  recId?: number, // 关联业务对象id
  subRecTypeId?: number, // 关联子业务类型id
  subRecId?: number // 关联子业务对象id
  onSuccess?: (file: File) => void // 上传文件成功后的回调
  type?: 'circle' | 'line'
}

// 文件上传状态与process组件状态的关系映射
const UPLOAD_PROGRESS_STATUS_MAP = {
  uploading: 'active',
  done: 'success',
  error: 'exception'
}

const INIT_ANY_OBJECT: any = {}

/**
 * 文件上传组件
 * @param props
 */
export default function FileUpload(props: FileUploadProps) {
  const {
    tooltip,
    btnText,
    uploadUrl = UPLOAD_URL,
    onSuccess,
    extraTooltipProps = INIT_ANY_OBJECT,
    extraBtnProps = INIT_ANY_OBJECT,
    tempFile = false,
    recTypeId = 0,
    recId = 0,
    subRecTypeId = 0,
    subRecId = 0,
    type = 'circle'
  } = props
  const [file, setFile] = useState<UploadFile>({} as UploadFile)
  const [loading, setLoading] = useState(false)
  const headers = useMemo(getUserIdentity, [])
  // 上传大小限制
  const [UPLOAD_FILE_SIZE, BEYOND_THE_HINT] = useFileSize()

  const data = useMemo(() => {
    return {
      tempFile,
      recTypeId,
      recId,
      subRecTypeId,
      subRecId
    }
  }, [tempFile, recTypeId, recId, subRecTypeId, subRecId])

  const onFileChange = useCallback(({ file }: UploadChangeParam) => {
    const { size } = file
    if (UPLOAD_FILE_SIZE < size) {
      setLoading(false)
    } else {
      setFile(file)
    }
  }, [UPLOAD_FILE_SIZE, BEYOND_THE_HINT, file])

  const beforeUpload = useCallback((file: any) => {
    const { size } = file
    if (UPLOAD_FILE_SIZE < size) {
      message.warning(BEYOND_THE_HINT)
      setFile({} as any)
      return false
    }
    setLoading(true)
    return true
  }, [UPLOAD_FILE_SIZE, BEYOND_THE_HINT])

  const resetFile = useCallback(() => {
    setFile({} as UploadFile)
  }, [])

  useEffect(() => {
    if (file.status === 'done') {
      const { response: { data } } = file
      onSuccess && onSuccess(data[0])
      setTimeout(resetFile, 1000)
    }
    if (['done', 'error'].includes(file.status as string)) {
      setLoading(false)
    }
  }, [file])

  return (
    <>
      <Upload
        action={uploadUrl}
        multiple={false}
        showUploadList={false}
        headers={headers}
        data={data}
        onChange={onFileChange}
        className={styles.FileUpload}
        beforeUpload={beforeUpload}
      >
        <Tooltip title={tooltip} {...extraTooltipProps}>
          <Button
            size="small"
            {...extraBtnProps}
            loading={loading}
          >{btnText}</Button>
        </Tooltip>
      </Upload>
      <ProgressModal
        width={300}
        type={type}
        visible={!!file.uid}
        closable={file.status === 'error'}
        maskClosable={file.status === 'error'}
        percent={Math.ceil(file.percent as number)}
        status={UPLOAD_PROGRESS_STATUS_MAP[file.status as string]}
        onClose={resetFile}
        bottomContent={(
          <div className={styles.descripition}>
            {{
              uploading: (
                <p>{tr('总大小：')}<b>{getFileUnit(file.size)}</b>&nbsp;&nbsp;&nbsp;{tr('已上传：')}<b>{getFileUnit(file.size * (file.percent as number) / 100)}</b></p>
              ),
              success: <h2>{tr('上传成功')}</h2>,
              done: <h2>{tr('上传成功')}</h2>,
              error: <h2>{tr('上传失败')}</h2>
            }[file.status as string]}
          </div>
        )}
      />
    </>
  )
}
