import React from 'react'
import { Icon as GantIcon } from 'gantd'
import { Icon } from 'antd'
import UserColumn from '@/components/specific/usercolumn'
import CodeList from '@/components/form/codelist'
import { GroupSelector } from '@/components/specific'
import styles from './style.less'
export const userTableSchema = [
	{
		fieldName: 'userLoginName',
		title: tr('账号'),
	},
	{
		fieldName: 'id',
		title: tr('用户名'),
		render: (id: string, record: any) => id && <UserColumn {...record} />
	},
	{
		fieldName: 'organizationId',
		title: tr('所属组织'),
		render: (text: string) => <GroupSelector value={text} allowEdit={false} showMode="popover"  placeholder=" " />
	},
	{
		fieldName: 'userType',
		title: tr('用户类型'),
		render: (text: string) => <CodeList type="FW_USER_TYPE" value={text} allowEdit={false} placeholder=" " />
	},
	{
		fieldName: 'isActive',
		title: tr('是否有效'),
		render: (isActive: boolean) => isActive ? <span className="successColor"><Icon type="check-circle" /></span> : ""
	},
	{
		fieldName: 'isLock',
		title: tr('是否锁定'),
		render: (isLock: boolean) => isLock ? <span className="dangerColor"><Icon type="lock" /></span> : ''
	},
	{
		fieldName: 'roleCount',
		title: tr('关联角色'),
		render: (count: number) => count > 0 && <span className="primaryColor" ><GantIcon type="icon-jiaoseguanli" /></span>
	},
	{
		fieldName: 'groupCount',
		title: tr('关联用户组'),
		render: (count: number) => count > 0 && <span className="primaryColor" ><GantIcon type="icon-yonghuzuguanli" /></span>
	}
]
export const groupColumns = [
	{
		dataIndex: 'categoryName',
		title: tr('用户组类别'),
	},
	{
		dataIndex: 'groupCode',
		title: tr('用户组编码'),
	},
	{
		dataIndex: 'groupName',
		title: tr('用户组名称'),
	},
	{
		dataIndex: 'fullGroupName',
		title: tr('用户组全限定名'),
	},
	{
		dataIndex: 'roleName',
		title: tr('角色名称'),
	},
	{
		dataIndex: 'roleDesc',
		title: tr('描述'),
	}
]

export const relateRoleSchema = [
	{
		dataIndex: 'roleCode',
		title: tr('角色代码'),
	},
	{
		dataIndex: 'roleName',
		title: tr('角色名称')
	},
	{
		dataIndex: 'roleDesc',
		title: tr('描述'),
	}
]