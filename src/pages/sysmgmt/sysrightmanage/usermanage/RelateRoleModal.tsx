import React, { useCallback, useMemo } from 'react'
import RelateModal from './relateModal'
import { relateRoleSchema } from './tableSchema'
import { listRoleAPI, addRolesToUserAPI, removeRolesFromUserAPI } from './service'
import { findIndex } from 'lodash'
interface Props {
  visible: boolean,
  userId: string,
  selectUser: any,
  onCancel: () => void,
  modifyModel: (action: any) => any,
  list: any[]
}
const searchSchema = {
  roleCode: {
    title: tr("角色代码")
  },
  roleName: {
    title: tr("角色名称")
  }
}
export default function RelateRoleModal(props: Props) {
  const { visible, userId, selectUser = {}, onCancel, modifyModel, list } = props;
  const { userLoginName, userName, id, roleCount } = selectUser;
  const query = useCallback((data) => {
    return listRoleAPI({ data })
  }, []);
  const modifyUserList = useCallback((count) => {
    const index: number = findIndex(list, { id: selectUser.id })
    modifyModel({
      list: [...list.slice(0, index), {
        ...selectUser,
        roleCount: count
      }, ...list.slice(index+1)]
    })

  }, [modifyModel, list, selectUser])
  const relate = useCallback((roles) => {
    modifyUserList(roles.length + roleCount)
    return addRolesToUserAPI({ data: { roles, userId: id } })
  }, [id, roleCount, modifyUserList]);
  const removeRelate = useCallback((roles) => {
    modifyUserList(roleCount - roles.length)
    return removeRolesFromUserAPI({ data: { roles, userId: id } })
  }, [id, roleCount, modifyUserList]);
  const initUnRelateParams = useMemo(() => {
    if (id) return {
      excludeUserId: id,
      filterModel: true
    }
    return null
  }, [id])
  const initRelateParams = useMemo(() => {
    if (id) return {
      filterModel: true,
      userId: id
    }
    return null
  }, [id])
  return (<RelateModal
    userInfo={userLoginName + "-" + userName}
    title={tr("角色")}
    visible={visible}
    transKey={`userRelateRoleModal:${userId}`}
    rowKey="id"
    columns={relateRoleSchema}
    schema={searchSchema}
    initRelateParams={initRelateParams}
    initUnRelateParams={initUnRelateParams}
    onCancel={onCancel}
    query={query}
    relate={relate}
    removeRelate={removeRelate}
  />)
}