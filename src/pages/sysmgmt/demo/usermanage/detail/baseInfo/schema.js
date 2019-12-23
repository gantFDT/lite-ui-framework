const formSchema= {
    type: "object",
    propertyType: {
        base: {
            title: tr("个人信息"),
            type: "object",
            propertyType: {
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
                    componentType: "InputNumber",
                },
                birth: {
                    title: tr('生日'),
                    type: "date",
                    componentType: "DatePicker",
                }
            }
        },
        contact: {
            title: "联系方式",
            type: "object",
            propertyType: {
                contactPersonId: {
                    title: tr('联系人'),
                    componentType: "UserSelector",
                },
                address: {
                    title: tr('家庭住址'),
                    type: "string",
                }
            }
        },
        school: {
            title: "在校信息",
            type: "object",
            propertyType: {
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
                }
            }
        },
        teacher: {
            title: "学生状态",
            type: "object",
            propertyType: {
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
    }
}

const tableSchema = [
    {
        fieldName: 'week',
        title: tr('学周'),
    },
    {
        fieldName: 'chinese',
        title: tr('语文'),
    },
    {
        fieldName: 'math',
        title: tr('数学'),
    },
    {
        fieldName: 'english',
        title: tr('英语'),
    },
    {
        fieldName: 'chemistry',
        title: tr('化学'),
    },
    {
        fieldName: 'physics',
        title: tr('物理'),
    },
    {
        fieldName: 'biology',
        title: tr('生物'),
    },
    {
        fieldName: 'art',
        title: tr('美术'),
    },
    {
        fieldName: 'music',
        title: tr('音乐'),
    },
    {
        fieldName: 'sport',
        title: tr('体育'),
    },
]

const anchorList = [
	{
		id: 'base',
		title: tr('基本信息'),
		type:'form',
		required: ['gender','age','birth'],
	},
	{
		id: 'contact',
		title: tr('联系方式'),
        type:'form',
        required:['contactPersonId','address'],
	},
	{
		id: 'school',
		title: tr('在校信息'),
        type:'form',
        required: ['grade','classNumber','finalExamScore'],
    },
    {
		id: 'teacher',
		title: tr('学生状态'),
        type:'form',
        required: ['agreeUpgrade','teacherComment'],
	},
	{
		id: 'statisticalScores',
		title: tr('成绩统计'),
		type:'table',
		dataSourceName:'tableData',
		required:true
	}
]
export { formSchema, tableSchema, anchorList }