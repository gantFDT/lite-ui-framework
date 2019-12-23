import React, { Component } from 'react'
import { connect } from 'dva';

import { Tree, Input } from 'antd';
import styles from './index.less'
import _ from 'lodash';
const { TreeNode } = Tree;
const { Search } = Input;


@connect(({ preferencesmanage, loading }) => ({
  ...preferencesmanage,
  loading: loading.effects['preferencesmanage/getAllParams'],
}))
class SearchPerTree extends Component {
  state = {
    autoExpandParent: true
  };

  componentWillReceiveProps(nextProps){
    const { allTreeData } = nextProps
    
  }

  onExpand = expandedKeys => {
    this.props.dispatch({
      type:'preferencesmanage/save',
      payload:{
        expandedKeys
      }
    })
    this.setState({
      autoExpandParent: false
    });
  };

  //搜索框搜索时
  onSearchChange = value => {
    this.props.dispatch({
      type: 'preferencesmanage/searchFilterParams',
      payload: {
        searchKey: value,
      }
    })
  }

  onSelectLeaf = (value, e) => {
    let isLastNode = e.node.props.children.length ? false : true
    this.props.dispatch({
      type: 'preferencesmanage/filterParams',
      payload: {
        selectKey: e.node.props.eventKey,
        isLastNode
      }
    })
  }

  render() {
    const { allTreeData,expandedKeys } = this.props
    const { autoExpandParent } = this.state;

    return (
      <div className={styles.treePanel}>
        <Search style={{ marginBottom: 8 }} placeholder={tr('搜索')} onSearch={this.onSearchChange} />
        <Tree
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onSelect={this.onSelectLeaf}
          treeData={allTreeData}
        >
        </Tree>
      </div>
    )
  }

}

export default SearchPerTree

