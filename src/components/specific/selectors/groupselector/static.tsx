const fields = [
    {
        label: tr('组织编码'),
        dataIndex: "orgCode",
        key: "orgCode",
    },
    {
        label: tr('组织类型'),
        dataIndex: "orgType",
        key: "orgType",
    },
    {
        label: tr('组织名称'),
        dataIndex: "orgName",
        key: "orgName",
    },
    {
        label: tr('组织简称'),
        dataIndex: "orgSimpleName",
        key: "orgSimpleName",
    },
    {
        label: tr('组织英文名称'),
        dataIndex: "orgNameEn",
        key: "orgNameEn",
    },
    {
        label: tr('组织英文简称'),
        dataIndex: "orgSimpleNameEn",
        key: "orgSimpleNameEn",
    },
    {
        label: tr('电话'),
        dataIndex: "telephone",
        key: "telephone",
    },
    {
        label: tr('传真'),
        dataIndex: "fax",
        key: "fax",
    },
    {
        label: tr('电子邮箱'),
        dataIndex: "email",
        key: "email",
    },
    {
        label: tr('组织职能'),
        dataIndex: "description",
        key: "description",
    },
]

const nameKeys = {
    selectorEleKey: 'groupSelectorGroupElement',
    modalEleKey: 'groupSelectorModalElement',
    dropDownEleKey: 'groupSelectorDropDownElement',
    popoverEleKey: 'groupSelectorPopoverElement',
}

export { fields, nameKeys }