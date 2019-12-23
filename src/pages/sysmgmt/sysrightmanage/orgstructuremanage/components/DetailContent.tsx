import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { Button, Tooltip, Modal } from 'antd';
import { BlockHeader, EditStatus } from 'gantd';
import { SmartTable, UserSelector } from '@/components/specific';
import { Title } from '@/components/common';
import { deepCopy4JSON } from '@/utils/utils';
import FormSchema from '@/components/form/schema';
import { listModalSchema as schema, smartTableUserSchema, detailContentUiSchema } from '../schema';
import UserFormModal from '@/pages/sysmgmt/sysrightmanage/usermanage/UserFormModal';
import { FormTypes } from '@/pages/sysmgmt/sysrightmanage/usermanage/index';
// import { Form } from '@/components/specific/searchform/subcomponents';
const { confirm } = Modal;
const { Modal: UserModal } = UserSelector;

export interface SelectedItemProps {
  id?: string,
  userName?: string,
  [propsname: string]: any
}

function DetailContent(props: any) {
  const {
    dataSource,
    totalCount,
    values,
    pageKey,
    userId,
    params,
    loading,
    modalLoading,
    relateLoading,
    mapPropsFn,
    organizationId,
    // MAIN_CONFIG,
    primaryColor,
  } = props;

  const { fetchUserList, createUser, updateUser, removeUser, relateUsers, resetUserlist } = mapPropsFn;
  const [modalType, setModalType] = useState(FormTypes.create);
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedItem, setItem] = useState<SelectedItemProps>({});
  const [visible, setVisible] = useState(false);
  const [userVisible, setUserVisible] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    organizationId ? query() : resetUserlist();
    resetSelectedState();
  }, [organizationId])

  const query = useCallback(() => {
    fetchUserList({ ...params, filterInfo: { organizationId } })
  }, [organizationId, params])

  const resetSelectedState = useCallback(() => {
    setRowKeys([]);
    setItem({});
  }, [])

  const showModal = useCallback((type) => {
    setModalType(type);
    setVisible(true);
  }, [])
  //选中
  const handleSelect = useCallback((selectedRowKeys, selectedRows) => {
    setRowKeys(selectedRowKeys)
    setItem(selectedRows[0])
  }, [setRowKeys, setItem])

  const onPageChange = useCallback((beginIndex, pageSize) => {
    fetchUserList({ ...params, pageInfo: { beginIndex, pageSize } })
  }, [organizationId, params])

  const onCancel = useCallback(() => {
    setVisible(false);
    setModalType(FormTypes.create);
  }, [])

  //关联用户弹窗
  const changeRelatedModalState = useCallback((visible = false) => {
    setUserVisible(visible)
  }, [])

  //进行关联
  const onRelate = useCallback((selectedRowKeys) => {
    let cb = () => { setUserVisible(false) }
    let ids = selectedRowKeys.map((i: string) => parseInt(i));
    relateUsers({ organizationId, userIds: ids }, cb)
  }, [organizationId])

  //执行删除
  const handleremove = useCallback(() => {
    confirm({
      title: tr('请确认'),
      content: <span>{tr('是否删除选择的用户账号')} <span style={{ color: primaryColor }}>{selectedItem.userName}</span>?</span>,
      cancelText: tr('取消'),
      okText: tr('确定'),
      okType: 'danger',
      okButtonProps: { size: 'small' },
      cancelButtonProps: { size: 'small' },
      onOk() {
        return new Promise((resolve, reject) => {
          removeUser({ id: selectedItem.id }, () => {
            setRowKeys([]);
            setItem({});
            resolve();
          })
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() { },
    });
  }, [selectedItem])

  const onSubmit = useCallback((values) => {
    let cb = (_values: any) => {
      setVisible(false);
      _values && setItem(_values);
    }
    modalType == 'create' ? createUser(values, cb) : updateUser({ ...selectedItem, ...values }, cb)
  }, [modalType, selectedItem])

  const _schema = useMemo(() => {
    let newSchema = deepCopy4JSON(schema);
    delete newSchema.required;
    Object.keys(newSchema.propertyType).map(item => {
      newSchema.propertyType[item].props = {
        ...newSchema.propertyType[item].props,
        edit: EditStatus.CANCEL,
        allowEdit: false,
      }
    })
    return newSchema;
  }, [schema]);

  const createInfo = useMemo(() => {
    return {
      userType: "EMPLOYEE",
      isActive: true,
      organizationId
    }
  }, [organizationId])

  const rowSelected = useMemo(() => selectedRowKeys.length > 0, [selectedRowKeys]);
  // const bodyHeight = useHeight(MAIN_CONFIG, 40 + 12 + 306 + 40);

  return <>
    <div>
      <BlockHeader title={<Title title={tr('组织机构信息')} showShortLine={true} />} />
      <FormSchema
        key={organizationId ? `${organizationId}_${values.optCounter || '0'}` : 'formSchema'}
        wrappedComponentRef={formRef}
        data={organizationId ? values : {}}
        schema={_schema}
        uiSchema={detailContentUiSchema}
      />
    </div>
    <SmartTable
      tableKey={`${pageKey}User:${userId}`}
      title={<Title title={tr('组织机构用户')} showShortLine={true} showSplitLine={true} />}
      schema={smartTableUserSchema}
      rowKey='id'
      // bodyHeight={bodyHeight}
      dataSource={dataSource}
      pageSize={params.pageInfo.pageSize}
      pageIndex={params.pageInfo.beginIndex}
      onPageChange={onPageChange}
      totalCount={totalCount}
      loading={loading}
      headerRight={<>
        <Button size="small" disabled={!organizationId} onClick={changeRelatedModalState.bind(null, true)}>{tr('关联')}</Button>
        <Tooltip title={tr("新增")}>
          <Button
            size="small"
            icon="plus"
            className="marginh5"
            disabled={!organizationId}
            onClick={showModal.bind(null, FormTypes.create)}
          />
        </Tooltip>
        <Tooltip title={tr("编辑")}>
          <Button
            size="small"
            icon="edit"
            className="marginh5"
            disabled={!rowSelected}
            onClick={showModal.bind(null, FormTypes.modify)}
          />
        </Tooltip>
        <Tooltip title={tr("删除")}>
          <Button
            size="small"
            icon="delete"
            type="danger"
            className="marginh5"
            disabled={!rowSelected}
            onClick={handleremove}
          />
        </Tooltip>
      </>}
      rowSelection={{
        type: 'radio',
        selectedRowKeys: selectedRowKeys,
        onChange: handleSelect
      }}
    />
    <UserFormModal
      value={modalType === FormTypes.modify ? selectedItem : createInfo}
      onSubmit={onSubmit}
      formType={modalType}
      onCancel={onCancel}
      confirmLoading={modalLoading}
      visible={visible}
    />
    <UserModal
      multiple
      loading={relateLoading}
      visible={userVisible}
      onOk={onRelate}
      onCancel={changeRelatedModalState}
    />
  </>
}
DetailContent.defaultProps = {
  values: {},
  dataSource: []
}
export default React.memo(DetailContent);
