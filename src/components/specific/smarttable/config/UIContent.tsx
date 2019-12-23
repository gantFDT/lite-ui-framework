import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Switch, Radio } from 'antd'
import { BlockHeader } from 'gantd'
import { getType } from '@/utils/utils'
import Sortable from '../sortable'
import { generColumns } from '../fieldgenerator'

interface UIContentProps {
  viewConfig: any;
  schema: any;
  uiFields: string[];
  onChange(viewConfig: any): void;
}

function UIContent(props: UIContentProps) {
  const {
    viewConfig = {},
    schema,
    uiFields = ['wrap', 'isZebra', 'bordered', 'clickable', 'footerDirection', 'heightMode'],
    onChange
  } = props;

  useEffect(() => {
    if (schema && viewConfig) {
      const { columnKeys } = generColumns(schema);
      onChange({
        ...viewConfig,
        columnKeys,
      })
    }
  }, [schema]);

  const {
    wrap = true,
    isZebra = true,
    bordered = true,
    clickable = true,
    footerDirection = 'row',
    heightMode = 'full',
    columnKeys
  } = viewConfig;

  const handlerChange = useCallback((key, value) => {
    onChange({
      ...viewConfig,
      [key]: getType(value) === 'Object' ? value.target.value : value
    });
  }, [viewConfig])
  
  // tabKey相关
  const [tabKey, setTabKey] = useState<'field' | 'ui'>('field');
  const handlerChangeTabKey = useCallback((e) => {
    setTabKey(e.target.value);
  },[])

  const handlerChangeColumnKeys = useCallback((records) => {
    onChange({
      ...viewConfig,
      columnKeys:[...records]
    })
  },[viewConfig])

  const hasFixed = useMemo(() => {
    if(!viewConfig.columnKeys) return false;
    return viewConfig.columnKeys.some((V: any) => {
      if (V.lock && viewConfig.wrap) {
        onChange({
          ...viewConfig,
          wrap: false,
        })
      }

      return !!V.lock
    })
  }, [viewConfig])

  return (
    <>
      <Radio.Group value={tabKey} onChange={handlerChangeTabKey} style={{ marginBottom: 16, width: '100%', display:'flex' }} buttonStyle="solid">
        <Radio.Button style={{flex:1,textAlign:'center'}} value="field">{tr('字段配置')}</Radio.Button>
        <Radio.Button style={{flex:1,textAlign:'center'}} value="ui">{tr('显示设置')}</Radio.Button>
      </Radio.Group>
      {
        tabKey === 'field'?(
          <Sortable
            dataSource={columnKeys}
            onChange={handlerChangeColumnKeys}
          />
        ):(
          <>{
            uiFields.map((K: string, I: number) => {
              switch (K) {
                case 'wrap':
                  return <>
                    <BlockHeader type='num' num={I + 1} title={tr('单元格文字是否折行')} />
                    <Switch checked={wrap} disabled={hasFixed} onChange={handlerChange.bind(null, 'wrap')} checkedChildren={tr('折行')} unCheckedChildren={tr('不折行')} />
                  </>
                case 'isZebra':
                  return <>
                    <BlockHeader type='num' num={I + 1} title={tr('是否显示斑马线')} />
                    <Switch checked={isZebra} onChange={handlerChange.bind(null, 'isZebra')} checkedChildren={tr('是')} unCheckedChildren={tr('否')} />
                  </>
                case 'bordered':
                  return <>
                    <BlockHeader type='num' num={I + 1} title={tr('是否显示列边框')} />
                    <Switch checked={bordered} onChange={handlerChange.bind(null, 'bordered')} checkedChildren={tr('是')} unCheckedChildren={tr('否')} />
                  </>
                case 'clickable':
                  return <>
                    <BlockHeader type='num' num={I + 1} title={tr('点击行选中')} />
                    <Switch checked={clickable} onChange={handlerChange.bind(null, 'clickable')} checkedChildren={tr('是')} unCheckedChildren={tr('否')} />
                  </>
                case 'footerDirection':
                  return <>
                    <BlockHeader type='num' num={I + 1} title={tr('分页条位置')} />
                    <Radio.Group
                      options={[
                        { label: tr('左下'), value: 'row-reverse' },
                        { label: tr('右下'), value: 'row' },
                      ]}
                      value={footerDirection}
                      onChange={handlerChange.bind(null, 'footerDirection')}
                    />
                  </>
                case 'heightMode':
                  return <>
                    <BlockHeader type='num' num={I + 1} title={tr('表格高度策略')} />
                    <Radio.Group
                      options={[
                        { label: tr('按内容扩充高度'), value: 'auto' },
                        { label: tr('适应浏览器高度'), value: 'full' },
                      ]}
                      value={heightMode}
                      onChange={handlerChange.bind(null, 'heightMode')}
                    />
                  </>
              }
            })
          }</>
        )
      }
    </>
  )
}

export default UIContent;