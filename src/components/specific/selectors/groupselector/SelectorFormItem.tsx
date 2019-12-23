import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Icon, TreeSelect } from 'antd';
import { withEdit, Group } from 'gantd';
import classnames from 'classnames';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import { formatTreeData } from '@/utils/utils';
import exporter from '@/utils/cache';
import { getOrganizationField, getOrganizationInfo } from '@/utils/organization';
import { getOtherTreeOrgAPI, getOtherTreeOrgByAuthAPI } from '@/services/selectors';
import SelectorModal from './SelectorModal';
import PopoverCard from '../components/PopoverCard';
import { fields, nameKeys } from './static';
import { renderlinkEle } from '../utils'
import styles from '../styles.less';
const { selector: selectorCache }: { selector?: any } = exporter;
const { dropDownEleKey, popoverEleKey } = nameKeys;

export interface ReadElementProps {
  value: string | string[],
  showMode?: 'popover' | 'link' | 'custom' | 'simple' | 'mixed',
  linkTo?: string | Function | object,
  customShow?: (text: string, record: any) => any
}

export interface SelectorFormItemProps extends ReadElementProps {
  excludeId?: string,
  multiple?: boolean,
  onChange?: (selectedRowKeys: string[], selectedRows: object[]) => void,
  onCancel?: () => void,
  onOk?: (selectedRowKeys: string[], selectedRows: object[]) => void,
}

const SelectorFormItem = (props: any) => {
  const {
    excludeId,
    treeOrganizations,
    treeOrganizationsByAuth,
    value,
    onChange,
    multiple,
    showMode,
    linkTo,
    customShow,
    addonAfter,
    dispatch,
    withAuth,
    ...restProps
  } = props;

  const [visible, setVisible] = useState(false);
  const [filterData, setFilterData] = useState([]);

  useEffect(() => {
    initFetch()
  }, [])

  useEffect(() => {
    excludeId && getExcludeData()
  }, [excludeId])

  const initFetch = useCallback(() => {
    if (excludeId) return;
    if (withAuth && treeOrganizationsByAuth.length || !withAuth && treeOrganizations.length) return;
    dispatch({ type: 'selectors/fetchTreeOrg', payload: { withAuth } })
  }, [treeOrganizations, excludeId, withAuth])

  const handlerChange = useCallback((selectedRowKeys: string[]) => {
    let ret: any = multiple ? selectedRowKeys : selectedRowKeys[0];
    onChange && onChange(ret)
    setVisible(false)
  }, [multiple])

  const getExcludeData = useCallback(async () => {
    let key = `groupSelector_${withAuth ? 'auth' : 'all'}:${excludeId}`;
    let cacheData = selectorCache.get(key);
    if (!cacheData) {
      try {
        let api = withAuth && getOtherTreeOrgByAuthAPI || getOtherTreeOrgAPI;
        const res = await api({ data: { id: excludeId, node: 'root', pageInfo: {} } });
        formatTreeData(res, 'children', { title: 'orgName' });
        selectorCache.set(key, res);
        cacheData = res;
      } catch (err) { console.log(err) }
    }
    setFilterData(cacheData);
  }, [excludeId, withAuth])

  const treeData = useMemo(() => {
    if (excludeId) return filterData;
    return withAuth ? treeOrganizationsByAuth : treeOrganizations;
  }, [excludeId, withAuth, filterData, treeOrganizations, treeOrganizationsByAuth])

  return (
    <Group gant>
      <div className={styles.professionalSelector}>
        <div className={classnames(styles.selectWrap, addonAfter ? styles.editSelector : null)}>
          <TreeSelect
            value={value}
            dropdownClassName={dropDownEleKey}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData}
            onChange={onChange}
            showSearch
            allowClear
            multiple={multiple}
            treeNodeFilterProp="orgName"
            style={{ width: '100%' }}
            {...restProps}
          />
          <Icon className={styles.searchIcon} type="search" onClick={() => setVisible(true)} />
        </div>
        <SelectorModal
          excludeId={excludeId}
          multiple={multiple}
          value={multiple ? value : value && [value]}
          onCancel={() => setVisible(false)}
          onOk={handlerChange}
          visible={visible}
          withAuth={withAuth}
        />
      </div>
      {addonAfter ? <span className="ant-input-group-addon">{addonAfter}</span> : null}
    </Group>
  )
}

SelectorFormItem.defaultProps = {
  multiple: false,
  showMode: 'simple',
  withAuth: false
}

function renderReadElement(props: ReadElementProps) {
  const { value, showMode, linkTo, customShow } = props;
  if (Array.isArray(value)) {
    return value.map(id => getOrganizationField({ id, field: "fullOrgName" }) || id).join('、');
  }
  if (!value) return;
  let name = getOrganizationField({ id: value, field: "fullOrgName" });
  let record = getOrganizationInfo(value);
  if (isEmpty(record)) return value;

  switch (showMode) {
    case 'popover':
      return <PopoverCard
        data={record}
        fields={fields}
        overlayClassName={popoverEleKey}
        nameKey='fullOrgName'
        codeList='FW_ORGANIZATION_TYPE'
        codeListKey='orgType'
      />
    case 'link':
      return renderlinkEle(value, name, linkTo)
    case 'mixed':
      return <PopoverCard
        trigger='hover'
        data={record}
        fields={fields}
        overlayClassName={popoverEleKey}
        nameKey='fullOrgName'
        codeList='FW_ORGANIZATION_TYPE'
        codeListKey='orgType'
      >
        {renderlinkEle(value, name, linkTo)}
      </PopoverCard>
    case 'custom':
      return customShow && customShow(value, record);
    default:
      return name;
  }
}

const EditSelector = withEdit((props: ReadElementProps) => renderReadElement(props))(SelectorFormItem);

function ConnectComp(props: SelectorFormItemProps) {
  return <EditSelector {...props} />
}

export default connect(({ selectors }: { selectors: any }) => ({
  treeOrganizations: selectors.treeOrganizations,
  treeOrganizationsByAuth: selectors.treeOrganizationsByAuth,
}))(ConnectComp)

