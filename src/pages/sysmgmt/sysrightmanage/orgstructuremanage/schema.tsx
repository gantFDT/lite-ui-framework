
import React from 'react';
import { UISchema } from '@/components/form/schema';
import UserColumn from '@/components/specific/usercolumn';
import { GroupSelector } from '@/components/specific/selectors';
import { Icon } from 'antd';

export const smartTableListSchema = [
	{
		"fieldName": "orgName",
		"title": tr("组织名称")
	}, {
		"fieldName": "orgCode",
		"title": tr("组织编码")
	},
];

export const smartTableUserSchema = [
	{
		"fieldName": "userLoginName",
		"title": tr("登录名")
	}, {
		"fieldName": "userName",
		"title": tr("姓名"),
		render: (text: string, record: any) => <UserColumn {...record} />
	}, {
		"fieldName": "organizationId",
		"title": tr("所属组织"),
		render: (text: string) => <GroupSelector value={text} allowEdit={false} showMode="popover" />
	}, {
		"fieldName": "userType",
		"title": tr("用户类型"),
		"componentType": "CodeList",
		"props": {
			"type": "FW_USER_TYPE"
		},
	}, {
		"fieldName": "isActive",
		"title": tr("是否有效"),
		"width": 60,
		"align": "center",
		render: (isActive: boolean) => isActive ? <span className="successColor"><Icon type="check-circle" /></span> : ""
	},
];

export const searchUISchema: UISchema = {
	"ui:col": 24,
	"ui:labelCol": {},
	"ui:wrapperCol": {}
};

export const listModalSchema = {
	"type": "object",
	"required": [
		"orgCode",
		"orgType",
		"orgName",
	],
	"propertyType": {
		"orgCode": {
			"type": "string",
			"title": tr('组织编码'),
		},
		"orgType": {
			"type": "string",
			"title": tr('组织类型'),
			"componentType": "CodeList",
			props: {
				type: 'FW_ORGANIZATION_TYPE'
			}
		},
		"orgName": {
			"type": "string",
			"title": tr('组织名称'),
		},
		"orgSimpleName": {
			"type": "string",
			"title": tr('组织简称'),
		},
		"orgNameEn": {
			"type": "string",
			"title": tr('组织英文名称'),
		},
		"orgSimpleNameEn": {
			"type": "string",
			"title": tr('组织英文简称'),
		},
		"telephone": {
			"type": "string",
			"title": tr('电话'),
		},
		"fax": {
			"type": "string",
			"title": tr('传真'),
		},
		"email": {
			"type": "string",
			"title": tr('电子邮箱'),
			"componentType": "Email"
		},
		"description": {
			"type": "string",
			"title": tr('组织职能'),
			"componentType": "TextArea",
			props: {
				rows: 1,
				autoSize: { maxRows: 10 }
			}
		},
	}
}

export const detailContentUiSchema: UISchema = {
	"ui:col": {
		xs: 24,
		sm: 24,
		md: 12,
		lg: 8,
		xl: 8,
		xxl: 6,
	},
	description: {
		"ui:col": {
			xs: 24,
			sm: 24,
			md: 12,
			lg: 24,
			xl: 24,
			xxl: 18,
		},
	},
	"ui:labelCol": {},
	"ui:wrapperCol": {}
};