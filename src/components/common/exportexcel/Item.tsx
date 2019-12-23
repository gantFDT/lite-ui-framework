import React, { useState, useCallback, useMemo } from 'react'
import { Tooltip, Button } from 'antd'
import { SmartModal, SmartTable } from '../../specific'
import XLSX from 'xlsx'

const defaultModalState: any = {
  width: 800,
  height: 660
}

interface ExportItemProps {
  children: any;
  schema: any[];
  dataSource: any[];
  title?: string;
  fileName?: string;
}
/**
 * TabPanel组件
 * @param props
 */
const Item = (props: ExportItemProps) => {
  const {
    children,
    title = tr('导出'),
    schema,
    fileName = tr('表格数据'),
    dataSource
  } = props;

  const [modalState, setModalState] = useState<any>(defaultModalState);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const onSizeChange = useCallback((width, height) => {
    setModalState({
      width,
      height
    })
  },[])

  const handlerRowChange = useCallback((keys, rows) => {
    setSelectedKeys(keys);
    setSelectedRows(rows);
  },[])

  const getWb = useCallback(() => {
    let aoeTitle = schema.map(V => V.title);
    let aoa = selectedRows.map(
      (row: any) => schema.map(V => row[V.fieldName])
    );
    const ws = XLSX.utils.aoa_to_sheet([aoeTitle, ...aoa]);
    const wb = XLSX.utils.book_new();
    ws['!cols'] = schema.map(V => ({ wpx: V.width || 120 }));
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet');
    return wb;
  },[schema, selectedRows])
  
  const toXLSX = useCallback(() => {
    const wb = getWb();
    XLSX.writeFile(wb, fileName + '.xlsx', {bookType: "xlsx"});
  },[selectedRows, schema, selectedRows])

  const toCSV = useCallback(() => {
    const wb = getWb();
    XLSX.writeFile(wb, fileName + '.csv', {bookType: "csv"});
  },[selectedRows])

  const tableHeight = useMemo(() => modalState.height - 137,[modalState])
  
  return (
    <>
      <Tooltip title={title}>
        {
          React.cloneElement(children, {onClick: () => setModalVisible(true)})
        }
      </Tooltip>
      <SmartModal
        id="ExportExcelModal"
        title={tr('选择导出数据')}
        isModalDialog
        maxZIndex={12}
        itemState={modalState}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSizeChange={onSizeChange}
        footer={<>
          <Button
            size='small'
            onClick={() => setModalVisible(false)}
          >
            {tr('取消')}
          </Button>
          <Button
            size='small'
            type='primary'
            onClick={toCSV}
            disabled={selectedKeys.length === 0}
          >
            {tr('导出') + 'csv'}
          </Button>
          <Button
            size='small'
            type='primary'
            onClick={toXLSX}
            disabled={selectedKeys.length === 0}
          >
            {tr('导出') + 'xlsx'}
          </Button>
        </>}
      >
        <SmartTable
          headerProps={{style:{display:'none'}}}
          schema={schema}
          dataSource={dataSource}
          bodyHeight={tableHeight}
          viewSchema={{
            wrap: false
          }}
          rowSelection={{
            type: 'checkbox',
            clickable: true,
            selectedRowKeys: selectedKeys,
            onChange: handlerRowChange,
            showFooterSelection: false,
          }}
        />
      </SmartModal>
    </>
  )
}

export default Item;
