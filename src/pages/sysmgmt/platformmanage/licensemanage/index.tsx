import React, { useEffect, useCallback, useMemo } from 'react'
import { Tooltip, Button, Form, Row, Col, Spin, Alert } from 'antd'
import { BlockHeader, EditStatus, Card, Input } from 'gantd'
import { connect } from 'dva'
import { Title } from '@/components/common'
import { UserSelector, SingleFileUpload, SmartModal } from '@/components/specific'
import { File } from '@/services/file'
import { getContentHeight, CARD_BORDER_HEIGHT } from '@/utils/utils'
import { LicenseInfo } from './model'
import styles from './index.less'

const { Item } = Form

const colLayout = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 8,
  xl: 8,
  xxl: 8
}

const colLayout2 = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 12,
  xl: 12,
  xxl: 12
}

const formItemLayout = {
  labelCol: {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 6,
    xl: 6,
    xxl: 6
  },
  wrapperCol: {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 18,
    xl: 17,
    xxl: 18
  }
}

const LICENSE_FIELDS = [
  {
    key: 'productName',
    name: tr('产品名称')
  }, {
    key: 'orgName',
    name: tr('授权给')
  }, {
    key: 'deadline',
    name: tr('授权截止时间')
  }
]

const INIT_ITEM_STATE = {
  width: 520,
  height: 400
}

/**
 * 平台管理-许可证管理
 */
export default connect(({ settings, licenseManage, loading }: any) => ({
  MAIN_CONFIG: settings.MAIN_CONFIG,
  messageInfoList: licenseManage.messageInfoList,
  licenseInfo: licenseManage.licenseInfo,
  newLicenseInfo: licenseManage.newLicenseInfo,
  showAddModel: licenseManage.showAddModel,
  fetchLoading: loading.effects['licenseManage/getLicenseManagerInfo'],
  updateLoading: loading.effects['licenseManage/updateLicense'],
  selectedNames: licenseManage.selectedNames
}))((props: any) => {
  const {
    MAIN_CONFIG,
    dispatch,
    licenseInfo,
    newLicenseInfo,
    fetchLoading,
    showAddModel,
    updateLoading,
    route
  } = props
  const { notificationUser } = licenseInfo as LicenseInfo

  // 获取许可证
  const getLicenseManagerInfo = () => {
    dispatch({ type: 'licenseManage/getLicenseManagerInfo' })
  }

  useEffect(() => {
    if (_.isEmpty(licenseInfo)) {
      getLicenseManagerInfo()
    }
  }, [])

  const onSingleFileUpload = useCallback((file: any) => {
    let tempFile: File = file
    dispatch(({
      type: 'licenseManage/analyseLicenseInfo',
      payload: {
        fileId: tempFile.id
      }
    }))
  }, [])

  const onAddLicenseOk = useCallback(() => {
    dispatch(({ type: 'licenseManage/updateLicense' }))
  }, [])

  const onAddLIcenseCancel = useCallback(() => {
    dispatch(({ type: 'licenseManage/cancelAdd', }))
  }, [])

  const updateNotificationUser = useCallback((userloginName: string | undefined) => {
    dispatch({
      type: 'licenseManage/updateNotificationUser',
      payload: {
        userloginName
      }
    })
  }, [])

  const contentHeight = useMemo(() => {
    return getContentHeight(MAIN_CONFIG, 40 + CARD_BORDER_HEIGHT)
  }, [MAIN_CONFIG])

  return (
    <Card
      title={<Title route={route} />}
      className='specialCardHeader'
      bodyStyle={{ padding: 10, height: contentHeight }}
      extra={(
        <span className={styles.peraters}>
          <SingleFileUpload
            tempFile
            btnText={tr('导入许可证')}
            onSuccess={onSingleFileUpload}
            extraBtnProps={{
              icon: 'import',
              type: 'primary'
            }}
          />
          <Tooltip title={tr('刷新')}>
            <Button loading={fetchLoading} size='small' icon='reload' onClick={getLicenseManagerInfo} />
          </Tooltip>
        </span>
      )}>
      <Spin spinning={(fetchLoading || updateLoading) ? true : false}>
        <BlockHeader type='line' title={tr('许可证信息')} />
        <Form className={styles.form} layout='horizontal' {...formItemLayout} labelAlign='left'>
          <Row gutter={10}>
            {LICENSE_FIELDS.map((item: any) => {
              const { key, name } = item
              return (
                <Col {...colLayout} key={key}>
                  <Item label={name}>
                    <Input allowEdit={false} value={licenseInfo[key]} />
                  </Item>
                </Col>
              )
            })}
          </Row>
        </Form >
        <BlockHeader
          type='line'
          title={tr('许可证即将到期通知')}
        />
        <Form className={styles.form} layout='horizontal' {...formItemLayout} labelAlign='left'>
          <Row>
            <Col {...colLayout2}>
              <Item label={tr('通知用户')}>
                <UserSelector
                  edit={EditStatus.EDIT}
                  value={notificationUser}
                  valueProp='userLoginName'
                  onChange={updateNotificationUser}
                />
              </Item>
            </Col>
          </Row>
          <Alert
            message={tr('实现通知功能,必须配置"发送授权证书即将到期通知"定时任务')}
            type="warning"
            showIcon
          />
        </Form >
      </Spin>
      <SmartModal
        id='licensemanageModal'
        title={tr('是否导入新许可证?')}
        visible={showAddModel}
        okButtonProps={{ size: 'small' }}
        cancelButtonProps={{ size: 'small' }}
        onOk={onAddLicenseOk}
        confirmLoading={updateLoading}
        onCancel={onAddLIcenseCancel}
        itemState={INIT_ITEM_STATE}
        canMaximize={false}
        canResize={false}
      >
        <BlockHeader title={tr('新许可证信息')} bottomLine />
        <Form layout='vertical' labelCol={{ span: 10 }} wrapperCol={{ span: 24 }} labelAlign='left'>
          <Row gutter={10}>
            {LICENSE_FIELDS.map((item: any) => {
              const { key, name } = item
              return (
                <Col span={24} key={key}>
                  <Item label={name}>
                    <Input allowEdit={false} value={newLicenseInfo[key]} />
                  </Item>
                </Col>
              )
            })}
          </Row>
        </Form >
      </SmartModal>
    </Card >
  )
})
