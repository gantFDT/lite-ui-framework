import React from 'react';
import { Button, Icon, Empty, Col, Tag } from 'antd';
import { Responsive, WidthProvider } from 'react-grid-layout';
import styles from './index.less'
import { widgets } from '@/widgets'

import classnames from 'classnames'
import { getWidgetType } from '@/widgets/utils'


const ResponsiveReactGridLayout: any = WidthProvider(Responsive);


interface dashboard {
  currentLayout: object[];
  [propname: string]: any;
}

const Comp = (props: dashboard) => {
  const {
    dashboard,
    currentLayout = [],
    style,
    extra,
    className,
    onClick,
    onSelectClick,
    useMode,
    span = 3
  } = props;

  return (
    <Col className={classnames(className, styles.dashboardWrap)} style={{ width: `calc((100% / ${span}) - 10px)` }}>
      {_.isArray(currentLayout) && !_.isEmpty(currentLayout) ? <div className={classnames(styles.wrap, 'dashboardItem')} style={{ height: 200, width: 200 }} onClick={onClick}>
        <div className={classnames(styles.container, 'widgetReact')}
          style={{
            width: '1440px',
            transform: `scale(calc(180 / 1440))`
          }}
        >
          <ResponsiveReactGridLayout
            className='layout'
            layouts={{ lg: currentLayout }}
            rowHeight={30}
            isDraggable={false}
            breakpoints={{ lg: 1200, md: 800, sm: 600, xs: 400, xxs: 300 }}
            cols={{ lg: 12, md: 12, sm: 2, xs: 2, xxs: 2 }}
            // onBreakpointChange={onBreakpointChange} //断点回调
            onLayoutChange={() => { }}    //布局改变回调
            isResizable={false}      //准许改变大小
            // onWidthChange={()=>onWidthChange()}  //宽度改变回调
            measureBeforeMount={true}              //动画相关
          >
            {currentLayout.map((item: any) => {
              return <div key={item.i} className={classnames('ant-card', 'reactgriditem')}>
                {widgets[getWidgetType(item.i)] ?
                  <div className={styles.widget} style={{ height: item.h * 40 - 10, backgroundImage: `${item.iconBackground}`, }}>
                    <Icon type={item['icon']} />
                  </div>
                  : <div className="aligncenter full">
                    {tr('数据有误')}{getWidgetType(item.i)}
                  </div>
                }
              </div>
            }
            )}

          </ResponsiveReactGridLayout>

        </div>
        <div className={styles.mask}>
        </div>
      </div>
        :
        <div className="emptyContent" style={{ height: 170 }} onClick={onClick}>
          <Empty
            description=''
          >
          </Empty>
        </div>
      }
      <div onClick={onClick} style={{ height: 200, flex: 1 }}>
        <div className={styles.content}>
          <div className={classnames(styles.title)}>{dashboard['name']}</div>
          {dashboard['id'] === 'default' && <Tag className="marginv5">{tr('系统默认')}</Tag>}
          <div className={classnames(styles.description, 'webkit')}>{dashboard['description']}</div>
        </div>
        {extra}
      </div>
      {useMode && <div className={styles['mask-render']}>
        <Button type="primary"
          onClick={() => onSelectClick(dashboard)}>{tr('选择')}</Button>
      </div>}
    </Col>
  )
}

export default Comp