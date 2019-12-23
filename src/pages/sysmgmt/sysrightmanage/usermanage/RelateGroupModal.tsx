import React, { useCallback, useMemo } from 'react'
import RelateModal from './relateModal'
import { groupColumns } from './tableSchema'
import { listGroupAPI, addGroupsToUserAPI, removeGroupsFromUserAPI } from './service';
import { findIndex } from 'lodash'
interface Props {
  visible: boolean,
  userId: string,
  selectUser: any,
  onCancel: () => void,
  modifyModel: (action: any) => void,
  list: any[]
}
const searchSchema = {
  groupCategoryId: {
    title: tr("用户组类别"),
    componentType: "RelateGroupSelect"
  },
}
export default function RelateGroupModal(props: Props) {
  const { visible, userId, selectUser = {}, onCancel, modifyModel, list } = props;
  const { userLoginName, userName, id, groupCount } = selectUser;
  const query = useCallback((data) => {
    return listGroupAPI({ data })
  }, []);
  const modifyUserList = useCallback((count) => {
    const index: number = findIndex(list, { id: selectUser.id })
    modifyModel({
      list: [...list.slice(0, index), {
        ...selectUser,
        groupCount: count
      }, ...list.slice(index + 1)]
    })
  }, [modifyModel, list, selectUser])
  const relate = useCallback((groups) => {
    modifyUserList(groups.length + groupCount)
    return addGroupsToUserAPI({ data: { groups, userId: id } })
  }, [id, groupCount, modifyUserList]);
  const removeRelate = useCallback((groups) => {
    modifyUserList(groupCount - groups.length)
    return removeGroupsFromUserAPI({ data: { groups, userId: id } })
  }, [id, groupCount, modifyUserList]);
  const initUnRelateParams = useMemo(() => {
    if (id) return {
      excludeUserId: id,
      filterModel: true
    }
    return null
  }, [id])
  const initRelateParams = useMemo(() => {
    if (id) return {
      userId: id
    }
    return null
  }, [id])
  return (<RelateModal
    userInfo={userLoginName + "-" + userName}
    title={tr("用户组")}
    visible={visible}
    transKey={`userRelateRoleModal:${userId}`}
    rowKey="id"
    columns={groupColumns}
    schema={searchSchema}
    initRelateParams={initRelateParams}
    initUnRelateParams={initUnRelateParams}
    onCancel={onCancel}
    query={query}
    relate={relate}
    removeRelate={removeRelate}
    uiSchema={{
      "ui:col": 24
    }}
  />)
}