import { TabPanelSchema } from '@/components/common/tabpanel'
import ApprovelHistory from '@/components/specific/workflow/approvehistory'
import FlowChart from '@/components/specific/workflow/flowchart'
import StartProcessOperationPanel from '@/components/specific/workflow/startprocessoperationpanel'

const schema: TabPanelSchema = [
  {
    tab: tr('流程操作'),
    key: '流程操作',
    component: StartProcessOperationPanel,
    propsNames: ['templateKey', 'processDetail', 'variables', 'resourceName', 'controllerName', 'viewName', 'recTypeId', 'recId', 'height', 'config', 'onStartedSuccess']
  },
  {
    tab: tr('审批历史'),
    key: '审批历史',
    component: ApprovelHistory,
    propsNames: ['processId', 'taskType', 'setIsRereshDipatchLog', 'width', 'height', 'config']
  },
  {
    tab: tr('流程图'),
    key: '流程图',
    component: FlowChart,
    propsNames: ['processId', 'width', 'height', 'templateKey']
  }
]

export default schema
