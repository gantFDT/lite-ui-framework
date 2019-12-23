import React, { useState, useMemo, useCallback, useEffect, Dispatch } from 'react'
import { Button, Tooltip, Modal } from 'antd'

import { SmartTable, SmartSearch } from '@/components/specific'
import { smartTableSchema, smartSearchSchema } from './schema'

import { connect } from 'dva'
import { cloneDeep } from 'lodash'
import RichTextModal from './RichTextModal'
import TestModal from './TestModal'
import { Title } from '@/components/common'
import { getTableHeight, TABLE_HEADER_HEIGHT } from '@/utils/utils'

const pageKey = 'mailetemplate'
const getPageFromIndex = (pageInfo: any) => {
  if (!pageInfo.beginIndex) return 1;
  return (pageInfo.beginIndex / pageInfo.pageSize) + 1;
}

interface MailTemplateListProps {
  [propName: string]: any
}

function MailTemplateList(props: MailTemplateListProps) {
  const {
    primaryColor,
    MAIN_CONFIG,
    route,
    userId,
    getMailTemplate,
    modifyModel,
    sendMail,
    createMail,
    updateMail,
    removeMail,

    mailTemplateList,
    mailListTotal,
    mailParams,

    selectedRowKeys,
    selectedRows,

    visible,
    modalType,
    visibleTeat,
    mailLoading

  } = props

  const getSchema = useMemo(() => {
    let newTableSchema = cloneDeep(smartTableSchema);
    return newTableSchema;
  }, [smartTableSchema])

  const [params, setParams] = useState({})

  const refreshList = useCallback((page = 1, pageSize = 20) => {
    getMailTemplate({
      page: page || getPageFromIndex(mailParams.pageInfo),
      pageSize: pageSize || mailParams.pageInfo.pageSize,
      ...params
    })
  }, [params])

  useEffect(() => {
    refreshList()
  }, [params])

  const handleSearch = useCallback((filters) => {
    const { category, key, name } = filters.filterInfo;
    if (category || key || name) {
      let newParams = {
        ...params,
        filterInfo: {
          ...filters.filterInfo,
          filterModel: true
        }
      }
      setParams(newParams)
    } else {
      setParams({ page: 1, pageSize: 20 })
    }
  }, [params])

  // const handleSearch = useCallback((searchParams) => {
  //   searchParams.filterInfo.filterModel = true
  //   setParams({ filterInfo: searchParams.filterInfo })
  // }, [])

  const handlerSelect = useCallback((_selectedRowKeys: any, _selectedRows: any) => {
    modifyModel({
      selectedRowKeys: _selectedRowKeys,
      selectedRows: _selectedRows
    })
  }, [])

  const openModal = useCallback((modalType) => {
    if (modalType === 'test') {
      modifyModel({
        visibleTeat: true
      })
    } else {
      modifyModel({
        visible: true,
        modalType: modalType
      })
    }

  }, [])

  const handlerRemove = useCallback(async () => {
    Modal.confirm({
      title: tr('请确认'),
      content: <span>{tr('是否删除选择的邮件模版')} <span style={{ color: primaryColor }}>{selectedRows[0].name}</span></span>,
      okText: tr('是'),
      cancelText: tr('否'),
      onOk: () => {
        removeMail()
      },
      okButtonProps: {
        size: 'small',
        type: 'danger'
      },
      cancelButtonProps: {
        size: 'small'
      }
    });
  }, [selectedRows])

  const hasRowSelected = useMemo(() => selectedRowKeys && selectedRowKeys.length, [selectedRowKeys])

  const headerRight = useMemo(() => (
    <>
      <Tooltip title={tr("测试模版发送邮件")} placement="bottom"  >
        <Button size="small" onClick={() => openModal('test')} icon='mail' disabled={hasRowSelected !== 1} />
      </Tooltip>
      <Tooltip title={tr("发布邮件模版")} placement="bottom"  >
        <Button size="small" onClick={() => openModal('create')} icon='plus' />
      </Tooltip>
      <Tooltip title={tr("更新邮件模版")} placement="bottom"  >
        <Button size="small" onClick={() => openModal('update')} icon='edit' disabled={hasRowSelected !== 1} />
      </Tooltip>
      <Tooltip title={tr("删除邮件模版")} placement="bottom"  >
        <Button size="small" icon='delete' onClick={() => handlerRemove()} disabled={hasRowSelected !== 1} />
      </Tooltip>
    </>
  ), [hasRowSelected])

  const closeModal = useCallback((type) => {
    if (type == 'test') {
      modifyModel({
        visibleTeat: false,
        modalType: 'create'
      })
    } else {
      modifyModel({
        visible: false
      })
    }
  }, [])

  const handlerCreate = useCallback((values: any) => {
    if (modalType === 'create') {
      createMail(values)
    } else {
      updateMail({
        ...values
      })
    }
    modifyModel({
      visible: false
    })
  }, [modalType])

  const onTestOk = useCallback((formValues) => {
    sendMail(formValues)

    modifyModel({
      visibleTeat: false
    })
  }, [])


  const [searchFormHei, setSearchFormHei] = useState(0);

  //smart高度改变
  const onSearchFormSizeChange = useCallback(({ height, width }) => {
    setSearchFormHei(height)
  }, [setSearchFormHei])

  const bodyHeight = getTableHeight(MAIN_CONFIG, searchFormHei + TABLE_HEADER_HEIGHT)

  return (
    <>
      <RichTextModal
        visible={visible}
        dataSource={modalType === 'update' ? selectedRows[0] : {}}
        modalType={modalType}
        onCreate={handlerCreate}
        onCancel={closeModal}
      />
      <TestModal
        visible={visibleTeat}
        onTestCancel={closeModal}
        onTestOk={onTestOk}
        dataSource={selectedRows[0]}
      />
      <SmartSearch
        searchPanelId={pageKey}
        userId={userId}
        title={<Title route={route} />}
        headerProps={{
          className: 'specialHeader'
        }}
        schema={smartSearchSchema}
        isCompatibilityMode
        onSearch={handleSearch}
        onSizeChange={onSearchFormSizeChange}
      />
      <SmartTable
        tableKey={`${pageKey}:${userId}`}
        bodyHeight={bodyHeight}
        schema={getSchema}
        dataSource={mailTemplateList}
        rowKey="id"
        loading={mailLoading}

        headerRight={headerRight}

        rowSelection={{
          type: 'radio',
          selectedRowKeys,
          onChange: handlerSelect
        }}
        pagination={{
          total: mailListTotal,
          pageSize: mailParams.pageInfo.pageSize,
          onChange: refreshList,
          onShowSizeChange: refreshList,
        }}
      />
    </>
  )
}

export default connect(
  ({ mailtemplate, settings, user, loading }: any) => ({
    userId: user.currentUser.id,
    ...mailtemplate,
    ...settings,
    primaryColor: settings.MAIN_CONFIG.primaryColor,
    headerHeight: settings.MAIN_CONFIG.headerHeight,
    mailLoading: loading.effects['mailtemplate/getMailTemplate']
  }),
  (dispatch: Dispatch<any>) => ({
    getMailTemplate: (payload: any) => dispatch({ type: 'mailtemplate/getMailTemplate', payload }),
    modifyModel: (payload: any) => dispatch({ type: 'mailtemplate/save', payload }),
    sendMail: (payload: any) => dispatch({ type: 'mailtemplate/sendMail', payload }),
    createMail: (payload: any) => dispatch({ type: 'mailtemplate/publishMailTemplate', payload }),
    updateMail: (payload: any) => dispatch({ type: 'mailtemplate/modifierMailTemplate', payload }),
    removeMail: (payload: any) => dispatch({ type: 'mailtemplate/removeMailTemplate', payload }),
  })
)(MailTemplateList)

