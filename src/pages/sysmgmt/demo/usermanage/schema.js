import React from 'react'
import { getUserField } from '@/utils/user';
import { Link } from '@/components/common';
import moment from 'moment';

const format = 'YYYY-MM-DD'

export const gradeObj = {
    A: '一年级',
    B: '二年级',
    C: '三年级',
}

export const classObj = {
    1: '一班',
    2: '二班',
    3: '三班',
}


const tableSchema = [
    {
        fieldName: 'name',
        title: tr('姓名'),
        type: "string",
        render: (text, item) => <Link to={`usermanagement/detail/${item.id}`}>{text}</Link>
    },
    {
        fieldName: 'gender',
        title: tr('性别'),
        render: val => val === 'MALE' ? tr('男') : tr('女'),
        type: "string",
    },
    {
        fieldName: 'age',
        title: tr('年龄'),
        type: "number",
    },
    {
        fieldName: 'birth',
        title: tr('生日'),
        render: (text) => moment(text).format(format),
        type: "string",
    },
    {
        fieldName: 'contactPersonId',
        title: tr('联系人'),
        render: (text) => getUserField({ id: text }),
        type: "string",
    },
    {
        fieldName: 'address',
        title: tr('家庭住址'),
        type: "string",
    },
    {
        fieldName: 'grade',
        title: tr('年级'),
        type: "string",
        render: text => gradeObj[text]
    },
    {
        fieldName: 'classNumber',
        title: tr('班级'),
        render: text => classObj[text],
        type: "string",
    },
    {
        fieldName: 'finalExamScore',
        title: tr('期末得分'),
        type: "number",
    },
    {
        fieldName: 'admissionDate',
        title: tr('入学时间'),
        render: (text) => moment(text).format(format),
        type: "string",
    },
    {
        fieldName: 'agreeUpgrade',
        title: tr('同意升级'),
        render: val => val ? tr('是') : tr('否'),
        type: "string",
    },
    {
        fieldName: 'teacherComment',
        title: tr('教师评语'),
        type: "string",
    }
];

const modalSchema = {
    "type": "object",
    "required": ["name", "gender"],
    "propertyType": {
        name: {
            title: tr('姓名'),
            "type": "string",
            "componentType": "Input",
        },
        gender: {
            title: tr('性别'),
            "type": "string",
            "componentType": "CodeList",
            props: {
                type: 'FW_USER_GENDER'
            }
        },
        age: {
            title: tr('年龄'),
            type: "number",
            componentType: "InputNumber"
        },
        birth: {
            title: tr('生日'),
            type: "date",
            componentType: "DatePicker"
        },
        contactPersonId: {
            title: tr('联系人'),
            componentType: "UserSelector"
        },
        address: {
            title: tr('家庭住址'),
            type: "string",
        },
        grade: {
            title: tr('年级'),
            type: "string",
            componentType: "Select",
            props: {
                dataSource: [{
                    label: "一年级",
                    value: "A"
                }, {
                    label: "二年级",
                    value: "B"
                }, {
                    label: "三年级",
                    value: "C"
                }],
            }
        },
        classNumber: {
            title: tr('班级'),
            type: "string",
            componentType: "Select",
            props: {
                dataSource: [{
                    label: "一班",
                    value: "1"
                }, {
                    label: "二班",
                    value: "2"
                }, {
                    label: "三班",
                    value: "3"
                }],
            }
        },
        finalExamScore: {
            title: tr('期末得分'),
            type: "number",
            componentType: "InputNumber",
            props: {
                max: 100,
                min: 0
            }
        },
        admissionDate: {
            title: tr('入学时间'),
            type: "date",
            componentType: "DatePicker"
        },
        agreeUpgrade: {
            title: tr('同意升级'),
            type: "number",
            "componentType": "CodeList",
            props: {
                type: 'COMMON_BOOLEAN_TYPE'
            }
        },
        teacherComment: {
            title: tr('教师评语'),
            type: "string",
            componentType: "TextArea"
        }
    }
}

const searchPanelId = 'test_student|v1'

export { tableSchema, modalSchema, searchPanelId }
