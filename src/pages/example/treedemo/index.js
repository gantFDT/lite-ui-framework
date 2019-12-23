import React, { useEffect } from 'react';
import { Card } from 'gantd';
import { Input, Icon, Button, Tree } from 'antd';
import styles from './styles.less';

const { TreeNode, DirectoryTree } = Tree;

const data1 = [
  { title: 'Positive impact', count: '8' },
  { title: 'Japan', count: '22' },
  { title: 'Top 100', count: '100' },
  { title: 'Positive impact2', count: '59' },
];
const data2 = [
  { title: 'hedge Fund', count: '10' },
  { title: 'Impact', count: '4' },
  { title: 'USA', count: '10' },
  { title: 'Eurozone', count: '10' },
]
const data3 = [
  { title: 'Potential Invest', count: '8' },
  { title: 'Thailand', count: '22' },
  { title: 'China', count: '100' },
  { title: 'Target', count: '59' },
]
const data4 = [
  { title: 'Euro Hedge funds', count: '8' },
  { title: 'Private Equaty', count: '22' },
  { title: 'Environment', count: '100' },
]

function titleElement(title, count, isTitle) {
  return <div style={{ fontWeight: isTitle ? 'bold' : 'normal', display: 'inline-block' }}>
    <span style={{ color: '#3D5695' }}>{title}</span>
    {count && <span style={{ color: '#9EAACA', marginLeft: 5 }}>{count}</span>}
         </div>
}
export default function TreeDemo(props) {
  // console.log(props)
  // useEffect(() => {
  //     console.log('didMount')
  // }, [])
  return <Card
    bodyStyle={{ padding: 0 }}
    style={{ minHeight: 600, border: 0 }}
  >
    <div className={styles.layoutBox}>
      <div className={styles.siderBox}>
        <Tree
          defaultExpandedKeys={['0-0']}
        >
          <TreeNode title={titleElement('My Lists', 4, true)} key="0-0">
            {data1.map(({ title, count }, index) => <TreeNode title={titleElement(title, count)} key={`${title}_${index}`}>
              <TreeNode title={titleElement(`${title}-child`)} key={`${title}_child_${index}`} />
                                                    </TreeNode>
            )}
          </TreeNode>
        </Tree>

        <Tree
          showIcon
          icon={null}
          defaultExpandedKeys={['0-0']}
        >
          <TreeNode title={titleElement('Organiization', 420, true)} key="0-0">
            {data2.map(({ title, count }, index) => <TreeNode
              icon={({ expanded }) => {
                return expanded ? <Icon type="folder-open" /> : <Icon type="folder" />
              }}
              title={titleElement(title, count)}
key={`${title}_${index}`}
            >
              <TreeNode
icon={({ expanded }) => {
                return expanded ? <Icon type="folder-open" /> : <Icon type="folder" />
              }}
title={titleElement(`${title}-second`)}
key={`${title}_second_${index}`}>
                <TreeNode
                  icon={<Icon type="file-pdf" />}
                  title={titleElement(`${title}-child`)}
                  key={`${title}_child_11${index}`}
                />
              </TreeNode>
                                                    </TreeNode>
            )}
            {data3.map(({ title, count }, index) => <TreeNode title={titleElement(title, count)} key={`${title}_${index}`}>
              <TreeNode title={titleElement(`${title}-child`)} key={`${title}_child_${index}`} />
                                                    </TreeNode>
            )}
          </TreeNode>
        </Tree>

        <DirectoryTree
          defaultExpandedKeys={['0-0']}
        >
          <TreeNode title={titleElement('Shared with me', 3, true)} key="0-0">
            {data4.map(({ title, count }, index) => <TreeNode title={titleElement(title, count)} key={`${title}_${index}`}>
              <TreeNode title={titleElement(`${title}-child`)} key={`${title}_child_${index}`} />
                                                    </TreeNode>
            )}
          </TreeNode>
        </DirectoryTree>
      </div>
      <div className={styles.contentBox}>content</div>
    </div>
         </Card>
}
