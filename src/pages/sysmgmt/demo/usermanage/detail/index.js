import React, { useEffect, useMemo } from 'react';
import router from 'umi/router';
import { Rate, Progress, Spin } from 'antd';
import { Icon } from 'gantd';
import { connect } from 'dva';
import ContextMenu from '@/components/specific/contextmenu';
import { getContentHeight } from '@/utils/utils'
import menuData from './data';
import styles from './styles.less';

function Detail(props) {
  const {
    match: { params: { id } },
    MAIN_CONFIG,
    dispatch,
    studentDetail,
    loading,
  } = props;

  const minHei = getContentHeight(MAIN_CONFIG, 40);

  useEffect(() => {
    dispatch({ type: "demoUserManageDetail/fetch", payload: id })
  }, [])

  const onMenuChange = (key, menuTarget) => { console.log(key, menuTarget) }
  const titleElement = useMemo(() => {
    return <>
      <Icon.Ant
        type="left"
        className='margin5'
        onClick={() => { router.goBack() }}
      />
      <span>{tr('用户管理详情')}{loading ?
        <Icon.Ant type="loading" className='margin5' spin />
        : `-${studentDetail.name || ''}`}
      </span>
           </>
  }, [studentDetail, loading])

  const extraElement = useMemo(() => {
    return <>
      {loading ? null : <div className={styles.extraWrapper}>
        <Rate allowHalf defaultValue={2.5} style={{ marginRight: 20 }} />
        <div style={{ marginRight: 20 }}>
          <Progress strokeLinecap="square" percent={75} />
          <span>{tr('资料完善度')}</span>
        </div>
        <Rate
          tooltips={[tr('收藏')]}
          count={1}
          defaultValue={1}
          style={{ color: 'red' }}
          character={<Icon.Ant type="heart" />}
        />
                        </div>}
           </>
  }, [loading])

  return (
    <div className={styles.demoWrapper}>
      <ContextMenu
        category='102'
        contextMenuKey='demoUserManageDetail'
        title={titleElement}
        minHeight={minHei}
        extra={extraElement}
        onCancel={() => { setVisible(false) }}
        onMenuChange={onMenuChange}
        menuDataAhead
        menuData={menuData}
      />
    </div>
  )
}
export default connect(
  ({ demoUserManageDetail, settings, loading }) => ({
    MAIN_CONFIG: settings.MAIN_CONFIG,
    studentDetail: demoUserManageDetail.studentDetail,
    loading: loading.effects['demoUserManageDetail/fetch'],
  }))(Detail)
