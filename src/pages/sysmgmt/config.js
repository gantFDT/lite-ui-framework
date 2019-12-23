import FilterDemo1 from '@/pages/sysmgmt/sysrightmanage/datapermission/demo/FilterDemo'

import { UserSelector, UserGroupSelector, RoleSelector, GroupSelector } from '@/components/specific'

import { getUserInfo } from '@/utils/user'
import { getRoleInfo } from '@/utils/role'
import { getOrganizationInfo } from '@/utils/organization'


// 动态图表、表格注册信息
import { searchPanelId as studentsearchPanelId } from '@/pages/sysmgmt/demo/usermanage/schema'
import { searchPanelId as currentProcessSearchPanelId } from '@/pages/sysmgmt/accountcenter/currentprocess/schema'


const { View: UserSelectorView } = UserSelector
const { View: UserGroupSelectorView } = UserGroupSelector
const { View: RoleSelectorView } = RoleSelector
const { View: GroupSelectorView } = GroupSelector

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

// 数据级权限配置信息
const DATA_ACL_CONFIG = {
  registerDomain: [
    {
      code: 'DEMO_00_DOMAIN',
      label: `${tr('数据级权限')}DEMO_0`,
      icon: 'icon-houtairenwuguanli'
    },
    {
      code: 'DEMO_01_DOMAIN',
      label: `${tr('数据级权限')}DEMO_1`,
      icon: ''
    },
    {
      code: 'DEMO_02_DOMAIN',
      label: `${tr('数据级权限')}DEMO_2`,
      icon: ''
    },
    {
      code: 'test02DomainAclHandle',
      label: `${tr('测试业务对象')}02`,
      icon: 'icon-houtairenwuguanli'
    }
  ],
  registerFilter: [
    {
      code: 'DEMO_01_FILTER',
      label: (parameter = '') => {
        let text = '';
        if (parameter) {
          text = `-${parameter}`
        }
        return tr('记录创建人') + parameter
      },
      view: FilterDemo1
    },
    {
      code: 'TEST_02_FILTER',
      label: (parameter = '') => {
        return tr('测试过滤器')
      },
      view: null
    }
  ],
  registerTarget: [
    {
      code: 'DEMO_01_TARGET',
      label: (parameter = '') => {
        return tr('责任人')
      },
      view: null
    },
    {
      code: 'DEMO_02_TARGET',
      label: (parameter = '') => {
        return tr('责任人上级')
      },
      view: null
    },
    {
      code: 'DEMO_03_TARGET',
      label: (parameter = '') => {
        return tr('公司总经理')
      },
      view: null
    },
    {
      code: 'DEMO_04_TARGET',
      label: (parameter = '') => {
        return tr('公司主管')
      },
      view: null
    },
    {
      code: 'DEMO_05_TARGET',
      label: (parameter = '') => {
        return tr('直属部门主管')
      },
      view: null
    },
    {
      code: 'DEMO_06_TARGET',
      label: (parameter = '') => {
        return tr('责任部门')
      },
      view: null
    },
    {
      code: 'DEMO_07_TARGET',
      label: (parameter = '') => {
        return tr('责任部门上级')
      },
      view: null
    },
    {
      code: 'DEMO_08_TARGET',
      label: (parameter = '') => {
        return tr('责任部门下级')
      },
      view: null
    },
    {
      code: 'DEMO_09_TARGET',
      label: (parameter = '') => {
        return tr('查看部门')
      },
      view: null
    },
    {
      code: 'DEMO_10_TARGET',
      label: (parameter = '') => {
        return tr('查看部门下级')
      },
      view: null
    },
    {
      code: 'DEMO_11_TARGET',
      label: (parameter = '') => {
        return tr('查看部门下级')
      },
      view: null
    }
  ],
  registerAction: [
    {
      code: 'DA01',
      label: tr('指定责任人')
    },
    {
      code: 'DA02',
      label: tr('删除记录')
    },
    {
      code: 'DA03',
      label: tr('新增记录')
    },
    {
      code: 'DA04',
      label: tr('查看内容')
    },
    {
      code: 'DA05',
      label: tr('编辑内容')
    }
  ]
}

const SMART_CHART_DOMAIN = [{
  domain: 'student',
  title: '学生',
  searchPanelId: studentsearchPanelId,
  searchMode: 'advanced',
  queryUrl: '/studentHibernate/smartChart',
  searchSchemaPath: 'sysmgmt/demo/usermanage/studentschema',
  columnsPath: 'sysmgmt/demo/usermanage/schema',
}]

const SMART_TABLE_DOMAIN = [{
  domain: 'student',
  title: '学生',
  searchPanelId: studentsearchPanelId,
  searchMode: 'advanced',
  queryUrl: '/studentHibernate/smartQuery',
  searchSchemaPath: 'sysmgmt/demo/usermanage/studentschema',
  columnsPath: 'sysmgmt/demo/usermanage/schema',
}, {
  domain: 'sysmgmtCurrentProcess',
  title: '待处理任务',
  searchPanelId: currentProcessSearchPanelId,
  searchMode: 'normal',
  queryUrl: '/workflowProcess/findProcessTasks',
  searchSchemaPath: 'sysmgmt/accountcenter/currentprocess/schema',
  columnsPath: 'sysmgmt/accountcenter/currentprocess/schema',
}]


export default {
  SYSMGMT_CONFIG,
  DATA_ACL_CONFIG,
  SMART_CHART_DOMAIN,
  SMART_TABLE_DOMAIN,
  ORDER
}
