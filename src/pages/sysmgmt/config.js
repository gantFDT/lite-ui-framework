//运行时配置，会被加载到全局model config

const ORDER = 1;

// 系统配置
const SYSMGMT_CONFIG = {
  user: {
    // 工号的数据格式
    staffNumberFormat: /.*/
  },
  workflow: {  // 确定需要
    // 流程启动时，初始状态是否自动全选所有代办用户
    onStartAutoSelectOwner: false,
    // 流程启动时，初始状态是否自动全选可忽略流程步骤
    onStartAutoSelectSkipStep: false,
    // 流程审批时，初始状态是否自动全选所有代办用户
    onApproveAutoSelectOwner: false,
    // 流程审批时，初始状态是否自动全选可忽略流程步骤
    onApproveAutoSelectSkipStep: false,
    // 允许流程发起人终止流程实例
    allowOwnerStopProcess: true,
    // 流程审批界面审批动作显示效果'select' | 'radio'
    approveActionView: 'select',
    // 显示工作日任务持续时间
    showWorkingKeepTime: false,
    // 待办用户模板运行模式，single：单个模式，multiple：多个模式
    todoUserTemplate: 'multiple',
    // 是否必须填写转派说明
    dispatchComment: false
  }
}


export default {
  SYSMGMT_CONFIG,
  ORDER
}
