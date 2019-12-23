import React, { useEffect, Dispatch, useCallback, useState, useRef } from 'react'
import { Icon } from 'gantd'
import { GroupSelector, TableTransferModal } from '@/components/specific'
import { TableTransferInnerProps, Direction, Pageinfo } from '@/components/specific/tabletransfer'
import { tr } from '@/components/common/formatmessage'
import { connect } from 'dva'
import UserColumn from '@/components/specific/usercolumn';
import { getCodeNameSync, getCodeList } from '@/utils/codelist';
import { searchSchema } from './relatescheme'
import _ from 'lodash'

const INIT_PAGE_INFO = {
  pageSize: 50,
  beginIndex: 0,
  total: 0
}
const DEFAULT_COMMON = {
  extraSearchProps: {
    uiSchema: {
      'ui:col': 8
    }
  }
}
const DEFAULT_LEFT: TableTransferInnerProps = {
  ...DEFAULT_COMMON,
  title: tr('未关联员工'),
}
const DEFAULT_RIGHT: TableTransferInnerProps = {
  ...DEFAULT_COMMON,
  title: tr('已关联员工'),
}
function RelateModal(props: any) {
  const {
    groupuser,
    userId,
    group,

    listRelateUser,
    listUnRelateUser,
    addUsersToGroup,
    removeUsersFromGroup,
    save,
    listRelateUserLoading,
    listUnRelateUserLoading,
  } = props;
  const { selectedRowKeys: [groupSelectedId] } = group;
  const {
    modalVisible,
    relateUserList,
    relateUserListTotal,
    unRelateUserList,
    unRelateUserListTotal,
  } = groupuser;

  //用户类型
  const [userType, setUserType] = useState<any[]>([]);

  const [targetKeys, setTargetKeys] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);

  //分页
  const [leftPageInfo, setLeftPageInfo] = useState(INIT_PAGE_INFO)
  const leftPageInfoRef = useRef(INIT_PAGE_INFO)
  const [rightPageInfo, setRightPageInfo] = useState(INIT_PAGE_INFO)
  const rightPageInfoRef = useRef(INIT_PAGE_INFO)

  const fakeColumns = [{
    title: tr('登录名'),
    dataIndex: 'userLoginName',
    key: 'userLoginName',
  },
  {
    title: tr('姓名'),
    dataIndex: 'userName',
    key: 'userName',
    render: function (text: any, record: any) {
      const id = record.id;
      return <UserColumn id={id}></UserColumn>
    }
  },
  {
    title: tr('所属组织'),
    dataIndex: 'organizationId',
    key: 'organizationId',
    render: function (text: any, record: any) {
      return <GroupSelector value={text} allowEdit={false} />
    }
  },
  {
    title: tr('用户类型'),
    dataIndex: 'userType',
    key: 'userType',
    render: (text: any) => {
      if (!userType.length) return
      return getCodeNameSync(userType, text)
    },
  },
  {
    title: tr('是否有效'),
    dataIndex: 'isActive',
    key: 'isActive',
    render: (isActive: boolean) => isActive ? <span className="successColor"><Icon.Ant type="check-circle" /></span> : ""
  }]

  //用户类型获取
  useEffect(() => {
    async function fn() {
      let userTypeList = await getCodeList('FW_USER_TYPE');
      setUserType(userTypeList);
    }
    fn();
  }, [])

  //初始进入页面调用接口
  useEffect(() => {
    listUnRelateUser();
    listRelateUser()
  }, [groupSelectedId])

  //获取数据后进行数据处理
  useEffect(() => {
    const relateUserKeys = relateUserList.map((item: any) => item.id)
    setAllData([...unRelateUserList, ...relateUserList])
    setTargetKeys(relateUserKeys)
    getData('left', leftPageInfoRef.current)
    getData('right', rightPageInfoRef.current)
  }, [relateUserList, unRelateUserList])

  //关闭弹窗
  const closeModal = useCallback(() => save({ modalVisible: false }), [])

  //解除，绑定关联
  const onChangeTarget = useCallback((nowtargetKeys) => {
    setTargetKeys(nowtargetKeys)
    if (targetKeys.length > nowtargetKeys.length) {
      const unRelateArr = _.difference(targetKeys, nowtargetKeys)
      removeUsersFromGroup(unRelateArr)
    } else if (targetKeys.length < nowtargetKeys.length) {
      const unRelateArr = _.difference(nowtargetKeys, targetKeys)
      addUsersToGroup(unRelateArr)
    }
  }, [targetKeys, relateUserList, unRelateUserList])

  const onSearch = useCallback((direction, params, pageInfo) => {
    if (direction == 'left') {
      listUnRelateUser({
        pageInfo: { beginIndex: pageInfo.beginIndex, pageSize: pageInfo.pageSize },
        ...params
      }, getData(direction, pageInfo))
    } else {
      listRelateUser({
        pageInfo: { beginIndex: pageInfo.beginIndex, pageSize: pageInfo.pageSize },
        ...params
      }, getData(direction, pageInfo))
    }
  }, [])

  //数据变化时更新分页信息
  const getData = useCallback((type: Direction | string, pageInfo: Pageinfo) => {
    let setPageFunc = type === 'left' ? setLeftPageInfo : setRightPageInfo
    let pageRef = type === 'left' ? leftPageInfoRef : rightPageInfoRef
    let totalCurrent = type === 'left' ? unRelateUserListTotal : relateUserListTotal
    let newPageInfo = { ...pageInfo, total: totalCurrent }
    setPageFunc(newPageInfo)
    pageRef.current = newPageInfo
  }, [unRelateUserListTotal, relateUserListTotal])

  return (
    <TableTransferModal
      transKey={`RelateModal:${userId}`}
      title={tr('关联员工到用户组')}
      visible={modalVisible}
      left={{
        ...DEFAULT_LEFT,
        loading: listUnRelateUserLoading,
        pagination: {
          ...leftPageInfo
        }
      }}
      right={{
        ...DEFAULT_RIGHT,
        loading: listRelateUserLoading,
        pagination: {
          ...rightPageInfo
        }
      }}
      onOk={closeModal}
      onCancel={closeModal}
      extraModalProps={{
        footer: null,
        itemState: {
          width: 1200,
          height: 600
        }
      }}
      rowKey='id'
      schema={searchSchema}
      columns={fakeColumns}
      dataSource={allData}
      onSearch={onSearch}
      targetKeys={targetKeys}
      onChange={onChangeTarget}
    />
  )
}
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  const mapProps = { dispatch };
  ['listRelateUser', 'listUnRelateUser', 'addUsersToGroup', 'removeUsersFromGroup', 'save'].forEach(method => {
    mapProps[method] = (payload: object, callback: Function, final: Function) => {
      dispatch({
        type: `groupuser/${method}`,
        payload,
        callback,
        final
      })
    }
  })
  return mapProps
}
export default connect(
  ({ group, groupuser, loading, settings, user }: any) => ({
    currentUser: user.currentUser,
    group,
    groupuser,
    userId: user.currentUser.id,
    primaryColor: settings.MAIN_CONFIG.primaryColor,
    headerHeight: settings.MAIN_CONFIG.headerHeight,
    listRelateUserLoading: loading.effects['groupuser/listRelateUser'],
    listUnRelateUserLoading: loading.effects['groupuser/listUnRelateUser']
  }), mapDispatchToProps)(RelateModal);