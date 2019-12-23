import React, { useEffect, useMemo } from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import { Icon } from 'gantd';
import { connect } from 'dva';
import ContextMenu from '@/components/specific/contextmenu';
import { menuData } from './data';
import { SettingsProps } from '@/models/settings';
import { getContentHeight } from '@/utils/utils'

function Detail(props: any) {
  const {
    match: { params: { id } },
    MAIN_CONFIG,
    dispatch,
    detailContent,
    loading,
  } = props;

  useEffect(() => {
    dispatch({ type: "pageName/fetch", payload: id })
  }, [])

  //点击菜单项回调
  const onMenuChange = (key: string, menuTarget: object) => {
    console.log(key, menuTarget)
  }
  //自定义标题
  const titleElement = useMemo(() => {
    return <>
      <Icon.Ant
        type="left"
        className='margin5'
        onClick={() => { router.goBack() }}
      />
      <span>
        {tr('详情页模板')}{loading ? <Icon.Ant type="loading" className='margin5' spin />
          : `-${detailContent.name || tr('详情名称')}`}
      </span>
    </>
  }, [detailContent, loading])

  //自定义右侧额外内容
  const extraElement = useMemo(() => {
    return <>
      {loading ? null : <Button size='small'>{tr('自定义extra')}</Button>}
    </>
  }, [loading])

  //菜单最小高度
  const minHeight = getContentHeight(MAIN_CONFIG, 40);
  return (
    <ContextMenu
      category='101'
      contextMenuKey='pageName'
      title={titleElement}
      minHeight={minHeight}
      extra={extraElement}
      onMenuChange={onMenuChange}
      menuDataAhead
      menuData={menuData}
    />
  )
}

export default connect(
  ({ pageName, settings, loading }: { pageName: any, settings: SettingsProps, loading: any }) => ({
    MAIN_CONFIG: settings.MAIN_CONFIG,
    detailContent: pageName.detailContent,
    loading: loading.effects['pageName/fetch'],
  }))(Detail)
