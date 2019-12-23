import React, { useState, useRef, useMemo } from 'react'
import FormSchema from '@/components/form/schema'
import { Button, Switch, Radio } from 'antd'
import { EditStatus, SwitchStatus } from 'gantd'
import styles from './index.less'
import { schema, configSchma, gridSchema, nestSchema, tableSchema } from './schema'
function BaseForm() {
  const [uiSchema, setUiSchema] = useState({
    "ui:col": 24,
    "ui:gutter": 10,
    "ui:labelCol": 4,
    "ui:wrapperCol": 20,
    "ui:labelAlign": "left",
    "ui:backgroundColor": "#fff"
  })
  const configUI = {
    "ui:labelCol": 6,
    "ui:wrapperCol": 18,
    backgroundColor: {
      "ui:labelCol": 24,
      "ui:wrapperCol": 24,
    }
  }
  const data = useMemo(() => {
    const newData = {}
    Object.keys(uiSchema).map(keyname => {
      const name = keyname.replace('ui:', "");
      newData[name] = uiSchema[keyname]
    })
    return newData
  }, [uiSchema])
  const onChange = (val) => {
    const newData = {}
    Object.keys(val).map(keyname => {
      newData[`ui:${keyname}`] = val[keyname]
    });
    setUiSchema(uiSchema => ({ ...uiSchema, ...newData }))
  }
  const [edit, setEdit] = useState(EditStatus.EDIT)

  const titleConfig = {
    "title:extra": (
      <Radio.Group size='small' onChange={(e) => setEdit(e.target.value)} value={edit}>
        <Radio.Button value={EditStatus.EDIT}>写</Radio.Button>
        <Radio.Button value={EditStatus.CANCEL}>读</Radio.Button>
      </Radio.Group>
    )
  }
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.itemContent}>
          <FormSchema edit={edit} schema={schema} uiSchema={uiSchema} titleConfig={titleConfig} />
        </div>
        <div className={styles.itemConfig}>
          <FormSchema schema={configSchma} uiSchema={configUI} data={data} onChange={onChange} />
        </div>
      </div>
    </div>
  )
}

function NestForm() {
  const uiSchema = {
    "ui:col": 12,
    "ui:labelCol": 6,
    "ui:wrapperCol": 18

  }
  const [edit, setEdit] = useState({
    form: EditStatus.EDIT,
    children: EditStatus.EDIT,
    grandson: EditStatus.EDIT,
  })
  return <div style={{ marginTop: 20 }
  } >
    <FormSchema uiSchema={uiSchema}
      edit={{
        "edit:status": edit.form,
        children: {
          "edit:status": edit.children,
          "grandson": edit.grandson
        }
      }}
      // titleConfig={titleConfig}
      schema={nestSchema} />
  </div>
}


function GridForm() {
  const uiSchema = {
    "ui:col": {
      span: 24,
      sm: 12,
      xl: 8,
      xxl: 6,
    },
    "ui:labelCol": {
      span: 24,
      sm: 6
    },
    "ui:wrapperCol": {
      span: 24,
      sm: 18
    }

  }
  return <div style={{ marginTop: 20 }} >
    <FormSchema uiSchema={uiSchema} schema={gridSchema} />
  </div>
}

function TableForm() {
  return <div style={{ marginTop: 20 }} >
    <FormSchema schema={tableSchema} />
  </div>
}

export default function () {
  return <div>
    <BaseForm />
    <NestForm />
    <TableForm />
    <GridForm />
  </div>
}