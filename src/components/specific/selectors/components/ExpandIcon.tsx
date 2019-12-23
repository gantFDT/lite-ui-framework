import React from 'react';
import { Icon } from 'antd';

function ExpandIcon(props: any) {
    const { isTree }: { isTree: boolean } = props;
    if (!isTree) return null;
    let type, prefix;
    if (!props.expandable) {
        type = 'file';
        prefix = null;
    } else if (props.expanded) {
        type = 'folder-open';
        prefix = 'expanded';
    } else {
        type = 'folder';
        prefix = 'collapsed';
    }
    return (<span onClick={(e: any) => props.onExpand(props.record, e)} style={{ paddingLeft: prefix ? 0 : 17 }}>
        {prefix && <span className={"ant-table-row-expand-icon ant-table-row-" + prefix} />}
        <Icon
            className="marginh5"
            type={type}
            theme="filled"
        />
    </span>);
}
export default ExpandIcon