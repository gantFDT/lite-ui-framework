import React, { Component } from 'react'
import { Button, Modal, Tooltip, Empty } from 'antd'
import { Table, BlockHeader, Icon } from 'gantd';
import { ModalForm } from './ModalForm'
import SearchForm from '@/components/specific/searchform'
import { SmartTable, SmartSearch } from '@/components/specific'
import Title from '@/components/common/title'
import { Debounce, BindAll } from 'lodash-decorators'
import { isEqual, isEmpty } from 'lodash'
import { searchSchema, smartSearchSchema } from './schema'
import styles from './style.less';
@BindAll()
export default class CodeListLeft extends Component {
  componentDidMount() {
    this.searchHandler()
  }
  @Debounce(200)
  searchHandler(payload) {
    const { dispatch } = this.props;
    dispatch({
      type: 'codelist/getCodeType',
      payload
    });
  }
  onPageChange(beginIndex, pageSize) {
    this.searchHandler({ pageSize, beginIndex })
  }
  onChangeForm(changeValues) {
    this.props.dispatch({
      type: "codelist/save", payload: {
        selectedRowKeys: [],
        selectedRows: []
      }
    })
    this.searchHandler(changeValues)
  }
  onSelectChange(keys, rows) {
    const { dispatch, selectedRowKeys, disabledSave } = this.props;
    if (isEqual(selectedRowKeys, keys)) return;
    if (!disabledSave) return Modal.confirm({
      title: tr("提示"),
      content: tr("编码未保存是否继续切换") + "?",
      onOk: () => {
        dispatch({
          type: "codelist/selectCodeList", payload: {
            selectedRowKeys: keys,
            selectedRows: rows,

          }
        })
        dispatch({
          type: "codelist/save", payload: {
            editting: false
          }
        })
      },
      cancelText: tr("取消"),
      okButtonProps: {
        size: "small"
      },
      cancelButtonProps: {
        size: "small"
      },
      okText: tr("确定")
    })
    dispatch({
      type: "codelist/selectCodeList", payload: {
        selectedRowKeys: keys,
        selectedRows: rows
      }
    })
    dispatch({
      type: "codelist/save", payload: {
        editting: false
      }
    })
  }
  onSubmit(payload) {
    const { dispatch, formType, selectContent } = this.props
    if (formType == "new") dispatch({ type: "codelist/createCodeType", payload })
    else dispatch({ type: "codelist/editCodeType", payload: { ...selectContent, ...payload } })
  }
  onClose() {
    this.props.dispatch({
      type: "codelist/save", payload: {
        visible: false,
        formType: "new",
        editValue: {}
      }
    })
  }
  onDelete() {
    Modal.confirm({
      title: tr("提示"),
      content: tr("确认删除选中编码") + "?",
      onOk: () => this.props.dispatch({ type: "codelist/deteleCodeType" }),
      okType: 'danger',
      okText: tr("删除"),
      cancelText: tr("取消"),
      okButtonProps: {
        size: "small"
      },
      cancelButtonProps: {
        size: "small"
      }
    })
  }

  onHandlerCreate() {
    this.props.dispatch({
      type: "codelist/save", payload: {
        visible: true,
        formType: "new"
      }
    })
  }
  onHandlerEdit() {
    const { selectedRowKeys, dispatch, data, selectContent } = this.props;
    dispatch({
      type: "codelist/save", payload: {
        visible: true,
        formType: "edit",
        editValue: selectContent
      }
    })
  }
  onSearch({ filterInfo }) {
    this.searchHandler(filterInfo)
  }
  onsyncAll() {
    const { dispatch } = this.props;
    Modal.confirm({
      title: tr("是否确认同步") + "?",
      content: tr("同步操作会增量同步代码中的") + "CodeList," + "并删除多余的系统编码",
      okButtonProps: {
        size: "small"
      },
      cancelButtonProps: {
        size: "small"
      },
      onOk: () => dispatch({ type: "codelist/syncAllCodeType" }),
      okText: tr("确认"),
      cancelText: tr("取消"),
    })
  }
  render() {
    const { dispatch, syncAllLoading, formType,
      editValue,
      selectContent,
      visible, data, total, selectedRowKeys, params, loading, btnLoading,
      tableHeight,
      setHeight,
      userId
    } = this.props;
    const { pageSize, beginIndex } = params;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      type: 'radio',
      clickable: true,
      columnWidth: 40
    };
    const tableSchema = [{
      title: tr("类型"),
      fieldName: "type"
    },
    {
      title: tr("名称"),
      fieldName: "name"
    },
    {
      title: tr("系统"),
      align: "center",
      width: 50,
      fieldName: "category",
      render: text => text == "SYSTEM" ? <span className="successColor" ><Icon.Ant type="check-circle" /></span> : ""
    }]

    const isEdit = selectedRowKeys.length > 0 && selectContent.category !== "SYSTEM"
    return <div className={styles.codelistLeft} >
      <ModalForm
        onCancel={this.onClose}
        onSubmit={this.onSubmit}
        values={editValue}
        confirmLoading={btnLoading}
        visible={visible}
        formType={formType}
      />
      <SmartSearch
        searchPanelId='codelistSearchForm'
        userId={userId}
        title={<Title title={tr("编码类型查询")} showShortLine />}
        schema={smartSearchSchema}
        onSizeChange={({ height }) => setHeight(height)}
        showBottomLine={false}
        onSearch={this.onSearch}
        isCompatibilityMode
        headerProps={{
          bottomLine: false,

        }}
        uiSchema={{
          "ui:col": {
            xs: 24,//578
            sm: 24,//578
            md: 24,//786
            lg: 12,//992
            xl: 8,//1200
            xxl: 8,//1600
          }
        }}
      />
      <SmartTable
        schema={tableSchema}
        rowSelection={rowSelection}
        dataSource={data}
        totalCount={total}
        pageIndex={beginIndex}
        pageSize={pageSize}
        onPageChange={this.onPageChange}
        rowKey="id"
        loading={loading}
        bodyHeight={tableHeight}
        headerRight={
          <>
            <Tooltip title={tr("同步")} placement="bottom"  >
              <Button size="small" className="marginH5" icon='swap' loading={syncAllLoading} onClick={this.onsyncAll} >
              </Button>
            </Tooltip>
            <Tooltip title={tr("新建")} placement="bottom" >
              <Button size="small" className="marginH5" icon='plus' onClick={this.onHandlerCreate} />
            </Tooltip>
            <Tooltip title={tr("编辑")} placement="bottom"  >
              <Button size="small" className="marginH5" icon='edit' onClick={this.onHandlerEdit} disabled={!isEdit}  >
              </Button>
            </Tooltip>
            <Tooltip title={tr("删除")} placement="bottom"  >
              <Button size="small" className="marginH5" icon='delete' type='danger' onClick={this.onDelete} disabled={!isEdit}  >
              </Button>
            </Tooltip>
            <Tooltip title={tr("刷新")} placement="bottom"  >
              <Button size="small" className="marginH5" icon='redo' onClick={this.searchHandler}   >
              </Button>
            </Tooltip>
          </>
        }
        title={<Title title={tr("编码类型")} showSplitLine showShortLine />}
      />
    </div>
  }
}
