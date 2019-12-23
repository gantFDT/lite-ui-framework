
import { SmartSearchCompatibilityModeSchema } from '@/components/specific/smartsearch'
import { faxRegexp, phoneRegexp, landlineRegexp, emailRegexp } from '@/utils/regexp'
export const passwordSchema = {
  password: {
    title: tr('密码'),
    type: 'string',
    props: {
      type: "password",
      autoComplete: "new-password",
      placeholder: tr("输入密码")
    }
  },
  repeatPassword: {
    title: tr('重复密码'),
    type: 'string',
    props: {
      type: "password",
      autoComplete: "new-password",
      placeholder: tr("确认密码")
    }
  },
}
export const userFormSchema = {
  type: "object",
  required: ["userLoginName", "userName", "password", "repeatPassword", "isActive", "userType", "organizationId"],
  propertyType: {
    userLoginName: {
      title: tr('登录名'),
      type: "string",
      props: {
        placeholder: tr("登录名只允许使用大小写字母或数字"),
        disabled: false,
      },
      options: {
        rules: [{
          pattern: /^[A-Za-z0-9]+$/i,
          message: tr("登录名只允许使用大小写字母或数字")
        }]
      }
    },
    userName: {
      title: tr('用户姓名'),
      props: {
        autoComplete: "new-password"
      },
      type: "string"
    },

    isActive: {
      title: tr('是否有效'),
      componentType: "CodeList",
      props: {
        type: 'COMMON_BOOLEAN_TYPE'
      },
      type: "string"
    },
    userType: {
      title: tr('员工类型'),
      componentType: "CodeList",
      props: {
        type: "FW_USER_TYPE"
      },
      type: "string"
    },
    organizationId: {
      title: tr('所属组织'),
      componentType: "GroupSelector",
      type: "string"
    },
    position: {
      title: tr('职务说明'),
      componentType: "TextArea",
      type: "string"
    }
  }
}
export const searchSchema: SmartSearchCompatibilityModeSchema = {
  supportFilterFields: [
    {
      fieldName: "userLoginName",
      title: tr('账号')
    },
    {
      fieldName: 'userName',
      title: tr('用户姓名')
    },
    {
      fieldName: 'organizationId',
      title: tr('所属组织'),
      componentType: "GroupSelector"
    },
    {
      fieldName: 'userType',
      title: tr('用户类型'),
      componentType: "Select",
      props: {
        dataSource: [{
          key: "EMPLOYEE",
          value: "EMPLOYEE",
          label: tr("员工")
        }, {
          key: "SUPPLIER_EMPLOYEE",
          value: "SUPPLIER_EMPLOYEE",
          label: tr("供应商用户")
        }]
      },
    },
    {
      fieldName: 'isActive',
      title: tr('是否有效'),
      componentType: "CodeList",
      props: {
        type:"COMMON_BOOLEAN_TYPE"
      }
    },
    {
      fieldName: "isLock",
      title: tr('是否锁定'),
      componentType: "CodeList",
      props: {
        type:"COMMON_BOOLEAN_TYPE"
      }
    }
  ],
  systemViews: [
    {
      viewId: 'systemViewUser001',
      name: tr("初始视图"),
      version: '2019-10-22 10:29:03',
      panelConfig: {
        searchFields: [
          {
            fieldName: "userLoginName"
          },
          {
            fieldName: 'userName'
          },
          {

            fieldName: "userType"
          },
          {
            fieldName: 'organizationId'
          },
          {
            fieldName: 'isActive'
          },
          {
            fieldName: 'isLock'
          }
        ]
      }
    }
  ]
}
export const userBiscFormSchema = {
  type: "object",
  propertyType: {
    staffNumber: {
      title: tr("工号"),
      type: "string"
    },
    gender: {
      title: tr('性别'),
      componentType: "CodeList",
      props: {
        type: 'FW_USER_GENDER'
      },
      type: "string"
    },
    mobil: {
      title: tr('移动电话'),
      // componentType: "TelePhone",
      type: "string",
      options: {
        rules: [{
          pattern: phoneRegexp,
          message: tr("移动电话格式不正确")
        }]
      }
    },
    telephone: {
      title: tr('固定电话'),
      type: "string",
      options: {
        rules: [{
          pattern: landlineRegexp,
          message: tr("固定电话格式不正确")
        }]
      }
    },
    fax: {
      title: tr('传真'),
      type: "string",
      options: {
        rules: [{
          pattern: faxRegexp,
          message: tr("传真格式不正确")
        }]
      }
    },
    email: {
      title: tr('邮箱'),
      componentType: "Email",
      type: "string",
      options: {
        rules: [{
          pattern: emailRegexp,
          message: tr("邮箱格式不正确")
        }]
      }
    }
  }
}
