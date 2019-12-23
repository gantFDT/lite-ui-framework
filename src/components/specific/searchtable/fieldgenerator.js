import React, { Component } from 'react'
import { DatePicker, Switch, Input as AntInput } from 'antd'
import {
  Input,
  EditStatus,
  InputNumber,
  RangePicker,
  Select,
  Url,
  Location,
  TelePhone,
  CellPhone,
  Email,
  InputLang,
  InputMoney,
} from 'gantd'
import moment from 'moment'
import { CodeList } from '@/components/form'
import { isEmpty } from 'lodash'
import { GroupSelector, UserSelector, RoleSelector, UserGroupSelector, UserColumn } from '@/components/specific'
import { FileUpload, ImageUpload } from '@/components/form'
// import { tr } from '@/components/common';
import { getType } from '@/utils/utils';

const generColumn = (field) => {
  if(!field.render){
    switch (field.type) {
      case 'CodeList':
      case 'GroupSelector':
      case 'UserSelector':
        field.render = (text) => mapComponents(field.type,{
          ...field.props,
          value: text,
          allowEdit: false
        })
        break;
      case 'Switch':
        field.render = (text) => tr(text?'是':'否')
        break;
      case 'UserColumn':
        field.render = (text) => mapComponents(field.type,{id:text})
        break;
      default:
        break;
    }
  }
  if(!isEmpty(field.children)){
    field.children = field.children.map(childField=>generColumn(childField))
  }
  return {
    // align:'left',
    ...field,
    title: field.name,
    dataIndex: field.key
  }
}

export const mapComponents = (ComponentName,props) => {
  if(ComponentName&&getType(ComponentName)!=='String'){
    return ComponentName;
  }
  props.edit = EditStatus[props.status];
  switch (ComponentName) {
    case 'DatePicker': return <DatePicker {...props}/>
    case 'Input': return <AntInput {...props}/>
    case 'Switch': return <Switch {...props}/>
    case 'TextArea': return <AntInput.TextArea {...props}/>
    case 'CodeList': return <CodeList {...props}/>
    case 'UserSelector': return <UserSelector {...props}/>
    case 'GroupSelector': return <GroupSelector {...props}/>
    case 'RoleSelector': return <RoleSelector {...props}/>
    case 'UserGroupSelector': return <UserGroupSelector {...props}/>
    case 'UserColumn': return <UserColumn {...props}/>
    // Gant
    case 'Number': return <InputNumber  {...props}/>;
    case 'DateRange': return <RangePicker {...props}/>;
    case 'Select': return <Select {...props}/>;
    case 'Url': return <Url {...props}/>;
    case 'Location': return <Location  {...props}/>;
    case 'TelePhone': return <TelePhone {...props}/>;
    case 'CellPhone': return <CellPhone {...props}/>;
    case 'Email': return <Email {...props}/>;
    case 'ImageUpload': return <ImageUpload  {...props}/>;
    case 'FileUpload': return <FileUpload  {...props}/>;
    case 'InputLang': return <InputLang {...props}/>;
    case 'InputMoney': return <InputMoney {...props}/>;
    default: return <Input {...props}/>
  }
};

export const generValues = (values,fieldsMap) => {
  for (const _key in values) {
    const _field = fieldsMap[_key],
      _value = values[_key];
    if(_value){
      switch (_field.type) {
        case 'DatePicker':
          const { props: { format = 'YYYY-MM-DD'} = {} } = _field;
          if(_value instanceof moment){
            values[_key] = _value.format(format);
          }else{
            values[_key] = moment(_value).format(format);
          }
          break;
        default:
          break;
      }
    }
  }
  return values;
}

export const enterValues = (values,fieldsMap) => {
  for (const _key in values) {
    const _field = fieldsMap[_key],
      _value = values[_key];
    if(_value){
      switch (_field.type) {
        case 'DatePicker':
          values[_key] = moment(_value)
          break;
        default:
          break;
      }
    }
  }
  return values;
}

export const generFields = (scheme) =>{
  let fieldsMap = {},
    columns = [],
    filterFields = [],
    createFields = [],
    updateFields = [];

  fieldsMap = scheme.reduce((total,cur)=>{
    return {
      ...total,
      [cur.key]:cur
    }
  },{});

  scheme.forEach(field => {
    if(field.column){
      field = generColumn(field);
      columns.push(field)
    }
  })

  const formatTree = (_scheme) => {
    _scheme.forEach(field => {
      if(field.search){
        field.component = mapComponents(field.type,{
          ...field.props,
          status:'EDIT'
        })
        filterFields.push({
          ...field
        })
      }
      if(field.create){
        field.component = mapComponents(field.type,{
          ...field.props,
          status:'EDIT'
        })
        createFields.push({
          ...field
        })
      }
      if(field.edit){
        field.component = mapComponents(field.type,{
          ...field.props,
          status:'EDIT'
        })
        updateFields.push({
          ...field
        })
      }
      if(!isEmpty(field.children))
        formatTree(field.children)
    });
  }
  formatTree(scheme);
  

  return {
    fieldsMap,
    columns,
    filterFields,
    createFields,
    updateFields
  }
}