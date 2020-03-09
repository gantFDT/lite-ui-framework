import React, { memo, useState, useCallback } from 'react';
import { Radio } from 'antd';
import { Header } from 'gantd';
import { getType } from '@/utils/utils';
import { UiConfigProps } from '../../../interface'

interface UiContentProps {
  uiConfig: UiConfigProps,
  onChange: (key: string, val: string | boolean) => void
}

function UiContent(props: UiContentProps) {
  const {
    uiConfig = {},
    onChange,
  } = props;
  const { searchType, labelAlign } = uiConfig;
  const handleChange = useCallback((key, val) => {
    onChange && onChange(key, getType(val == 'object') ? val.target.value : val);
  }, [])

  return <>
    <Header type='num' num='1' title={tr('查询方式')} />
    <Radio.Group
      options={[
        { label: tr('自动应用'), value: 'auto' },
        { label: tr('点击查询'), value: 'click' },
      ]}
      value={searchType}
      onChange={handleChange.bind(null, 'searchType')}
    />
    {/* <Header type='num' num='2' title={tr('label对齐方式')} />
        <Radio.Group
            options={[
                { label: tr('左边'), value: 'left' },
                { label: tr('右边'), value: 'right' },
            ]}
            value={labelAlign}
            onChange={handleChange.bind(null, 'labelAlign')}
        /> */}
  </>
}
export default memo(UiContent)
