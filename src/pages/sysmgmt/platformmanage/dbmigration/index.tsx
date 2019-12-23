import React, { useEffect, useMemo, useCallback, useState } from 'react'
import { Button, message, Input, Modal } from 'antd'
import { Card } from 'gantd'
import { connect } from 'dva'
import { Title } from '@/components/common'
import { SmartSearch, SmartTable, SmartModal } from '@/components/specific'
import { FilterData } from '@/components/specific/smartsearch/interface'
import { getTableHeight, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT, MODAL_HEADER_HEIGHT, MODAL_FOOTER_HEIGHT, MODAL_PADDING_HEIGHT } from '@/utils/utils'
import { searchSchema, smartTableSchema } from './schema'

const PAGE_NAEM = 'dbmigration'

/**
 * 平台管理-数据库脚本维护
 */
export default connect(({ settings, dbMigration, loading, user }: any) => ({
  userId: user.currentUser.id,
  MAIN_CONFIG: settings.MAIN_CONFIG,
  selectedSchema: dbMigration.selectedSchema,
  schemaList: dbMigration.schemaList,
  migrationInfoList: dbMigration.migrationInfoList,
  cacheInfoList: dbMigration.cacheInfoList,
  errorMsg: dbMigration.errorMsg,
  failId: dbMigration.failId,
  schemaLoading: loading.effects['dbMigration/getSchemaList'],
  fetchLoading: loading.effects['dbMigration/getMigrationInfo'],
  migrateLoading: loading.effects['dbMigration/migrate'],
  forceSuccessLoading: loading.effects['dbMigration/forceSuccess'],
  selectedNames: dbMigration.selectedNames
}))((props: any) => {
  const {
    userId,
    MAIN_CONFIG,
    selectedSchema,
    migrationInfoList,
    errorMsg,
    failId,
    dispatch,
    fetchLoading,
    migrateLoading,
    forceSuccessLoading,
    route
  } = props
  const [searchHeight, setSearchHeight] = useState(0)
  const height = getTableHeight(MAIN_CONFIG, searchHeight + TABLE_HEADER_HEIGHT + CARD_BORDER_HEIGHT, false)
  const [modalHeight, setModalHeight] = useState(0)

  useEffect(() => {
    return () => {
      dispatch({ type: 'dbMigration/reset' })
    }
  }, [])

  const onSearch = useCallback((params: FilterData, isInit?: boolean) => {
    if (isInit) return
    const { filterInfo: { schema } } = params
    if (!schema) {
      message.warning(tr('请选择需要查询的SCHEMA'))
      return
    }
    dispatch({
      type: 'dbMigration/getMigrationInfo',
      payload: {
        schema
      }
    })
  }, [])

  const migrate = useCallback(() => {
    if (!selectedSchema) {
      message.warning(tr('请选择SCHEMA'))
      return
    }
    dispatch({ type: 'dbMigration/migrate' })
  }, [selectedSchema])

  const onFailClick = useCallback((id: string | number) => {
    dispatch({
      type: 'dbMigration/getErrorMessage',
      payload: {
        id
      }
    })
  }, [])

  const closeModal = useCallback(() => {
    dispatch({ type: 'dbMigration/closeModal' })
  }, [])

  const onOk = useCallback(() => {
    Modal.confirm({
      title: tr('是否确认执行?'),
      content: <p>{tr(`请确认该SQL脚本已被成功执行过, 只是由于人为原因导致自动迁移脚本执行失败; 执行此操作会将此脚本状态改为SUCCESS, `)}<b>{tr('该脚本会被跳过')}</b></p>,
      maskClosable: true,
      cancelText: tr('取消'),
      okText: tr('确认'),
      centered: true,
      okButtonProps: {
        size: 'small'
      },
      cancelButtonProps: {
        size: 'small'
      },
      onOk() {
        return dispatch({
          type: 'dbMigration/forceSuccess'
        })
      },
      onCancel() {
      }
    })
  }, [])

  const showTableSchema = useMemo(() => {
    return smartTableSchema.map((item: any) => {
      const { fieldName } = item
      const tempItem = { ...item }
      if (fieldName === 'state') {
        tempItem.render = (value: 'FAILED' | 'PENDING' | 'SUCCESS', record: any) => {
          let color = ''
          switch (value) {
            case 'FAILED':
              color = 'red'
              return <a href='#' style={{ color }} onClick={onFailClick.bind(null, record.id)}>{value}</a>
            case 'PENDING':
              color = '#909090'
              break
            case 'SUCCESS':
              color = '#23a728'
              break
            default:
              color = '#23a728'
          }
          return <span style={{ color }}>{value}</span>
        }
      }

      return tempItem
    })
  }, [])

  const onModalSizeChange = useCallback((width: number, height_: number) => {
    setModalHeight(height_ - MODAL_HEADER_HEIGHT - MODAL_FOOTER_HEIGHT - 2 * MODAL_PADDING_HEIGHT)
  }, [])

  return (
    <Card bodyStyle={{ padding: 0 }}>
      <SmartSearch
        title={<Title route={route} />}
        searchPanelId={PAGE_NAEM}
        userId={userId}
        schema={searchSchema}
        onSearch={onSearch}
        isCompatibilityMode
        headerProps={{
          className: 'specialHeader'
        }}
        onSizeChange={({ height: smartSeachHeight }) => setSearchHeight(smartSeachHeight)}
      />
      <SmartTable
        tableKey={`${PAGE_NAEM}${userId}`}
        schema={showTableSchema}
        loading={fetchLoading}
        dataSource={migrationInfoList}
        bodyHeight={height}
        headerRight={(
          <Button
            loading={migrateLoading}
            disabled={!selectedSchema}
            size='small'
            icon='code'
            onClick={migrate}
          >
            {tr('执行所有SQL脚本')}
          </Button>)}
      />
      <SmartModal
        id='dbmigrationModal'
        visible={!!(errorMsg && failId)}
        title={tr('错误信息')}
        onCancel={closeModal}
        onOk={onOk}
        okText={tr('标记为SUCCESS')}
        cancelText={tr('关闭')}
        confirmLoading={forceSuccessLoading}
        okButtonProps={{
          size: 'small'
        }}
        cancelButtonProps={{
          size: 'small'
        }}
        onSizeChange={onModalSizeChange}
      >
        <Input.TextArea value={errorMsg} readOnly style={{ resize: 'none', height: modalHeight }} />
      </SmartModal>
    </Card>
  )
})
