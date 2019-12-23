//主仪表板widget
import React, { useEffect, useCallback } from 'react'
import { importModel } from '@/utils/utils'
import event from '@/utils/events'
import Widgets from '@/widgets/items'

const widgets = {
  LogoBand: {
    icon: 'copyright',
    name: tr('企业信息'),
    description: tr('企业简要信息面板') + ',' + tr('包含企业名称') + ',' + tr('企业文化简要'),
    maxLength: 1,
    snapShot: Widgets['LogoBand']['snapShot'],
    tags: [tr('全部'), tr('其他')],
    iconBackground: 'linear-gradient(60deg, #29323c 0%, #485563 100%)',
    rect: {
      defaultWidth: 4,
      defaultHeight: 5,
      maxWidth: 12,
      maxHeight: 16,
      minWidth: 2,
      minHeight: 4
    }
  },
  Shortcut: {
    icon: 'appstore',
    name: tr('快捷方式'),
    description: tr('快捷方式可以快速到达某个业务页面'),
    configPanel: true,
    maxLength: 1,
    snapShot: Widgets['Shortcut']['snapShot'],
    tags: [tr('全部'), tr('其他')],
    iconBackground: 'linear-gradient(-60deg, #ff5858 0%, #f09819 100%)',
    rect: {
      defaultWidth: 4,
      defaultHeight: 5,
      maxWidth: 12,
      maxHeight: 16,
      minWidth: 2,
      minHeight: 4
      // tslint:disable-next-line: trailing-comma
    }
  },
  Carousel: {
    icon: 'picture',
    name: tr('轮播导航'),
    description: `${tr('轮播导航一般可做显示管理员配置的公告信息')},${tr('快捷自定义地址导航')},${tr('广告等')}`,
    configPanel: true,
    maxLength: 1,
    snapShot: Widgets['Carousel']['snapShot'],
    tags: [tr('全部'), tr('其他')],
    iconBackground: 'linear-gradient(to top, #ff0844 0%, #ffb199 100%)',
    rect: {
      defaultWidth: 4,
      defaultHeight: 5,
      maxWidth: 12,
      maxHeight: 16,
      minWidth: 2,
      minHeight: 4
    }
  },
  Clock: {
    icon: 'clock-circle',
    name: tr('时钟'),
    description: tr('显示当前系统时间') + ',' + tr('日期') + ',' + tr('星期'),
    configPanel: false,
    maxLength: 1,
    snapShot: Widgets['Clock']['snapShot'],
    tags: [tr('全部'), tr('其他')],
    iconBackground: 'linear-gradient(-20deg, #b721ff 0%, #21d4fd 100%)',
    rect: {
      defaultWidth: 4,
      defaultHeight: 5,
      maxWidth: 12,
      maxHeight: 16,
      minWidth: 2,
      minHeight: 4
    }
  },
  UserCard: {
    icon: 'idcard',
    name: tr('我的'),
    description: tr('当前用户卡片') + ',' + tr('可快速跳转个人设置') + '……',
    configPanel: false,
    maxLength: 1,
    snapShot: Widgets['UserCard']['snapShot'],
    tags: [tr('全部'), tr('其他')],
    iconBackground: 'linear-gradient(to top, #4481eb 0%, #04befe 100%)',
    rect: {
      defaultWidth: 3,
      defaultHeight: 8,
      maxWidth: 12,
      maxHeight: 16,
      minWidth: 2,
      minHeight: 4
    }
  },
  SmartChart: {
    icon: 'bar-chart',
    name: tr('智能图表'),
    description: tr('动态的图表小程序') + ',' + tr('可快速配置想要统计的业务信息图表') + tr('主要用作数据分析'),
    configPanel: true,
    maxLength: 10,
    snapShot: Widgets['SmartChart']['snapShot'],
    tags: [tr('全部'), tr('图表')],
    iconBackground: 'linear-gradient(to right, #fa709a 0%, #fee140 100%)',
    rect: {
      defaultWidth: 6,
      defaultHeight: 8,
      maxWidth: 12,
      maxHeight: 16,
      minWidth: 2,
      minHeight: 4
    }
  },
  SmartTable: {
    icon: 'table',
    name: tr('智能表格'),
    description: tr('动态的表格小程序') + ',' + tr('可快速配置想要统计的业务信息表格') + tr('主要用作数据简要信息展示'),
    configPanel: true,
    maxLength: 10,
    snapShot: Widgets['SmartTable']['snapShot'],
    tags: [tr('全部'), tr('列表')],
    iconBackground: 'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)',
    rect: {
      defaultWidth: 6,
      defaultHeight: 8,
      maxWidth: 12,
      maxHeight: 16,
      minWidth: 2,
      minHeight: 4
    }
  },
  TodoList: {
    icon: 'schedule',
    name: tr('待处理任务'),
    description: tr('当前用户待处理的任务') + ',' + tr('可快进行转派') + ',' + tr('审批'),
    configPanel: false,
    maxLength: 1,
    snapShot: Widgets['TodoList']['snapShot'],
    tags: [tr('全部'), tr('列表')],
    iconBackground: 'linear-gradient(to top, #0ba360 0%, #3cba92 100%)',
    rect: {
      defaultWidth: 6,
      defaultHeight: 8,
      maxWidth: 12,
      maxHeight: 16,
      minWidth: 2,
      minHeight: 4
    }
  }
};



interface WidgetProps {
  widgetKey: string;
  widgetType: string;
  itemHeight: number;
  editMode: boolean;
  handleDeleteWidget?: Function;
}

//widget渲染器
const Widget = (props: WidgetProps) => {
  const { widgetType } = props;
  //动态注册widget所需的model
  const registerModel = useCallback(() => {
    if (Widgets[widgetType]['modelRegisterKey']) {
      import('./' + `items/${widgetType.toLowerCase()}/model`).then(m => {
        importModel(m, () => event.emit(Widgets[widgetType]['modelRegisterKey']))
      });
    }
  }, [widgetType, Widgets])

  useEffect(() => {
    registerModel()
  }, [])

  return (
    <>
      {React.createElement(Widgets[widgetType]['component'], { ...props })}
    </>
  )
}



//Widget 为小程序组件， widget为小程序数据集合集合
export { Widget, widgets }
