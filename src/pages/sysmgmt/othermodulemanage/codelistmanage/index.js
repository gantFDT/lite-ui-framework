import React, { useState } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import { Card } from 'gantd'
import { isEqual } from 'lodash'
import CodeListLeft from './components/CodeListLeft'
import CodeListRight from './components/CodeListRight'
import { Title } from '@/components/common'
import styles from './style.less';
import { getTableHeight } from '@/utils/utils'

function Page(props) {
  const {
    params,
    selectedRowKeys,
    selectedRows,
    data,
    formType,
    visible,
    syncAllLoading,
    btnLoading,
    editValue,
    dispatch, total, loading,
    codeselectedRowKeys,
    codeselectedRows,
    selectData,
    editSelectData,
    listLoding,
    selectVisible,
    selectFormType,
    selectEditValue,
    route,
    MAIN_CONFIG,
    currentUser,
    editting
  } = props;
  const selectContent = _.get(selectedRows, '[0]', {})
  const disabledSave = isEqual(selectData, editSelectData)
  const [searchHeight, setSearchHeight] = useState(150)
  const codeListHeight = getTableHeight(MAIN_CONFIG, searchHeight + 91, false);
  const codeTypeHeight = getTableHeight(MAIN_CONFIG, searchHeight + 89, true);
  const userId = currentUser.id
  const rightProps = {
    codeselectedRowKeys,
    codeselectedRows,
    dispatch,
    listLoding,
    selectData,
    list: editSelectData,
    selectContent,
    disabledSave,
    tableHeight: codeListHeight,
    editting,
    userId
  }

  const leftProps = {
    params, selectedRowKeys, data,
    syncAllLoading,
    editValue,
    formType, visible, dispatch, total, loading, btnLoading,
    selectContent,
    disabledSave,
    setHeight: setSearchHeight,
    tableHeight: codeTypeHeight,
    userId
  }

  return (
    <Card title={<Title route={route} />} className="specialCardHeader" bodyStyle={{ padding: 0 }}>
      <div className={styles.container}>
        <Row gutter={10}>
          <Col span={24} md={12}>
            <CodeListLeft {...leftProps} />
          </Col>
          <Col span={24} md={12}>
            <CodeListRight {...rightProps} />
          </Col>
        </Row>
      </div>
    </Card>);
}
export default connect(({ codelist, loading, settings, user }) => ({
  ...codelist,
  MAIN_CONFIG: settings.MAIN_CONFIG,
  loading: loading.effects['codelist/getCodeType'],
  btnLoading: loading.effects['codelist/createCodeType'] || loading.effects['codelist/editCodeType'],
  syncAllLoading: loading.effects['codelist/syncAllCodeType'],
  listLoding: loading.effects['codelist/getSelectedList'],
  currentUser: user.currentUser
}))(Page);
