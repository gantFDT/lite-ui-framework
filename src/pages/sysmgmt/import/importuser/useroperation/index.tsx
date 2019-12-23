
import React, { useState, useMemo, useCallback, Dispatch } from 'react'
import { connect } from 'dva'
import { Button, Icon, Upload, message } from 'antd'
import { Input } from 'gantd'
import styles from './index.less'
import { RcFile } from 'antd/lib/upload';
import { tr } from '@/components/common'
import { getUserIdentity } from '@/utils/utils'

const MAX_SIZE = 2 ** 21 // 2M

const data = {
  tempFile: true,
  recTypeId: 0,
  recId: 0,
  subRecTypeId: 0,
  subRecId: 0,
}
const action = '/api/file/upload'

const extraHeader = getUserIdentity()


function UserOperstion(props: any) {
  const {
    submitUploadFile,
  } = props;

  const [disabled, setDisabled] = useState(true)

  const downloadfile = useCallback(() => {
    const url = '/api/importSecurityData/getUserImportTemplate'
    const { userToken, userLoginName, userLanguage } = getUserIdentity();
    location.href = `${url}?userLanguage=${userLanguage}&userLoginName=${userLoginName}&userToken=${encodeURIComponent(userToken)}`
  }, [])


  const [name, setname] = useState() // 文件上传名字
  const [size, setsize] = useState() // 文件上传名字
  const [files, setfiles] = useState([])

  const beforeUpload = useCallback((file: RcFile, fileList: Array<RcFile>) => {
    const { name: n, size } = file
    if (size > MAX_SIZE) { // 超过2M
      message.warning(tr('上传的文件大小不得超过') + MAX_SIZE / (2 ** 20) + "MB")
      return false
    }
    setname(n)
    setsize(size)
    return true
  }, [])

  const onFileChange = useCallback(({ file, fileList, event }) => {
    if (file.status === 'done' && file.response.state === 'success') { // 上传成功
      message.success(tr('上传成功'))
      const newFiles = [...file.response.data]
      setfiles([...newFiles])
      setDisabled(false)
    }
  }, [])

  const onSubmit = useCallback(() => {
    const { id } = files[0]
    submitUploadFile({ id })
  }, [files])




  return (
    <div className={styles.useroperstion}>
      <div>
        <Button size="small"
          type="primary"
          style={{ marginRight: 20 }}
          onClick={downloadfile}
        >
          <Icon type='download'></Icon>
          {tr('下载账号导入模版')}
        </Button>
        <Upload
          showUploadList={false}
          action={action}
          beforeUpload={beforeUpload}
          name={name}
          data={data}
          headers={extraHeader}
          onChange={onFileChange}
        >
          <Button size="small"
            type="primary"
            style={{ marginRight: 20 }}
          >
            <Icon type='upload' />{tr('上传导入文件')}
          </Button>
        </Upload>
        <Button size="small"
          type="primary"
          disabled={disabled}
          onClick={onSubmit}
        >
          <Icon type='import' />{tr('导入账号数据')}
        </Button>
      </div>
      <div className={styles['useroperstion-input']}>
        <label>{tr('文件名称')}</label>
        <Input allowEdit={false} value={name} />
        <label>{tr('文件大小')}</label>
        <Input allowEdit={false} value={size} />
      </div>
    </div>
  )
}

export default connect(({ settings }: any) => ({

}), (dispatch: Dispatch<any>) => ({
  submitUploadFile: (payload: any) => dispatch({ type: 'importuser/submitFile', payload }),
})
)(UserOperstion)
