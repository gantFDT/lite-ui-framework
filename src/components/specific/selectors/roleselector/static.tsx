const fields = [
    {
        label: tr('角色代码'),
        dataIndex: "roleCode",
        key: "roleCode",
    },
    {
        label: tr('角色名称'),
        dataIndex: "roleName",
        key: "roleName",
    },
    {
        label: tr('描述'),
        dataIndex: "roleDesc",
        key: "roleDesc",
    },
]

const nameKeys = {
    selectorEleKey: 'roleSelectorElement',
    modalEleKey: 'roleSelectorModalElement',
    dropDownEleKey: 'roleSelectorDropDownElement',
    popoverEleKey: 'roleSelectorPopoverElement',
}
export { fields, nameKeys }