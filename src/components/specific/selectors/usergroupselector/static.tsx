const categoryColumns = [
    {
        key: 'categoryCode',
        dataIndex: 'categoryCode',
        title: tr('编码'),
    },
    {
        key: 'categoryName',
        dataIndex: 'categoryName',
        title: tr('名称'),
    }
]

const groupColumns = [
    {
        key: 'groupCode',
        dataIndex: 'groupCode',
        title: tr('编码'),
    },
    {
        key: 'groupName',
        dataIndex: 'groupName',
        title: tr('名称'),
    },
    {
        key: 'groupDesc',
        dataIndex: 'groupDesc',
        title: tr('描述'),
    }
]

const nameKeys = {
    selectorEleKey: 'userGroupSelectorElement',
    modalEleKey: 'userGroupSelectorModal',
    dropDownEleKey: 'userGroupSelectorDropDownElement',
}
export { categoryColumns, groupColumns, nameKeys }