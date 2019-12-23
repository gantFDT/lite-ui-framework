import React, { useState, useCallback, useRef, useMemo } from 'react';
import { Button, Radio, Switch, Empty } from 'antd';
import { BlockHeader, EditStatus, SwitchStatus } from 'gantd';
import { SmartTable, UserSelector, UserSelectorEdit } from '@/components/specific'
import { Title } from '@/components/common';
import FormSchema, { Schema, Types } from '@/components/form/schema';

const dataSource = [
    {
        id: '1',
        name: 'Mr Zhang',
        userId: 10,
        desc: 'no description now'
    },
    {
        id: '2',
        name: 'Ms Ling',
        userId: 27,
        desc: 'no description too'
    }
]

function Demo1() {
    const [value, setValue] = useState(undefined);
    const [multiple, setMultiple] = useState(false);
    const onChange = useCallback((value) => {
        console.log(value)
        setValue(value)
    }, [])

    return <>
        <div style={{ marginTop: 10 }}>
            <Switch checkedChildren="多选" unCheckedChildren="单选" onChange={(checked) => {
                setMultiple(checked)
                setValue(undefined)
            }} />
        </div>
        <div style={{ width: 300, padding: '10px 0' }}>
            <UserSelector
                edit={EditStatus.EDIT}
                value={value}
                multiple={multiple}
                onChange={onChange}
            // valueProp='userLoginName'
            />
        </div>
    </>
}

function Demo2() {
    const [formEdit, setFormEdit] = useState(EditStatus.CANCEL);
    const formRef = useRef<any>({} as any);

    function onItemSave(id: string, value: any, cb: Function) {
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
        required: [],
        propertyType: {
            user: {
                title: tr('用户'),
                type: Types.string,
                componentType: "UserSelector",
                props: {
                    showMode: 'popover'
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
                title: tr('用户'),
                fieldName: "userId",
                render: (text: string, record: any) => {
                    return <UserSelector
                        value={text}
                        allowEdit={false}
                        showMode={radioValue}
                        linkTo='/home'
                        customShow={customShow}
                    />
                },
                editConfig: {
                    render: (text: string, record: any, index: number) => {
                        return <UserSelectorEdit
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

function Demo4() {
    const { View: UserSelectorView } = UserSelector;
    const [visible, setVisible] = useState(false);

    const ref = useRef(null);

    const visibleControl = () => {
        setVisible(visible => !visible)
    }

    const omSubmit = () => {
        if (ref && ref.current) {
            const { selectedRowKeys, selectedRows } = ref.current.getValues();
            console.log(selectedRowKeys, selectedRows)
        }
    }

    return <>
        <BlockHeader
            size='small'
            title={tr('View层展示')}
            bottomLine
            extra={<>
                <Button
                    className='margin5'
                    size='small'
                    onClick={visibleControl}
                >{visible ? tr('隐藏') : tr('展开')}</Button>
            </>}
        >
        </BlockHeader>
        <Button onClick={omSubmit}>{tr('获取values')}</Button>
        <div style={{ padding: 10 }}>{visible ? <UserSelectorView viewRef={ref} /> : <Empty description={tr('点击按钮进行渲染')} />}</div>
    </>
}

function DividerBox({ children }: { children: React.ReactElement }) {
    return <div style={{ padding: 10, marginBottom: 10, border: '1px solid #e8e8e8' }}>{children}</div>
}

function User() {
    return <>
        <DividerBox><Demo1 /></DividerBox>
        <DividerBox><Demo2 /></DividerBox>
        <DividerBox><Demo3 /></DividerBox>
        <DividerBox><Demo4 /></DividerBox>
    </>
}


export default User