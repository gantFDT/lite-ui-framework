import React, { useState, useCallback, useEffect, useMemo, Dispatch } from 'react';
import { Icon, TreeSelect } from 'antd';
import { withEdit, Group } from 'gantd';
import { map } from 'lodash';
import classnames from 'classnames';
import { connect } from 'dva';
import { getUserGroupField } from '@/utils/usergroup'
import SelectorModal from './SelectorModal';
import { renderlinkEle } from '../utils';
import { nameKeys } from './static';
import styles from '../styles.less';
const { TreeNode } = TreeSelect;

export interface UserGroupItemProps {
  label: string,
  value: string,
}

export interface ReadElementProps {
  value: UserGroupItemProps | UserGroupItemProps[],
  showMode?: 'popover' | 'link' | 'custom' | 'simple',
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
    listUserGroupCategoryTree,
    listUserGroupCategoryTreeByAuth,
    value,
    onChange,
    multiple,
    fetchListCategory,
    fetchListUserGroup,
    addonAfter,
    withAuth,
    ...restProps
  } = props;

  const [visible, setVisible] = useState(false);
  const [forceRenderKey, setForceRenderKey] = useState(0);

  useEffect(() => {
    fetch()
  }, [])

  const fetch = useCallback(() => {
    if (withAuth && listUserGroupCategoryTreeByAuth.length || !withAuth && listUserGroupCategoryTree.length) return;
    fetchListCategory({ withAuth })
  }, [withAuth, listUserGroupCategoryTree, listUserGroupCategoryTreeByAuth])

  const handlerChange = useCallback((selectedRowKeys: string[], selectedRows: any) => {
    let ret: any = multiple ? selectedRowKeys : selectedRowKeys[0];
    onChange && onChange(ret)
    setVisible(false)
  }, [multiple])

  const handlerSelectorChange = useCallback((ret: any) => {
    let value = Array.isArray(ret) ? ret.map(v => v.value) : ret && ret.value;
    onChange && onChange(value)
  }, [])
  const onCategoryReload = useCallback(() => {
    setForceRenderKey(key => key + 1)
  }, [])

  const onLoadData = useCallback(treeNode => new Promise(resolve => {
    if (treeNode.props.children && treeNode.props.children.length) {
      resolve();
      return;
    }
    fetchListUserGroup({ id: treeNode.props.value, withAuth }).then(() => {
      resolve();
    })
  }), [withAuth])

  const dataSource = useMemo(() => {
    return withAuth && listUserGroupCategoryTreeByAuth || listUserGroupCategoryTree;
  }, [withAuth, listUserGroupCategoryTree, listUserGroupCategoryTreeByAuth]);

  const loop = (data: any, renderKey: number) => data.map((item: any) => {
    if (item.children && item.children.length > 0) {
      return (
        <TreeNode
          key={`${item.key}_${renderKey}`}
          value={item.value}
          title={item.title}
          isLeaf={item.isLeaf}
          selectable={item.selectable}
        >
          {loop(item.children, renderKey)}
        </TreeNode>
      );
    }
    return <TreeNode
      key={`${item.key}_${renderKey}`}
      value={item.value}
      title={item.title}
      isLeaf={item.isLeaf}
      selectable={item.selectable}
    />;
  });

  const selectorValue = useMemo(() => {
    if (!value) return;
    if (Array.isArray(value)) {
      return value.map(id => { return { label: getUserGroupField({ id }), value: id } })
    } else {
      return { label: getUserGroupField({ id: value }), value }
    }
  }, [value])

  return (
    <>
      <Group gant>
        <div className={styles.professionalSelector}>
          <div className={classnames(styles.selectWrap, addonAfter ? styles.editSelector : null)}>
            <TreeSelect
              value={selectorValue}
              allowClear
              labelInValue
              dropdownClassName={nameKeys.dropDownEleKey}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              loadData={onLoadData}
              onChange={handlerSelectorChange}
              style={{ width: '100%' }}
              multiple={multiple}
              {...restProps}
            >
              {loop(dataSource, forceRenderKey)}
            </TreeSelect>
            <Icon className={styles.searchIcon} type="search" onClick={() => setVisible(true)} />
          </div>
          <SelectorModal
            onCancel={() => setVisible(false)}
            multiple={multiple}
            onOk={handlerChange}
            withAuth={withAuth}
            onCategoryReload={onCategoryReload}
            visible={visible}
          />
        </div>
        {addonAfter ? <span className="ant-input-group-addon">{addonAfter}</span> : null}
      </Group>
    </>
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
    return map(value, 'label').join('、')
  }
  if (!value) return;
  const { label, value: id } = value;
  switch (showMode) {
    case 'link':
      return renderlinkEle(id, label, linkTo)
    case 'custom':
      return customShow && customShow(id, label);
    default:
      return label;
  }
}

const EditSelector = withEdit((props: ReadElementProps) => renderReadElement(props))(SelectorFormItem);

function ConnectComp(props: SelectorFormItemProps) {
  return <EditSelector {...props} />
}

export default connect(({ selectors }: any) => ({
  listUserGroupCategoryTree: selectors.listUserGroupCategoryTree,
  listUserGroupCategoryTreeByAuth: selectors.listUserGroupCategoryTreeByAuth,
}),
  (dispatch: Dispatch<any>) => ({
    fetchListCategory: (payload: any) => dispatch({ type: 'selectors/fetchListCategory', payload }),
    fetchListUserGroup: (payload: any) => dispatch({ type: 'selectors/fetchListUserGroup', payload }),
  }))(ConnectComp)