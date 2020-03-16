import React from 'react';
import { Link, router } from 'umi'
import { ProfileCard } from 'gantd'
import { getUserInfo } from '@/utils/user'
import { Avatar } from 'antd'
import classnames from 'classnames'
import styles from './styles.less';
;

export interface UserColumnProps {
  id?: string | number,
  userLoginName?: string,
  tigger?: string,
  overlayClassName?: string,
  showContactBtns?: boolean
}

const profileCardFields: Array<any> = [
  {
    label: tr('姓名'),
    dataIndex: "userName",
    key: "userName",
  },
  {
    label: tr('组织'),
    dataIndex: "orgName",
    key: "orgName",
  },
  {
    label: tr('邮箱'),
    dataIndex: "email",
    key: "email",
  },
  {
    label: tr('电话'),
    dataIndex: "mobil",
    key: "mobil",
  },
]

const UserColumn = (props: UserColumnProps) => {
  let { id = '', userLoginName, tigger, overlayClassName, showContactBtns } = props;
  const userInfo: any = getUserInfo(id, userLoginName);
  if (!userInfo) return null
  const { userName, avatarUrl } = userInfo;
  return <div style={{ display: 'inline-block' }} onClick={(e) => e.stopPropagation()} >
    <ProfileCard
      data={userInfo}
      overlayClassName={showContactBtns ? classnames(styles.userProfiedOverlay, overlayClassName) : overlayClassName}
      fields={profileCardFields}
      height={200}
      backgroundBlur={false}
      backgroundImage={false}
      avatarAlign="left"
      trigger={tigger}
      layout={{
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      }}
      placement="right"
      onAvatarClick={() => { router.push(`/common/user/${userInfo.id}`) }}
    >
      <a href="javascript:void(0)">
        <Avatar size={16} icon="user" src={avatarUrl} style={{ marginRight: '10px' }} />
        {userName}
      </a>
    </ProfileCard>
  </div>
}

UserColumn.defaultProps = {
  id: '',
  userLoginName: '',
  tigger: 'click',
  showContactBtns: true
}

export default UserColumn
