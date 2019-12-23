import { tr, getLocale } from '@/components/common/formatmessage';
import UserColumn from '@/components/specific/usercolumn';
import { MAINMAP } from '@/pages/sysmgmt/sysrightmanage/menumanage/menutypes';
import { Icon } from 'antd'
import active1 from '@/assets/images/active_1.png'
import active2 from '@/assets/images/active_2.png'

const Locale = getLocale();
const LocaleField = Locale === 'zh-CN' ? 'zh_CN' : 'en';

export const modalScheme = [
  {
    key: 'userLoginName',
    name: tr('登录名'),
    column: true,
    search: true
  },
  {
    key: 'userName',
    name: tr('姓名'),
    search: true
  },
  {
    key: 'id',
    name: tr('姓名'),
    column: true,
    width: 200,
    forceRender: true,
    render: function (text, record, index) {
      const id = text;
      return <UserColumn id={id}></UserColumn>
    }
  },
  {
    key: 'organizationId',
    name: tr('所属组织'),
    type: 'GroupSelector',
    search: true,
    column: true
  },
  {
    key: 'userType',
    name: tr('用户类型'),
    type: 'CodeList',
    props: {
      type: 'FW_USER_TYPE'
    },
    column: true,
  },
  {
    key: 'isActive',
    name: tr('是否有效'),
    type: 'Switch',
    column: true,
    render: (isActive) => isActive ? <span className="successColor"><Icon type="check-circle" /></span> : ""
  },
]

export default [
  {
    dataIndex: 'name',
    fieldName: 'name',
    title: tr('名称'),
    render(text) {
      return JSON.parse(text)[LocaleField]
    }
  },
  {
    dataIndex: 'path',
    fieldName: 'path',
    title: tr('菜单项操作地址'),
  },
  {
    dataIndex: 'type',
    fieldName: 'type',
    title: tr('类型'),
    render(text) {
      return MAINMAP.get(text)
    }
  }
]