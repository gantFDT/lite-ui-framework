import { TabPanelSchema } from '@/components/common/tabpanel'
import ApproveTaskOperationPanel from '../approvetaskoperationpanel'
import ApprovelHistory from '../approvehistory'
import DispatchLog from '../dispatchlog'
import CommentFeedback from '../commentfeedback'
import FlowChart from '../flowchart'

const schema: TabPanelSchema = [
  {
    tab: tr('流程操作'),
    key: '流程操作',
    component: ApproveTaskOperationPanel,
    propsNames: ['processId', 'taskId', 'userLoginName', 'feedback', 'onClose', 'refresh', 'feedbacks', 'height']
  },
  {
    tab: tr('意见反馈'),
    key: '意见反馈',
    component: CommentFeedback,
    propsNames: ['processId', 'setFeedbacks', 'width', 'height']
  },
  {
    tab: tr('审批历史'),
    key: '审批历史',
    component: ApprovelHistory,
    propsNames: ['processId', 'taskType', 'setIsRereshDipatchLog', 'width', 'height']
  },
  {
    tab: tr('转派日志'),
    key: '转派日志',
    component: DispatchLog,
    propsNames: ['processId', 'isRereshDipatchLog', 'width', 'height']
  },
  {
    tab: tr('流程图'),
    key: '流程图',
    component: FlowChart,
    propsNames: ['processId', 'width', 'height']
  }
]

export default schema
