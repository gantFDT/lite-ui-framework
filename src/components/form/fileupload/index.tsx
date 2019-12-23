import React, { useCallback, useState } from 'react'
import { Upload, Button, message } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { getUserIdentity } from '@/utils/utils'
import { useFileSize } from '@/utils/hooks'

const data = {
  tempFile: true,
  recTypeId: 0,
  recId: 0,
  subRecTypeId: 0,
  subRecId: 0,
}

const action = '/api/file/upload'
// const action = process.env.NODE_ENV === 'development' ? `/api${URL}` : URL

const extraHeader = getUserIdentity()

export interface File extends UploadFile {
  id?: number,
  virtureId: string,
}

export interface FileUploadProps {
  maxLength: number,
  value: Array<File>,
  onChange: (files: Array<File>) => void
}

const FileUpload = (props: FileUploadProps) => {

  const { onChange } = props

  const [name, setname] = useState() // 文件上传名字
  const [files, setfiles] = useState([] as Array<File>)
  // 上传大小限制
  const [UPLOAD_FILE_SIZE, BEYOND_THE_HINT] = useFileSize()

  const beforeUpload = useCallback(
    (file: RcFile, fileList: Array<RcFile>) => {
      const { name: n, size } = file
      if (size > UPLOAD_FILE_SIZE) {
        message.warning(BEYOND_THE_HINT)
        return false
      }
      setname(n)
      return true
    },
    [],
  )

  const onFileChange = useCallback(({ file, fileList, event }) => {
    // setfiles(file)
    if (file.status === 'done' && file.response.state === 'success') { // 上传成功
      message.success(tr('上传成功'))
      const newFiles = [...files, ...file.response.data]
      setfiles(newFiles)
      onChange(newFiles)
    }
  }, [files, UPLOAD_FILE_SIZE])

  return (
    <Upload
      action={action}
      beforeUpload={beforeUpload}
      name={name}
      data={data}
      headers={extraHeader}
      onChange={onFileChange}
    >
      <Button size="small" icon='upload'>{tr('上传附件')}</Button>
    </Upload>
  )
}

FileUpload.defaultProps = {
  onChange: () => { },
  value: []
}

export default FileUpload
