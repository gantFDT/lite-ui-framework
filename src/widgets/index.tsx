//主仪表板widget
import React, { useEffect, useCallback } from 'react'
import { importModel } from '@/utils/utils'
import event from '@/utils/events'
import Widgets from '@/widgets/items'
import './index.less'

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
    configPanel: false,
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
  ChartCard: {
    icon: 'pie-chart',
    name: tr('图表卡片'),
    description: tr('小型图表') + ',' + tr('关键性信息') + '……',
    configPanel: true,
    maxLength: 4,
    snapShot: Widgets['ChartCard']['snapShot'],
    tags: [tr('全部'), tr('图表')],
    iconBackground: 'linear-gradient(to top, #30cfd0 0%, #330867 100%)',
    rect: {
      defaultWidth: 3,
      defaultHeight: 8,
      maxWidth: 12,
      maxHeight: 16,
      minWidth: 2,
      minHeight: 4
    }
  },
  NumberCard: {
    icon: 'number',
    name: tr('数字卡片'),
    description: tr('关键数字') + ',' + tr('关键性信息') + '……',
    configPanel: true,
    maxLength: 6,
    snapShot: Widgets['NumberCard']['snapShot'],
    tags: [tr('全部'), tr('图表')],
    iconBackground: 'linear-gradient(to right, #b8cbb8 0%, #b8cbb8 0%, #b465da 0%, #cf6cc9 33%, #ee609c 66%, #ee609c 100%)',
    rect: {
      minWidth: 2,
      defaultWidth: 3,
      maxWidth: 12,
      minHeight: 3,
      defaultHeight: 3,
      maxHeight: 4
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
