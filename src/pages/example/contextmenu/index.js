import React, { useState, useMemo, useEffect } from 'react'
import { Button } from 'antd';
import { Card, Icon } from 'gantd'
import { connect } from 'dva'
import { getContentHeight } from '@/utils/utils'
import ContextMenu from '@/components/specific/contextmenu'


function CustomComponent(props) {
  return <div>custom element</div>
}

function Page(props) {
  const { headerHeight } = props;
  const [count, setCount] = useState(0);
  const [menuSize, setMenuSize] = useState({});
  const minHeight = getContentHeight(MAIN_CONFIG, 72)

  const onMenuChange = (contextSelectKey) => { console.log(contextSelectKey) }

  const menuData = useMemo(() => {
    return [
      {
        name: '自定义1',
        icon: <Icon.Ant type='cloud-upload' />,
        component: <CustomComponent count={count} menuSize={menuSize} />,
      }
    ]
  }, [count, menuSize])
  return (
    <>
      <Button onClick={() => { setCount(count => count + 1) }}>click</Button>
      <ContextMenu
        category='102'
        contextMenuKey='exampleContextMenu'
        title='上下文菜单demo'
        minHeight={minHeight}
        headerHeight={headerHeight}
        onMenuChange={onMenuChange}
        dynamicCmpProps={{ count }}
        onMenuStateChange={(mode, collapsed, e) => {
          e && setMenuSize({ width: e.offsetWidth, height: e.offsetHeight })
        }}
        menuDataAhead
        menuData={menuData}
      />
    </>
  )
}

export default connect(
  ({ settings }) => ({
    headerHeight: settings.MAIN_CONFIG.headerHeight,
  })
)(Page)
