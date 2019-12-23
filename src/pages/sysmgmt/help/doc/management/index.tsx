import React, { useEffect, useState, useMemo } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import { Row, Col, Tree, Button, Icon, Tooltip, TreeSelect, List, Popover, Skeleton, message, Checkbox, Affix } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { Card, BlockHeader } from 'gantd'
import { SingleFileUpload } from '@/components/specific'
import { getContentHeight } from '@/utils/utils'
import { DocumentView } from '../components'
import { useCardHeight } from '../utils'
import DocEdit from './submodule/edit'
import styles from './index.less'

const { DirectoryTree, TreeNode } = Tree

const Page = (props: any) => {
  const {
    dispatch,
    docDirectory,
    expandedDocDirectoryKeys,
    viewDoc,
    fetchDocLoading,
    topicId,
    selectedValue,
    viewDocs = [],
    fetchViewDocsLoading,
    findTreeByTypeWithExportLoading,
    exportDocPopoverVisible,
    exportDocTree,
    selectedKeys,
    checkedAll,
    exportDocTreeIds,
    editing,
    editTopic,
    saveLoading,
    MAIN_CONFIG
  } = props
  const { headerHeight, showBreadcrumb } = MAIN_CONFIG
  const minHeight = useCardHeight(MAIN_CONFIG)
  const minDocHeight = getContentHeight(MAIN_CONFIG, 94)
  const maxDocHeight = getContentHeight(MAIN_CONFIG, 62)
  const [isFilter, setIsFilter] = useState<boolean>(false)
  const [isAffix, setIsAffix] = useState<boolean>(false)
  const docHeight = useMemo(() => {
    return isAffix && showBreadcrumb ? maxDocHeight : minDocHeight
  }, [isAffix, showBreadcrumb, headerHeight, showBreadcrumb])
  const showViewDocs = useMemo(() => {
    return isFilter ? viewDocs.filter((item: any) => item.topicStatus) : viewDocs
  }, [isFilter, viewDocs])

  // 查看文档目录
  const findHelpTreeByType = () => {
    dispatch({ type: 'helpDocManage/findHelpDocMenuTree' })
  }

  // 清空数据
  const clearModal = () => {
    dispatch({ type: 'helpDocManage/clear' })
  }

  useEffect(() => {
    findHelpTreeByType()
    return () => {
      clearModal()
    }
  }, [])

  // 节点渲染
  const renderTreeNode = (nodes: object[], TreeComponent: any, treeType: 'treeSelector' | 'tree', expandedKeys: string[] = []) => {
    return nodes.map((item: any) => {
      const { id, title, children, isLeaf, isHelpDoc, path } = item
      const addProps = { id, name: title, isLeaf, isHelpDoc, value: title, path: path, children_: children }
      let selectable = treeType === 'treeSelector'
        ? (children.length === 0 || !children ? true : false)
        : (false)
      return (
        <TreeComponent
          key={id}
          title={treeType === 'treeSelector'
            ? (<>
              <Icon type={Array.isArray(children) && children.length > 0 ? (expandedKeys.includes(id) ? 'folder-open' : 'folder') : 'file'} />
              &nbsp;{title}
            </>)
            : title}
          {...addProps}
          selectable={selectable}
        >
          {children && renderTreeNode(children, TreeComponent, treeType)}
        </TreeComponent>)
    })
  }

  // 导出文档
  const exportDoc = _.debounce((type: string): void => {
    if (type === 'multiple' && selectedKeys.length === 0) {
      message.warning(tr('请选择要导出的文档主题！'))
      return
    }
    dispatch({
      type: 'helpDocManage/exportDoc',
      payload: {
        type
      }
    })
  }, 300)


  // 树形选择器被选中
  const onTreeSeletorChange = (first, second, extra: any) => {
    const { triggerValue: value, triggerNode = { props: {} } } = extra
    const { props: { path, children } } = triggerNode
    if (children && children.length) return
    dispatch({
      type: 'helpDocManage/findDocsByPath',
      payload: {
        value, path
      }
    })
  }

  // 树节点checkbox被点击
  const onCheck = (checkedKeys: string[] | { checked: string[]; halfChecked: string[] }) => {
    dispatch({
      type: 'helpDocManage/updateState',
      payload: {
        selectedKeys: checkedKeys,
        checkedAll: _.difference(exportDocTreeIds, checkedKeys as string[]).length === 0
      }
    })
  }

  // 多选框
  const checkboxOnChange = ({ target: { checked } }: CheckboxChangeEvent) => {
    dispatch({
      type: 'helpDocManage/updateState',
      payload: {
        checkedAll: checked,
        selectedKeys: checked ? exportDocTreeIds : []
      }
    })
  }

  // 文档上传
  const onDocUploadSuccess = (file: any, isSingle?: boolean) => {
    let fileId = file.id
    dispatch({
      type: 'helpDocManage/importDoc',
      payload: {
        fileId,
        isSingle
      }
    })
  }

  // 新增或编辑
  const addOrEdit = (type?: string) => {
    let editTopic: any = { topicId: null, helpEditValue: '', title: '', attachmentList: [] }
    if (type !== 'add') {
      const { topicName: title, helpContent: helpEditValue, attachmentList } = viewDoc
      editTopic = {
        title,
        helpEditValue,
        attachmentList,
        topicId
      }
    }
    dispatch({
      type: 'helpDocManage/updateState',
      payload: {
        editing: true,
        editTopic
      }
    })
  }

  // 文档过滤
  const filterDocs = () => {
    if (isFilter) {
      dispatch({ type: 'helpDocManage/findDocsByPath', payload: { isRefresh: true } })
    }
    setIsFilter(!isFilter)
  }

  // 节点展开
  const onDocDirectoryTreeExpand = (expandedKeys: string[]) => {
    dispatch({ type: 'helpDocManage/updateState', payload: { expandedDocDirectoryKeys: expandedKeys } })
  }

  return (
    <>
      <DocEdit
        editing={editing}
        dispatch={dispatch}
        minHeight={minHeight}
        topic={editTopic}
        loading={saveLoading}
        headerHeight={headerHeight}
      />
      <div style={{ display: editing ? 'none' : '' }}>
        <Row gutter={8}>
          <Col span={6}>
            <Affix
              offsetTop={headerHeight + 10}
              onChange={e => setIsAffix(e as boolean)}
            >
              <Card>
                <TreeSelect
                  className={styles.treeSelector}
                  dropdownClassName={styles.treeSelect}
                  dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
                  placeholder={tr("目录选择")}
                  allowClear
                  showSearch
                  multiple={false}
                  treeDefaultExpandAll
                  value={selectedValue}
                  onChange={onTreeSeletorChange}
                  treeExpandedKeys={expandedDocDirectoryKeys}
                  onTreeExpand={onDocDirectoryTreeExpand}
                >
                  {renderTreeNode(docDirectory, TreeSelect.TreeNode, 'treeSelector', expandedDocDirectoryKeys)}
                </TreeSelect>
                <BlockHeader
                  title={tr('文档主题')}
                  extra={(
                    <div className={styles.operates}>
                      <Tooltip title={tr(isFilter ? '全显' : '过滤')}>
                        <Button size="small"
                          className={isFilter ? styles.filterBtn : ""}
                          icon='filter'
                          onClick={filterDocs}
                        />
                      </Tooltip>
                      <Tooltip title={tr('新增')}>
                        <Button size="small"
                          disabled={!selectedValue}
                          icon="plus"
                          onClick={addOrEdit.bind(null, 'add')}
                        />
                      </Tooltip>
                      <Popover
                        placement="bottomLeft"
                        trigger='click'
                        visible={exportDocPopoverVisible}
                        title={(
                          <BlockHeader
                            title={tr('文档导出')}
                            extra={(
                              <div className={styles.operates}>
                                <Checkbox checked={checkedAll} onChange={checkboxOnChange}>{tr('全选')}</Checkbox>
                                <Tooltip title={tr('导出')}>
                                  <Button size="small"
                                    icon="export"
                                    onClick={exportDoc.bind(null, 'multiple')}
                                  />
                                </Tooltip>
                                <Tooltip title={tr('取消')}>
                                  <Button size="small"
                                    icon="close"
                                    onClick={() => dispatch({ type: 'helpDocManage/updateState', payload: { exportDocPopoverVisible: false } })}
                                  />
                                </Tooltip>
                              </div>
                            )}
                          />
                        )}
                        content={
                          <div
                            className={styles.exportWrapper}>
                            <Skeleton loading={findTreeByTypeWithExportLoading} active>
                              <DirectoryTree
                                checkedKeys={selectedKeys}
                                selectedKeys={selectedKeys}
                                defaultExpandAll
                                checkable
                                multiple
                                onCheck={onCheck}
                                expandAction={false}
                              >
                                {renderTreeNode(exportDocTree, TreeNode, 'tree')}
                              </DirectoryTree>
                            </Skeleton>
                          </div>
                        }
                      >
                        <Tooltip title={tr('导出')}>
                          <Button size="small"
                            icon="export"
                            onClick={() => {
                              dispatch({ type: 'helpDocManage/findTreeByTypeWithExport' })
                            }} />
                        </Tooltip>
                      </Popover>
                      <SingleFileUpload
                        tooltip={tr('导入')}
                        onSuccess={onDocUploadSuccess}
                        extraBtnProps={{
                          icon: 'import'
                        }}
                      />
                    </div>
                  )}
                />
                <div
                  style={{ height: docHeight }}
                  className={styles.docsContainer}
                >
                  <List
                    loading={fetchViewDocsLoading}
                    size='small'
                    bordered
                    dataSource={showViewDocs}
                    locale={{ emptyText: selectedValue && selectedValue.length ? tr('暂无文档主题') : tr('请选择一个文档目录') }}
                    renderItem={(item: any) => {
                      const { topicName, id, topicStatus } = item
                      return (
                        <List.Item
                          onClick={() => { dispatch({ type: 'helpDocManage/findHelpDocument', payload: { topicId: id } }) }}
                          className={`${styles.docsItemWrapper} ${topicId === id ? styles.docsItemWrapperSelected : ''}`}
                        >
                          <div className={styles.docsItem}>
                            <span>{topicName}</span>
                            {!topicStatus && <Icon type='eye-invisible' />}
                          </div>
                        </List.Item>
                      )
                    }}
                  />
                </div>
              </Card>
            </Affix>
          </Col>
          <Col span={18}>
            <DocumentView
              editAble
              loading={fetchDocLoading}
              minHeight={minHeight}
              topicId={topicId}
              viewDoc={viewDoc}
              dispatch={dispatch}
              onEdit={addOrEdit}
              onImport={onDocUploadSuccess}
              onExport={exportDoc}
            />
          </Col>
        </Row>
      </div>
    </>)
}

export default connect(({ helpDocManage, settings, loading, login }: any) => ({
  docDirectory: helpDocManage.docDirectory,
  searchValue: helpDocManage.searchValue,
  expandedDocDirectoryKeys: helpDocManage.expandedDocDirectoryKeys,
  MAIN_CONFIG: settings.MAIN_CONFIG,
  viewDoc: helpDocManage.viewDoc,
  fetchDocDirectoryLoaidng: loading.effects['helpDocManage/findHelpTreeByType'],
  fetchDocLoading: loading.effects['helpDocManage/findHelpDocument'],
  selectedKeys: helpDocManage.selectedKeys,
  topicId: helpDocManage.topicId,
  selectedValue: helpDocManage.selectedValue,
  viewDocs: helpDocManage.viewDocs,
  fetchViewDocsLoading: loading.effects['helpDocManage/findDocsByPath'],
  findTreeByTypeWithExportLoading: loading.effects['helpDocManage/findTreeByTypeWithExport'],
  exportDocPopoverVisible: helpDocManage.exportDocPopoverVisible,
  exportDocTree: helpDocManage.exportDocTree,
  checkedAll: helpDocManage.checkedAll,
  exportDocTreeIds: helpDocManage.exportDocTreeIds,
  editing: helpDocManage.editing,
  editTopic: helpDocManage.editTopic,
  saveLoading: loading.effects['helpDocManage/saveDoc']
}))(Page)
