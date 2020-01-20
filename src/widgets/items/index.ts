import LogoBand, { SnapShot as LogoBandSnapShot, modelRegisterKey as LogoBandModelRegisterKey } from './logoband'
import Clock, { SnapShot as ClockSnapShot, modelRegisterKey as ClockModelRegisterKey } from './clock'
import Carousel, { SnapShot as CarouselSnapShot, modelRegisterKey as CarouselModelRegisterKey } from './carousel'
import Shortcut, { SnapShot as ShortcutSnapShot, modelRegisterKey as ShortcutModelRegisterKey } from './shortcut'
import UserCard, { SnapShot as UserCardSnapShot, modelRegisterKey as UserCardModelRegisterKey } from './usercard'
import SmartChart, { SnapShot as SmartChartSnapShot, modelRegisterKey as SmartChartModelRegisterKey } from './smartchart'
import SmartTable, { SnapShot as SmartTableSnapShot, modelRegisterKey as SmartTableModelRegisterKey } from './smarttable'
import TodoList, { SnapShot as TodoListSnapShot, modelRegisterKey as TodoListModelRegisterKey } from './todolist'
import ChartCard, { SnapShot as ChartCardSnapShot, modelRegisterKey as ChartCardModelRegisterKey } from './chartcard'
import NumberCard, { SnapShot as NumberCardSnapShot, modelRegisterKey as NumberCardModelRegisterKey } from './numbercard'


export default {
  LogoBand: {
    component: LogoBand,
    snapShot: LogoBandSnapShot,
    modelRegisterKey: LogoBandModelRegisterKey,
  },
  Clock: {
    component: Clock,
    snapShot: ClockSnapShot,
    modelRegisterKey: ClockModelRegisterKey,
  },
  Carousel: {
    component: Carousel,
    snapShot: CarouselSnapShot,
    modelRegisterKey: CarouselModelRegisterKey,
  },
  Shortcut: {
    component: Shortcut,
    snapShot: ShortcutSnapShot,
    modelRegisterKey: ShortcutModelRegisterKey,
  },
  UserCard: {
    component: UserCard,
    snapShot: UserCardSnapShot,
    modelRegisterKey: UserCardModelRegisterKey,
  },
  SmartChart: {
    component: SmartChart,
    snapShot: SmartChartSnapShot,
    modelRegisterKey: SmartChartModelRegisterKey,
  },
  SmartTable: {
    component: SmartTable,
    snapShot: SmartTableSnapShot,
    modelRegisterKey: SmartTableModelRegisterKey,
  },
  TodoList: {
    component: TodoList,
    snapShot: TodoListSnapShot,
    modelRegisterKey: TodoListModelRegisterKey,
  },
  ChartCard: {
    component: ChartCard,
    snapShot: ChartCardSnapShot,
    modelRegisterKey: ChartCardModelRegisterKey,
  },
  NumberCard: {
    component: NumberCard,
    snapShot: NumberCardSnapShot,
    modelRegisterKey: NumberCardModelRegisterKey,
  },


}
