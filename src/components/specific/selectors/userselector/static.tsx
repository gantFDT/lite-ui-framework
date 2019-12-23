import React from 'react';
import { GroupSelector } from '@/components/specific';

const columns = [
    {
        title: tr('账号'),
        dataIndex: 'userLoginName',
        key: 'userLoginName',
        fixed: 'left',
        width: 100,
    },
    {
        title: tr('用户名'),
        dataIndex: 'userName',
        key: 'userName',
        fixed: 'left',
        width: 150,
    },
    {
        title: tr('所属组织'),
        dataIndex: 'organizationId',
        key: 'organizationId',
        width: 200,
        render: function (text: any, record: any) {
            return <GroupSelector value={text} allowEdit={false} />
        }
    },
    {
        title: tr('用户类型'),
        dataIndex: 'userType',
        key: 'userType',
        width: 100,
    },
    {
        title: tr('职务说明'),
        dataIndex: 'position',
        key: 'position',
        width: 100,
    }, {
        title: tr('工号'),
        dataIndex: 'staffNumber',
        key: 'staffNumber',
        width: 100,
    }, {
        title: tr('性别'),
        dataIndex: 'gender',
        key: 'gender',
        width: 80,
        render: (text: any) => {
            if (!text) return
            return text == 'MALE' ? tr('男') : text == 'FEMALE' ? tr('女') : '';
        },
    }, {
        title: tr('移动电话'),
        dataIndex: 'mobil',
        key: 'mobil',
        width: 100,
    }, {
        title: tr('固定电话'),
        dataIndex: 'telephone',
        key: 'telephone',
        width: 120,
    }, {
        title: tr('传真'),
        dataIndex: 'fax',
        key: 'fax',
    }, {
        title: tr('邮箱'),
        dataIndex: 'email',
        key: 'email',
        width: 100,
    }
];

const nameKeys = {
    selectorEleKey: 'userSelectorGroupElement',
    modalEleKey: 'userSelectorModalElement',
    dropDownEleKey: 'userSelectorDropDownElement',
    popoverEleKey: 'userSelectorPopoverElement',
}
export { columns, nameKeys };