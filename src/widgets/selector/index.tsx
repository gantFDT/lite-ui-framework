import { Button, Col, Popover, Row, Badge, Icon, Tag, Input, List, Empty } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import styles from './index.less'
import classnames from 'classnames'
import { SmartModal } from '@/components/specific'
import { spanCalculate } from '@/utils/utils';
const Search = Input.Search;

const WidgetSelector = (props: any) => {
  const {
    widgets,
    currentLayout,
    addWidget,
    children = <Button
      size="small"
      type="primary"
      icon='plus'
      style={{marginLeft:'10px'}}
    >
      {tr('添加小程序')}
    </Button>
  } = props;

  const [stateWidgets, setStateWidgets] = useState(widgets)
  const [visible, setVisible] = useState(false)
  const [height, setHeight] = useState(500)
  const [width, setWidth] = useState(1024)
  const [menuData, setMenuData] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [keywords, setKeywords] = useState('')

  //计算是否还可添加
  const canBeAdd = (widget: object[], widgetKey: string) => {
    if (widget.length < widget['maxLength']) {
      return true
    } else {
      return false
    }
  }

  //列数
  const span = 24 / spanCalculate(width) + 1

  //计算左侧菜单
  const handleCalcMenuData = useCallback((widgets) => {
    let tags: string[] = [];
    Object.keys(widgets).map((key) => {
      tags.push(...widgets[key]['tags'])
    })
    const tempObj = {}
    tags.map(item => {
      if (tempObj[item]) {
        tempObj[item]['count']++
      } else {
        tempObj[item] = {
          title: item,
          count: 1
        }
      }
    })
    const menuData: any = []
    Object.keys(tempObj).map((key, index, arr) => {
      menuData.push(tempObj[key])
    })
    setMenuData(menuData)
  }, [menuData])

  //菜单变化
  const handleMenuChange = useCallback((item, index) => {
    setActiveIndex(index)
    let temp = {}
    Object.keys(widgets).map((key) => {
      if (widgets[key]['tags'].indexOf(menuData[index]['title']) >= 0) {
        temp[key] = widgets[key]
      }
    })
    setStateWidgets(temp)
  }, [widgets, menuData])

  //查询
  const handleSearch = useCallback((value) => {
    let temp = {}
    Object.keys(widgets).map((key) => {
      if (widgets[key]['name'].indexOf(value) >= 0) {
        temp[key] = widgets[key]
      }
    })
    handleCalcMenuData(temp)
    setStateWidgets(temp)
    setKeywords(value)
  }, [widgets, menuData, handleCalcMenuData])


  useEffect(() => {
    handleCalcMenuData(widgets)
  }, [])

  return (
    <>
      <div style={{ display: 'inline-block' }} onClick={() => { setVisible(true) }}>
        {children}
      </div>
      <SmartModal
        id='widgetSelector'
        itemState={{
          width,
          height
        }}
        title={<><Icon type="appstore" className='marginh5' />{tr('选择小程序')}</>}
        visible={visible}
        isModalDialog
        onCancel={() => { setVisible(false) }}
        footer={null}
        onSizeChange={(width, height) => { setHeight(height - 40); setWidth(width) }}
        bodyStyle={{padding:0}}
        zIndex={1006}
      >
        <div className={styles.wrap}>
          <div className={styles.leftBar}>
            <Search
              placeholder={tr('请输入小程序名称')}
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              prefix={<Icon type="exception" className={styles.searchIcon} />}
              allowClear
            />
            <List
              itemLayout="horizontal"
              style={{ marginTop: '10px' }}
              dataSource={menuData}
              renderItem={(item: object, index: number) => (
                <List.Item className={classnames(styles.item, activeIndex == index ? styles.active : '')} onClick={() => handleMenuChange(item, index)}>
                  <div className={styles.name}>{item['title']}</div>
                  <div className={styles.Badge}><Badge count={item['count']} /></div>
                </List.Item>
              )}
            />
          </div>
          <div className={classnames(styles.Layer)} style={{
            height:height-2
          }}>
            {!_.isEmpty(stateWidgets) ?
              <div className="waterfall" style={{ columnCount: span }}>
                {Object.keys(stateWidgets).map((key) =>
                  <div key={key} className={classnames(styles.item)}>
                    <img src={stateWidgets[key]['snapShot']} className={styles.shortcut} />
                    <div className={styles.bottombar}>
                      <div className={styles.iconWrap} style={{ backgroundImage: stateWidgets[key]['iconBackground'] }}>
                        <Icon type={stateWidgets[key].icon} />
                      </div>
                      <div className={styles.name}>
                        {stateWidgets[key].name}
                      </div>
                      <div className={styles.description}>
                        {stateWidgets[key].description}
                      </div>
                    </div>
                    <div className={styles.mask}>
                      {
                        canBeAdd(stateWidgets[key], key) ?
                          <Button type="primary" shape="circle" icon="plus" size="large" onClick={() => addWidget(stateWidgets[key], key)} />
                          :
                          <Tag color="#108ee9">{tr('该小程序最多添加')}{stateWidgets[key].maxLength}{tr('个')}</Tag>
                      }
                    </div>
                  </div>
                )}
              </div>
              :
              <div className="emptyContent" style={{ minHeight: height - 20 }}>
                <Empty
                  description={
                    <span>{tr('该条件下暂无小程序')}</span>
                  }
                />
              </div>
            }
          </div>
        </div>
      </SmartModal>
    </>
  )
}

export default WidgetSelector