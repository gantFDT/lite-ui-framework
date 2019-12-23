import React from 'react'
import moment from 'moment'
import { DatePicker, Switch, Input as AntInput } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { Input, EditStatus, InputNumber, RangePicker, Select, Url, Location, TelePhone, CellPhone, Email, InputLang, InputMoney } from 'gantd'
import { isEmpty } from 'lodash'
import { GroupSelector, UserSelector, RoleSelector, UserGroupSelector, UserColumn } from '@/components/specific'
import { FileUpload, ImageUpload, CodeList } from '@/components/form'
import { getType } from '@/utils/utils';

export interface SchemaProps<R> extends ColumnProps<R> {
  fieldName: string,
  type?: 'string' | 'number' | 'date' | 'boolean' | 'codelist' | 'object',
  componentType?: string | React.ReactNode, // 组件渲染类型
  props?: any,  // 组件渲染的嵌入属性
  hideColumn?: boolean, // 是否隐藏列显示
  render?: (text: any, record: R, index: number) => React.ReactNode,
  [prop: string]: any,
}

function generColumn<R>(schema: SchemaProps<R>): ColumnProps<R> {
  let fakeColumn = { dataIndex: schema.fieldName, ...schema };
  if (!schema.render) {
    switch (schema.componentType) {
      case 'CodeList':
      case 'GroupSelector':
      case 'UserSelector':
        fakeColumn.render = (text) => mapComponents(schema.componentType, {
          ...schema.props,
          value: text,
          allowEdit: false
        })
        break;
      case 'Switch':
        fakeColumn.render = (text) => tr(text ? '是' : '否')
        break;
      case 'UserColumn':
        fakeColumn.render = (text) => mapComponents('UserColumn', { id: text })
        break;
      default:
        break;
    }
  }
  if (fakeColumn.children && !isEmpty(fakeColumn.children)) {
    fakeColumn.children = fakeColumn.children.map((childColumn: SchemaProps<R>) => generColumn(childColumn))
  }
  return fakeColumn;
}

const mapComponents = (ComponentName: string, props: object) => {
  if (ComponentName && getType(ComponentName) !== 'String') {
    return ComponentName;
  }
  switch (ComponentName) {
    case 'DatePicker': return <DatePicker {...props} />
    case 'Input': return <AntInput {...props} />
    case 'Switch': return <Switch {...props} />
    case 'TextArea': return <AntInput.TextArea {...props} />
    case 'CodeList': return <CodeList {...props} />
    case 'UserSelector': return <UserSelector {...props} />
    case 'GroupSelector': return <GroupSelector {...props} />
    case 'RoleSelector': return <RoleSelector {...props} />
    case 'UserGroupSelector': return <UserGroupSelector {...props} />
    case 'UserColumn': return <UserColumn {...props} />
    // Gant
    case 'Number': return <InputNumber  {...props} />;
    case 'DateRange': return <RangePicker {...props} />;
    case 'Select': return <Select {...props} />;
    case 'Url': return <Url {...props} />;
    case 'Location': return <Location  {...props} />;
    case 'TelePhone': return <TelePhone {...props} />;
    case 'CellPhone': return <CellPhone {...props} />;
    case 'Email': return <Email {...props} />;
    case 'ImageUpload': return <ImageUpload  {...props} />;
    case 'FileUpload': return <FileUpload  {...props} />;
    case 'InputLang': return <InputLang {...props} />;
    case 'InputMoney': return <InputMoney {...props} />;
    default: return <Input {...props} />
  }
};

export function generColumns<R>(schemas: SchemaProps<R>[]) {
  let columns: ColumnProps<R>[] = [],
    columnKeys: any[] = [];

  schemas.forEach(schema => {
    if (!schema.fieldName || !schema.title) {
      throw new Error(tr('SmartTable的schema属性为{ fieldName, title, ... }, 具体参照：https://gant.yuque.com/fdt/gantreact/hyeday'))
    }
    columns.push(generColumn(schema))
    columnKeys.push({
      dataIndex: schema.fieldName,
      title: schema.title,
      checked: !schema.hideColumn,
      lock: !!schema.fixed,
      fixed: schema.fixed,
      align: schema.align || 'left'
    })
  })

  return {
    columns,
    columnKeys,
  }
}