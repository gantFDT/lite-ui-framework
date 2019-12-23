import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Modal, Upload, Button, Progress } from 'antd'
import { Table } from 'gantd'
import { connect } from 'dva'
import { SmartModal, SmartTable, SmartSearch } from '@/components/specific'
import SchemaForm from '@/components/form/schema';
import { UPLOAD_URL } from '@/services/file'
import { Title } from '@/components/common'
import { namespace } from '../../model'
import { resolveWithUser, getUserIdentity } from '@/utils/utils'
import { smartSearchSchema, tableColumns, modalSchema, importFileModalSchema, importInfoModalSchema } from './schema'

interface SelectorModalProps {
  visible: boolean,
  onCancel: () => void,
  onOk: (data: object) => void,
  [propName: string]: any
}

function SelectorModal(props: SelectorModalProps) {
  const {
    currentUser,

    designTemplates,

    listDesignTemplate,
    getDesignTemplate,
    updateDesignName,
    removeDesignTemplate,
    importDesignTemplate,
    listDesignTemplateLoading,
    getDesignTemplateLoading,
    updateDesignNameLoading,
    importDesignTemplateLoading,

    visible,
    onClose,
    onOk
  } = props;

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [selectedRows, setSelectedRows] = useState<any[]>([])

  const [nameModalVisible, setNameModalVisible] = useState<boolean>(false);
  const [importModalVisible, setImportModalVisible] = useState<boolean>(false);

  const clearSelect = useCallback(() => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  }, [])

  const handlerSelect = useCallback((selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys)
    setSelectedRows(selectedRows)
  }, [setSelectedRowKeys, setSelectedRows])

  useEffect(() => {
    clearSelect()
    listDesignTemplate()
  }, [])

  const handlerConfirm = useCallback(() => {
    const [{ id, designName }] = selectedRows;
    getDesignTemplate({ contentId: id }).then((data: any) => {
      onOk({
        ...data,
        designId: id,
        designName: designName
      });
    })
  }, [selectedRows])

  // 筛选列表
  const handlerSearch = useCallback((params: any) => {
    let queryParams: any = {};
    if ('whereList' in params) {
      if (!params.whereList.length) queryParams.name = '';
      else queryParams.name = params.whereList[0].value;
    } else {
      queryParams.name = params.searchKeyword;
    }
    clearSelect()
    listDesignTemplate(queryParams);
  }, [])

  const handleUpdate = useCallback((params) => {
    updateDesignName({
      id: params.id,
      name: params.name,
    }).then(() => {
      clearSelect()
      setNameModalVisible(false);
    })
  }, [])

  const handlerDelete = useCallback((params) => {
    Modal.confirm({
      title: tr(`确定要删除此设计模板？`),
      centered: true,
      okText: tr('是'),
      cancelText: tr('否'),
      okButtonProps: { size: 'small' },
      cancelButtonProps: { size: 'small' },
      onOk: () => {
        removeDesignTemplate({ id: selectedRowKeys[0] }).then(() => clearSelect())
      }
    })
  }, [selectedRowKeys])

  const handlerExport = useCallback(() => {
    window.open(resolveWithUser('/workflowDesign/exportDesignTemplate?id=' + selectedRowKeys[0]))
  }, [selectedRowKeys])

  const updateModalData = useMemo(() => selectedRows.length ? { ...selectedRows[0], name: selectedRows[0].designName } : {}, [selectedRows])


  // 上传导入相关
  const [importModalValue, setImportModalValue] = useState<any>({
    file: {},
    info: {}
  })
  const [uploading, setUploading] = useState(false)
  const [uploadPercent, setUploadPercent] = useState(0)
  const headers = useMemo(getUserIdentity, [])

  const onFileChange = useCallback((res) => {
    const { file } = res
    const { name, size, percent, response, status } = file
    setUploadPercent(percent)
    if (status === 'done') {
      const { data: [{ id: fileEntityId }] } = response;
      setImportModalValue({
        file: {
          fileEntityId,
          templateFileName: name,
          templateFileSize: size,
        },
        info: {
          name: name.slice(0, -4)
        }
      })
      setUploading(false)
    } else {
      setUploading(true)
    }
  }, [])

  const changeDesignName = useCallback((changeValue, allValues) => {
    setImportModalValue({
      ...importModalValue,
      info: allValues
    })
  }, [importModalValue])

  const handlerImportTemp = useCallback(() => {
    const { file: { fileEntityId }, info: { name } } = importModalValue;
    importDesignTemplate({
      fileEntityId,
      name,
    })
    setImportModalVisible(false);
    setImportModalValue({ file: {}, info: {} })
  }, [importModalValue])

  return (
    <>
      <SmartModal
        id="DesignTempModal"
        title={tr('流程设计模板')}
        isModalDialog
        maxZIndex={12}
        itemState={{
          width: 1024,
          height: 700
        }}
        visible={visible}
        onCancel={onClose}
        footer={<div>
          <Button
            size="small"
            icon="read"
            type='primary'
            disabled={!selectedRowKeys.length}
            onClick={handlerConfirm}
            loading={getDesignTemplateLoading}
          >{tr('打开模板')}</Button>
          <Button
            size="small"
            icon="edit"
            type='primary'
            disabled={!selectedRowKeys.length}
            onClick={() => setNameModalVisible(true)}
          >{tr('修改名称')}</Button>
          <Button
            size="small"
            icon="delete"
            type='danger'
            disabled={!selectedRowKeys.length}
            onClick={handlerDelete}
          >{tr('删除模板')}</Button>
          <Button
            size="small"
            type='primary'
            icon="import"
            onClick={() => setImportModalVisible(true)}
          >{tr('导入模板')}</Button>
          <Button
            size="small"
            icon="export"
            type='primary'
            disabled={!selectedRowKeys.length}
            onClick={handlerExport}
          >{tr('导出模板')}</Button>
        </div>}
      >
        <SmartSearch
          searchPanelId={'DesignTempSearch:'}
          userId={currentUser.id}
          title={<Title title={tr('设计模板过滤条件')} showSplitLine showShortLine />}
          schema={smartSearchSchema}
          onSearch={handlerSearch}
          onSimpleSearch={handlerSearch}
        />
        <Table
          title={<Title title={tr('设计模板列表')} showShortLine />}
          columns={tableColumns}
          dataSource={designTemplates}
          rowKey="id"

          rowSelection={{
            clickable: true,
            type: 'radio',
            selectedRowKeys,
            onChange: handlerSelect
          }}

          loading={listDesignTemplateLoading}

          pagination={false}
        />
      </SmartModal>
      <SmartModal
        id="DesignNameTempModal"
        title={tr('修改流程设计模板名称')}
        isModalDialog
        maxZIndex={13}
        itemState={{
          width: 500,
          height: 200
        }}
        values={updateModalData}
        confirmLoading={updateDesignNameLoading}
        visible={nameModalVisible}
        schema={modalSchema}
        uiSchema={{
          "ui:labelCol": { span: 8 },
          "ui:wrapperCol": { span: 16 },
          "ui:col": { span: 24 }
        }}
        onSubmit={(params) => handleUpdate(params)}
        onCancel={() => setNameModalVisible(false)}
      />
      <SmartModal
        id="ImportDesignTempModal"
        title={tr('导入流程设计模板')}
        isModalDialog
        maxZIndex={13}
        itemState={{
          width: 600,
          height: 323
        }}
        visible={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        footer={<div>
          <Upload
            key='add'
            style={{ marginRight: '8px' }}
            showUploadList={false}
            action={UPLOAD_URL}
            data={{
              tempFile: true,
              recTypeId: 0,
              recId: 0,
              subRecTypeId: 0,
              subRecId: 0
            }}
            headers={headers}
            onChange={onFileChange}
          >
            <Button
              size="small"
              icon="cloud-upload"
              type='primary'
            >{tr('上传模板')}</Button>
          </Upload>
          <Button
            size="small"
            disabled={!importModalValue.file.fileEntityId || !importModalValue.info.name}
            type='primary'
            icon="import"
            loading={importDesignTemplateLoading}
            onClick={handlerImportTemp}
          >{tr('导入模板')}</Button>
        </div>}
      >
        {
          uploading ?
            <Progress style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }} type="circle" percent={uploadPercent} /> :
            <>
              <Title title={tr('模板文件信息')} showShortLine />
              <SchemaForm
                schema={importFileModalSchema}
                uiSchema={{
                  'ui:col': 24,
                  'ui:labelCol': 8,
                  'ui:wrapperCol': 16,
                }}
                data={importModalValue.file}
              />
              <Title title={tr('模板设计信息')} showShortLine />
              <SchemaForm
                schema={importInfoModalSchema}
                uiSchema={{
                  'ui:col': 24,
                  'ui:labelCol': 8,
                  'ui:wrapperCol': 16,
                }}
                data={importModalValue.info}
                onChange={changeDesignName}
              />
            </>
        }
      </SmartModal>
    </>
  )
}

const methods = ['listDesignTemplate', 'getDesignTemplate', 'updateDesignName', 'removeDesignTemplate', 'importDesignTemplate'];
const ModalWithDva = connect(
  ({ loading, settings, workFlowDesigner, user }: any) => ({
    currentUser: user.currentUser,
    MAIN_CONFIG: settings.MAIN_CONFIG,
    ...workFlowDesigner,
    ...methods.reduce((T, C) => ({
      ...T,
      [`${C}Loading`]: loading.effects[namespace + '/' + C]
    }), {})
  }),
  (dispatch: any) => methods.reduce((T, C) => ({
    ...T,
    [C]: (payload: any) => dispatch({ type: namespace + '/' + C, payload })
  }), {})
)(SelectorModal);

export default ModalWithDva;