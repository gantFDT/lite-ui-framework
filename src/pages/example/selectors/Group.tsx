import React, { useState, useCallback, useRef, useMemo } from 'react';
import { Button, Switch, Radio } from 'antd';
import { EditStatus, SwitchStatus } from 'gantd';
import { SmartTable, GroupSelector, GroupSelectorEdit } from '@/components/specific'
import { Title } from '@/components/common';
import FormSchema, { Schema, Types } from '@/components/form/schema';

const filterObj = {
    id1: 'E4GGUBmxwc0YNDeWDDt',
    id2: 'sH47bl7MkZcQc9I6OZG'
}

const dataSource = [
    {
        id: '1',
        name: 'Mr Zhang',
        groupId: 'sH47bl7MkZcQc9I6OZG',
        desc: 'no description now'
    },
    {
        id: '2',
        name: 'Ms Ling',
        groupId: 'ruHtFc9x60OjMLKqxy0',
        desc: 'no description too'
    }
]

function Demo1() {
    const [value, setValue] = useState(undefined);
    const [radioValue, setRadioValue] = useState('default');
    const [filterId, setFilterId] = useState('');
    const [multiple, setMultiple] = useState(false);

    const onChange = useCallback((value) => {
        console.log(value)
        setValue(value)
    }, [])

    const setFilter = (e: any) => {
        let value = e.target.value;
        value == 'default' ? setFilterId('') : setFilterId(filterObj[value]);
        setRadioValue(value);
    }

    return <>
        <Radio.Group value={radioValue} onChange={setFilter} size='small' style={{ marginRight: 10 }}>
            <Radio.Button value="default">{tr('无前置过滤项')}</Radio.Button>
            <Radio.Button value="id1">{tr('过滤')} BBB供应商</Radio.Button>
            <Radio.Button value="id2">{tr('过滤')} 甘棠软件</Radio.Button>
        </Radio.Group>
        <div style={{ marginTop: 10 }}>
            <Switch checkedChildren="多选" unCheckedChildren="单选" onChange={(checked) => {
                setMultiple(checked)
                setValue(undefined)
            }} />
        </div>
        <div style={{ width: 300, padding: '10px 0' }}>
            <GroupSelector
                edit={EditStatus.EDIT}
                value={value}
                excludeId={filterId}
                multiple={multiple}
                onChange={onChange}
            />
        </div>
    </>
}

function Demo2() {
    const [formEdit, setFormEdit] = useState(EditStatus.CANCEL);
    const formRef = useRef<any>({} as any);

    function onItemSave(id: string, value: any, cb: Function) {
        console.log(id, value, cb)
        cb && cb()
    }

    const handleSubmit = useCallback(async () => {
        if (!formRef.current) return;
        const { errors, values } = await formRef.current.validateForm();
        if (errors) return;
        console.log(values)
    }, [])

    const formSchema: Schema = {
        type: Types.object,
        required: ['userId', 'roleId'],
        propertyType: {
            group: {
                title: tr('组织机构'),
                type: Types.string,
                componentType: "GroupSelector",
                props: {
                    showMode: 'popover',
                }
            },
            input1: {
                title: tr('输入框1'),
                type: Types.string,
            },
            input2: {
                title: tr('输入框2'),
                type: Types.string,
            }
        }
    }

    return <>
        <Button
            className='margin5'
            size='small'
            onClick={() => setFormEdit(SwitchStatus)}
        >{tr('编辑模式切换')}</Button>
        <Button
            onClick={handleSubmit}
            className='margin5'
            size='small'
        >{tr('提交')}</Button>
        <FormSchema
            wrappedComponentRef={formRef}
            edit={formEdit}
            schema={formSchema}
            onSave={onItemSave}
            uiSchema={{
                "ui:labelCol": {},
                "ui:wrapperCol": {},
                "ui:col": 6,
            }}
        />
    </>
}

function Demo3() {
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [radioValue, setRadioValue] = useState('simple');
    const [editting, setEditting] = useState(false);

    const customShow = (text: string, record: object) => {
        console.log(text, record)
        return tr('自定义内容')
    }

    const tableSchema = useMemo(() => {
        return [
            {
                title: tr('姓名'),
                fieldName: "name",
            },
            {
                title: tr('组织机构'),
                fieldName: "groupId",
                render: (text: string, record: any) => {
                    return <GroupSelector
                        value={text}
                        allowEdit={false}
                        showMode={radioValue}
                        linkTo='/home'
                        customShow={customShow}
                    />
                },
                editConfig: {
                    render: (text: string, record: any, index: number) => {
                        return <GroupSelectorEdit
                            onChange={(val: string) => console.log('edit', val)}
                        />
                    },
                }
            },
            {
                title: tr('描述'),
                fieldName: "desc",
            }
        ]
    }, [radioValue])

    const handleSelect = useCallback((selectedRowKeys, selectedRows) => {
        setRowKeys(selectedRowKeys)
        setRows(selectedRows)
    }, [setRowKeys, setRows])

    const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        onChange: handleSelect,
        type: 'radio',
        clickable: true,
        columnWidth: 40
    };
    return <SmartTable
        title={<Title title={tr("行内编辑+只读内容的模式切换")} showSplitLine showShortLine />}
        rowKey="id"
        editable={editting ? EditStatus.EDIT : EditStatus.CANCEL}
        rowSelection={rowSelection}
        schema={tableSchema}
        dataSource={dataSource}
        headerRight={<>
            <Button
                size="small"
                className="marginH5"
                onClick={() => { setEditting(edit => !edit) }}
            >
                {editting ? tr("结束编辑") : tr("进入编辑")}
            </Button>
            <Radio.Group value={radioValue} onChange={(e) => { setRadioValue(e.target.value) }} size='small'>
                <Radio.Button value="simple">{tr('简单模式')}-({tr('默认')})</Radio.Button>
                <Radio.Button value="popover">{tr('气泡模式')}</Radio.Button>
                <Radio.Button value="link">{tr('link跳转模式')}</Radio.Button>
                <Radio.Button value="mixed">{tr('气泡+link混合模式')}</Radio.Button>
                <Radio.Button value="custom">{tr('自定义模式')}</Radio.Button>
            </Radio.Group>
        </>}
    />
}

function DividerBox({ children }: { children: React.ReactElement }) {
    return <div style={{ padding: 10, marginBottom: 10, border: '1px solid #e8e8e8' }}>{children}</div>
}

function Group() {
    return <>
        <DividerBox><Demo1 /></DividerBox>
        <DividerBox><Demo2 /></DividerBox>
        <DividerBox><Demo3 /></DividerBox>
    </>
}


export default Group