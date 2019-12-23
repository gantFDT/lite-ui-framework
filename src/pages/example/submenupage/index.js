import React, {useState, Children} from 'react'
import { connect } from 'dva'
import { Card, Icon, Button, SubMenu } from 'gantd'
import { findIndex } from 'lodash'
import router from 'umi/router'

function SubmenuPage(props) {

  const { 
    children,
    headerHeight,
    showBreadcrumb,
    match: { url, params: { id } }, 
    location: { pathname },dispatch 
  } = props;
  const menuData = [
    {
      name: tr('OnePage'),
      icon: <Icon type="icon-xingming" />,
      path: 'onepage',
    },
    {
      name: tr('TwoPage'),
      icon: <Icon type="icon-iconbi" />,
      path: 'twopage',
    },
    {
      name: tr('ThreePage'),
      icon: <Icon type="bg-colors" />,
      path: 'threepage',
    },
  ].map(item => ({ ...item, key: item.path }));
	const pathArray = pathname.split('/');
	const defaultname = pathArray[pathArray.length - 1]
  const [selectedPath, setSelectedPath] = useState(defaultname)
  const index = findIndex(menuData, { path: selectedPath })
  const selectedKey = menuData[index] ? menuData[index].name : null
  const onSelectedChange = (path) => {
		setSelectedPath(path);
		router.push(`${url}/${path}`)
	}
    return (
        <>
            <SubMenu 
              menuData={menuData} 
              selectedKey={selectedKey}
              onSelectedChange={onSelectedChange}
            >
            {children}
            </SubMenu>
        </>
    )
}

export default connect(({ user, settings }) => ({
  currentUser: user.currentUser,
  headerHeight: settings.MAIN_CONFIG.headerHeight,
  showBreadcrumb: settings.MAIN_CONFIG.showBreadcrumb,
}))(SubmenuPage)