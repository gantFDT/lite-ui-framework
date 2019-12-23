import React, { Component } from 'react'
import { connect } from 'dva';
import { BlockHeader, EditStatus } from 'gantd'
import isJson from 'is-json'
import { getLocale } from 'umi/locale'

import { Form, InputNumber, Icon, Input, Button, Checkbox, Row, Col, Modal } from 'antd';
import styles from './index.less'
import LanguageModal from './components/LanguageModal'
import LanguageInput from '@/components/form/languageinput'

const locale = getLocale();
const localeMap = {
  'zh-CN': 'zh_CN',
  'en-US': 'en',
}
const systemLocale = localeMap[locale]
@connect(({ preferencesmanage, loading }) => ({
  ...preferencesmanage,
  loading: loading.effects['preferencesmanage/getAllParams'],
}))
@Form.create()
class ListOptPre extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  unLastNodeClick = (value) => {
    let isLastNode = value.children.length ? false : true
    this.props.dispatch({
      type: 'preferencesmanage/filterParams',
      payload: {
        selectKey: value.key,
        isLastNode
      }
    })
  }


  changeLanguageInput = () => {

  }

  nameMap = (value) => {
    try {
      return isJson(value) ? JSON.parse(value) : {}
    }
    catch{
      return {}
    }
  }

  switchItem = (node) => {

    switch (node.type) {
      case 'STRING':
        return <Input />
        break;
      case 'STRING_I18N':
        return <LanguageInput
          cacheId={node.id}
          edit={EditStatus.EDIT}
          onChange={(data) => this.changeLanguageInput(data, node)}
        />
        break;
      case 'INTEGER':
        return <InputNumber />
        break;
      case 'FLOAT':
        return <InputNumber />
        break;
      case 'BOOLEAN':
        return <Checkbox></Checkbox>
        break;
      default:
        <Input />
        break;
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { panelData, allParams, langChange } = this.props
        let changeData = []
        let formData = []
        let keys = Object.keys(values)
        _.map(keys, k => {
          formData.push({
            name: k,
            value: values[k]
          })
        })
        _.map(formData, findData => {
          let isChange = allParams.find(item => item.name === findData.name && item.value !== findData.value)
          if (isChange) {
            if (langChange && isChange.id == langChange.id) {
                changeData.push(langChange)
            } else {
              isChange ? changeData.push({
                ...isChange,
                value: findData.value
              }) : null
            }
          }
        })
        this.props.dispatch({
          type: 'preferencesmanage/batchUpdate',
          payload: {
            parameters: changeData
          }
        })
      }
    });
  }

  handleSync = (e) => {
    e.preventDefault();

    Modal.confirm({
      title: tr(`提示`),
      content: <div>
        {tr('同步操作会清除系统参数中的无效参数, 并同步除参数值以外的信息。')}<br/>
        <b>{tr('是否确定')}?</b>
      </div>,
      centered: true,
      okText: tr('是'),
      cancelText: tr('否'),
      okButtonProps: { size: 'small' },
      cancelButtonProps: { size: 'small' },
      onOk: () => {
        this.props.dispatch({
          type: 'preferencesmanage/syncParams'
        })
      }
    })
  }

  changeLanguageInput = (data, oriData) => {
    const { panelData } = this.props
    let _newPanelData = _.cloneDeep(panelData)
    let i = panelData.findIndex(item => {
      if (item.type === 'STRING_I18N') {
        return item.id == oriData.id && oriData.value != data
      }
    })

    if (i != -1) {

      let _newOriItem = _.cloneDeep(oriData)
      _newOriItem.value = data

      _newPanelData[i] = { ..._newOriItem }
      this.props.dispatch({
        type: 'preferencesmanage/save',
        payload: {
          panelData: _newPanelData,
          langChange: { ..._newOriItem },
        }
      })
    }
  }



  render() {
    const { panelData, isLastNode, panelTitle } = this.props
    const { getFieldDecorator } = this.props.form;
    const panelView = isLastNode ? (
      <div>
        <Form className={styles.preForm}>
          {
            panelData.map(node => {
              node.value = node.type == 'INTEGER' || node.type == 'FLOAT' ? node.value * 1 : node.value
              if (node.type == 'BOOLEAN') {
                node.value = node.value === 'false' ? false : true
              }
              return (
                <Form.Item
                  key={node.id}
                  label={`${node.description} (${node.name})`} >
                  {getFieldDecorator(node.name, {
                    valuePropName: node.type == 'BOOLEAN' ? 'checked' : 'value',
                    initialValue: node.value,
                  })(
                    this.switchItem(node)
                  )}
                </Form.Item>
              )
            })
          }
        </Form>
      </div>
    ) : (
        <div className={styles.preForm}>
          {
            panelData.map(item => {
              return <div className={styles.preItem} key={item.key} onClick={() => this.unLastNodeClick(item)}>{item.name}</div>
            })
          }
        </div>
      )
    return (
      <div className={styles.panelView} height={window.outerHeight * .7}>
        <BlockHeader
          title={panelTitle}
          size='big'
          bottomLine={true}
          extra={
            <>
              <Button
                size='small'
                style={{ margin: 5 }}
                onClick={this.handleSync}>
                {tr('同步')}
              </Button>
              <Button
                size='small'
                style={{ margin: 5 }}
                onClick={this.handleSubmit}>
                {tr('保存')}
              </Button>
            </>
          }
        />
        <div className={styles.perContent}>{panelView}</div>
      </div>
    )
  }
}
export default ListOptPre




