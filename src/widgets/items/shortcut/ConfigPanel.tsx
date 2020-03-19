import React, { Component } from 'react';
import { Button, Form, Input, Radio, TreeSelect, message } from 'antd'
import { Header, Icon } from 'gantd'
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { connect } from 'dva';
import styles from './index.less'
import { getTreeNode } from '@/utils/utils'


const { TreeNode } = TreeSelect;
const DragHandle = SortableHandle(() => <Icon type="menu" className={styles.dragHandle} />);

const SortableItem = SortableElement(
    ({ value, onDelete }) => {
        return <li className={styles.dragItem}>
            {value.icon ? <Icon type={value.icon} className={styles.icon} /> : <></>}
            <p className={styles.name}>{value.name}</p>
            <div className={styles.deleteIcon} onClick={onDelete.bind(this, value)}>
                <Icon type="minus" />
            </div>
            <DragHandle />
        </li>
    }
);

const MySortableContainer = SortableContainer(({ children }) => {
    return <ul style={{ paddingLeft: '0px' }}>{children}</ul>;
});


function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const resoveMenuData = (data) => {
    const newData = _.cloneDeep(data)
    newData.shift()
    let serveMenuStr = JSON.stringify(newData);
    serveMenuStr = serveMenuStr.replace(/"name":/g, `"title":`)
    serveMenuStr = serveMenuStr.replace(/"id":/g, `"value":`)
    return JSON.parse(serveMenuStr)
}

@Form.create()
@connect(({ shortcutWidget, loading, menu }) => ({
    shortcutWidget,
    shortcut: shortcutWidget.shortcut,
    columns: shortcutWidget.columns,
    menuData: resoveMenuData(menu.serveMenu),
    loading: loading.effects['shortcutWidget/fetchData'],
}))
class LogoBandConfig extends Component {
    state = {
        items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
    };
    state = {
        value: undefined,
        searchValue: undefined
    };
    onChange = (value, name, extra) => {
        console.log('value',value)
        console.log('name',name)
        console.log('extra',extra)
        const { menuData, dispatch, shortcut, columns } = this.props;
        const node = getTreeNode(menuData, 'children', 'value', value);
        // if(_.isEmpty(shortcut)){return}
        if (node && node.leaf === false) {
            message.warning(tr('请选择叶子节点'));
            return
        }
        console.log('shortcut',shortcut)
        console.log('value',value)
        const hasThis = getTreeNode(shortcut, 'children', 'id', value);
        if (hasThis) {
            message.warning(tr('这个快捷方式已存在'));
            return
        }
        dispatch({
            type: 'shortcutWidget/updateConfigShortcut',
            payload: {
                shortcut: shortcut.concat({
                    name: node.title,
                    id: node.value,
                    path: node.path,
                    icon: node.iconPath
                }),
                columns: columns,
            }
        })
    };
    onSortEnd = ({ oldIndex, newIndex }) => {
        const { menuData, dispatch, shortcut, columns } = this.props;
        dispatch({
            type: 'shortcutWidget/updateConfigShortcut',
            payload: {
                shortcut: arrayMove(shortcut, oldIndex, newIndex),
                columns: columns,
            }
        })
    };
    radioChange = (e) => {
        const { menuData, dispatch, shortcut } = this.props;
        const value = e.target.value;
        dispatch({
            type: 'shortcutWidget/updateConfigShortcut',
            payload: {
                shortcut: shortcut,
                columns: value,
            }
        })
    }
    onDelete = (value) => {
        let { menuData, dispatch, shortcut, columns } = this.props;
        shortcut.map((item, index) => {
            if (item.id == value.id) {
                shortcut.splice(index, 1)
            }
        })
        dispatch({
            type: 'shortcutWidget/updateConfigShortcut',
            payload: {
                shortcut: shortcut,
                columns: columns,
            }
        })
    }
    render() {
        const { items, searchValue } = this.state;
        let { onClose, shortcutWidget = {}, menuData, shortcut = [], columns = '3' } = this.props;
        const { data = [] } = shortcutWidget;
        const {
            getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
        } = this.props.form;
        console.log('menuData',menuData)
        return (<>
            <Header title={tr("快捷方式")} type='num' num={1} bottomLine={false} />
            {!_.isEmpty(shortcut) && <MySortableContainer onSortEnd={this.onSortEnd} helperClass={styles.sortableHelper} useDragHandle>
                {shortcut.map((value, index) => (
                    <SortableItem key={`item-${value.id}`} index={index} value={value} onDelete={this.onDelete.bind(this)} />
                ))}
            </MySortableContainer>}
            <TreeSelect
                // searchValue={searchValue}
                treeNodeFilterProp='title'
                showSearch
                style={{ width: '100%', marginBottom: '10px' }}
                // value={this.state.value}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder={tr("添加快捷方式")}
                allowClear
                // onSearch={this.onSearch}
                treeDefaultExpandAll
                onChange={this.onChange}
                treeData={menuData}
            >
            </TreeSelect>
            {/* <Header title="布局" type='num' num={2} bottomLine={false} />
            <Radio.Group defaultValue="3" value={columns} buttonStyle="solid" onChange={this.radioChange}>
                <Radio value="1">1列</Radio>
                <Radio value="2">2列</Radio>
                <Radio value="3">3列</Radio>
                <Radio value="4">4列</Radio>
                <Radio value="6">6列</Radio>
                <Radio value="8">8列</Radio>
            </Radio.Group> */}
        </>
        )
    }
}

export default LogoBandConfig;
