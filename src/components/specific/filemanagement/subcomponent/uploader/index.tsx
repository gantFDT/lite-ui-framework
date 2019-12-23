import React, { useState, useEffect, useMemo } from 'react'
import { Popover } from 'antd'
import { ProfileCard } from 'gantd'
import { getImageById } from '@/utils/utils'
import { getUserInfo } from '@/utils/user'
import { Link } from 'dva/router'

interface UploaderProps {
  id: string
}

/**
 * 上传者信息组件
 * @param props 
 */
export default function Uploader(props: UploaderProps) {
  const { id } = props
  const [userInfo, setUserInfo] = useState<any>({})

  const getUserInfoImpl = async () => {
    let tempUserInfo = await getUserInfo(id)
    tempUserInfo.avatarUrl = getImageById(tempUserInfo.pictureId || 'undefined')
    setUserInfo(tempUserInfo)
  }

  useEffect(() => {
    getUserInfoImpl()
  }, [id])

  let showFileds = useMemo(() => USER_FIELDS.map((item: any) => {
    let options = { initialValue: '' }
    options.initialValue = userInfo[item.key]
    return { ...item, options }
  }), [userInfo])

  return (
    <Popover
      overlayStyle={{ width: '450px' }}
      content={
        <ProfileCard
          data={userInfo}
          fields={showFileds}
          backgroundImage={false}
          avatarAlign='left'
          layout={{
            labelCol: {
              xs: { span: 8 },
              sm: { span: 8 },
            },
            wrapperCol: {
              xs: { span: 16 },
              sm: { span: 16 },
            },
          }}
        />
      }>
      <Link to={`/common/user/${id}`}>{userInfo.userName}</Link>
    </Popover>
  )
}

const USER_FIELDS = [
  { label: tr('姓名'), key: 'userName' },
  { label: tr('性别'), key: 'gender' },
  { label: tr('用户类型'), key: 'userType' },
  { label: tr('所属组织'), key: 'fullOrgName' },
  { label: tr('工号'), key: 'staffNumber' },
  { label: tr('移动电话'), key: 'mobil' },
  { label: tr('固定电话'), key: 'telephone' },
  { label: tr('传真'), key: 'fax' },
  { label: tr('邮箱'), key: 'email' },
  { label: tr('职务说明'), key: 'position' }
]
