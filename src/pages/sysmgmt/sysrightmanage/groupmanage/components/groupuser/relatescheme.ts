import { tr } from '@/components/common/formatmessage';
import { SearchFormSchema } from '@/components/specific/searchform'


const searchSchema: SearchFormSchema = {
  userLoginName: {
    title: tr('登录名')
  },
  userName: {
    title: tr('姓名'),
  },
  organizationId: {
    title: tr('所属组织'),
    componentType: 'GroupSelector',
  },
}
export { searchSchema }