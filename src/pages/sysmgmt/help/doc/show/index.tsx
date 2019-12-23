import React, { useEffect, ReactElement, useState, useMemo, useCallback } from 'react'
import { Row, Col, Tree, Input, Affix } from 'antd'
import { AntTreeNode, AntTreeNodeSelectedEvent } from 'antd/lib/tree'
import { Card } from 'gantd'
import _ from 'lodash'
import { getContentHeight } from '@/utils/utils'
import { connect } from 'dva'
import { DocumentView } from '../components'
import { findTitleMatchNodes, findParentNodes, useCardHeight } from '../utils'
import styles from './index.less'

const { DirectoryTree, TreeNode } = Tree
const { Search } = Input

export const Page = (props: any) => {
  const {
    dispatch,
    docDirectory,
    searchValue,
    expandedKeys,
    viewDoc,
    fetchDocLoading,
    fetchDocDirectoryLoaidng,
    selectedKeys,
    location,
    MAIN_CONFIG
  } = props
  const { headerHeight, showBreadcrumb } = MAIN_CONFIG
  const minHeight = useCardHeight(MAIN_CONFIG)
  const minTreeHeight = getContentHeight(MAIN_CONFIG, 62)
  const maxTreeHeight = getContentHeight(MAIN_CONFIG, 30)
  const [isAffix, setIsAffix] = useState<boolean>(false)
  const docHeight = useMemo(() => {
    return isAffix && showBreadcrumb ? maxTreeHeight : minTreeHeight
  }, [isAffix, showBreadcrumb, maxTreeHeight, minTreeHeight])
  const { query = { path: '' } } = location

  // 查看文档目录
  const findHelpTreeByType = () => {
    dispatch({
      type: 'helpDocShow/findHelpTreeByType',
      payload: { path: query.path }
    })
  }

  // 清空数据
  const clearModal = useCallback(() => {
    dispatch({ type: 'helpDocShow/clear' })
  }, [])

  useEffect(() => {
    findHelpTreeByType()
    return () => {
      clearModal()
    }
  }, [])

  // 节点渲染
  const renderTreeNode = (nodes: object[]) => {
    return nodes.map((item: any) => {
      const { id, title, children, isLeaf, isHelpDoc, path, parentResourceId } = item
      const addProps = { id, name: title, isLeaf, isHelpDoc, value: title, path: path, children }
      let searchIndex = title.indexOf(searchValue)
      let nodeTitle: ReactElement
      if (searchValue && searchIndex !== -1) {
        let preTitle = <span className={styles.searchNodeText}>{title.slice(0, searchIndex)}</span>
        let searcTitle = <span>{searchValue}</span>
        let afterTtile = <span className={styles.searchNodeText}>{title.slice(searchIndex + searchValue.length)}</span>
        nodeTitle = (
          <>
            {preTitle}
            {searcTitle}
            {afterTtile}
          </>
        )
      } else {
        nodeTitle = <span>{title}</span>
      }
      return (
        <TreeNode
          key={id}
          title={nodeTitle}
          {...addProps}
          selectable={parentResourceId === 'ROOT' ? false : true}
        >
          {children && renderTreeNode(children)}
        </TreeNode>)
    })
  }

  // 搜索关键字改变
  const onSearchValueChange = _.debounce((value) => {
    // 计算需要展开的节点
    let newExpandedKeys: string[] = value ? findTitleMatchNodes(docDirectory, value) : []
    if (newExpandedKeys.length === 0 && value === '' && selectedKeys.length) {
      findParentNodes(docDirectory, selectedKeys[0], newExpandedKeys)
    }
    dispatch({
      type: 'helpDocShow/updateState',
      payload: {
        searchValue: value,
        expandedKeys: newExpandedKeys
      }
    })
  }, 500)

  // 节点展开
  const onNodeExpand = (expandedKeys: string[]) => {
    dispatch({ type: 'helpDocShow/updateState', payload: { expandedKeys: expandedKeys } })
  }

  // 节点筛选
  const filterTreeNode = (node: AntTreeNode): boolean => {
    const { props: { name } } = node
    return searchValue && name.indexOf(searchValue) !== -1
  }

  // 树节点被点击
  const onSelect = (selectedKeys: string[], { node }: AntTreeNodeSelectedEvent) => {
    const { props: { isLeaf, isHelpDoc = false, id } } = node
    if (isLeaf) {
      dispatch({
        type: 'helpDocShow/findHelpDocument',
        payload: { topicId: id, isHelpDoc }
      })
    } else {
      dispatch({
        type: 'helpDocShow/updateState',
        payload: { selectedKeys: [id] }
      })
    }
  }

  return (
    <div>
      <Row gutter={8}>
        <Col span={6}>
          <Affix
            offsetTop={headerHeight + 10}
            onChange={e => setIsAffix(e as boolean)}
          >
            <Card
              loading={fetchDocDirectoryLoaidng}
            >
              <Search
                style={{ marginBottom: 8 }}
                placeholder={tr('搜索')}
                onChange={e => onSearchValueChange(e.target.value)}
              />
              <DirectoryTree
                expandedKeys={expandedKeys}
                selectedKeys={selectedKeys}
                onExpand={onNodeExpand}
                filterTreeNode={filterTreeNode}
                onSelect={onSelect}
                style={{ height: docHeight }}
                className={styles.dictoryTree}
              >
                {renderTreeNode(docDirectory)}
              </DirectoryTree>
            </Card>
          </Affix>
        </Col>
        <Col span={18}>
          <DocumentView
            loading={fetchDocLoading}
            minHeight={minHeight}
            viewDoc={viewDoc}
          />
        </Col>
      </Row>
    </div>)
}

export default connect(({ helpDocShow, settings, loading, routing }: any) => ({
  docDirectory: helpDocShow.docDirectory,
  searchValue: helpDocShow.searchValue,
  expandedKeys: helpDocShow.expandedKeys,
  MAIN_CONFIG: settings.MAIN_CONFIG,
  viewDoc: helpDocShow.viewDoc,
  fetchDocDirectoryLoaidng: loading.effects['helpDocShow/findHelpTreeByType'],
  fetchDocLoading: loading.effects['helpDocShow/findHelpDocument'],
  selectedKeys: helpDocShow.selectedKeys,
  location: routing.location
}))(Page)
