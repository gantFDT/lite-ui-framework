
import React, { useState, useContext, useMemo } from 'react'
import { Button, Switch } from 'antd'
import { ResizableModal, ResizableProvider, ModalContext } from '@/components/common/modal'
import SmartModal from '@/components/specific/smartmodal'
import { generFields } from '@/components/specific/smarttable/fieldgenerator'
import styles from './styles.less';

const ButtonGroup = Button.Group;

const arrLen = new Array(6);

const mockSchema = {
    "type": "object",
    "required": ["fields_1"],
    "propertyType": {
    }
};
_.map(arrLen, (item, key) => {
    mockSchema.propertyType[`fields_${key + 1}`] = {
        title: `fields_${key + 1}`,
        "type": "string",
        "componentType": "Input",
    };
})


const ModalContent = ({ id }) => {
    const { state: { modals } } = useContext(ModalContext);
    const { width, height } = modals[id];
    return <div>
        <h4>使用自定义宽高400</h4>
        <div style={{ marginTop: 20 }}>动态宽高获取:</div>
        <div>{`width:${width}px`}</div>
        <div>{`height:${height}px`}</div>
    </div>
}

const Demo = () => {
    const [visible, setVisible] = useState(false)
    const [visible2, setVisible2] = useState(false)
    const [visible3, setVisible3] = useState(false)
    const [visible4, setVisible4] = useState(false)
    const [visible5, setVisible5] = useState(false)
    const [visible6, setVisible6] = useState(false)

    const [disabled6, setDisabled6] = useState(false)

    return (
        <div style={{ margin: 10 }}>
            <ResizableProvider maxZIndex={12} >
                <div style={{ marginBottom: 10 }}>
                    <ButtonGroup style={{ marginRight: 10 }}>
                        <Button size="small" onClick={() => { setVisible(true) }}>first-modal</Button>
                        <Button size="small" onClick={() => { setVisible2(true) }}>second-modal</Button>
                    </ButtonGroup>
                    <Button size="small" onClick={() => { setVisible3(true) }}>modaldialog</Button>
                </div>
                <ResizableModal
                    id='1'
                    title='第一个弹窗'
                    visible={visible}
                    footer={null}
                    onCancel={() => { setVisible(false) }}
                >
                    使用设置的通用宽高800
            </ResizableModal>
                <ResizableModal
                    itemState={{ height: 400, width: 400 }}
                    id='2'
                    title='第二个弹窗'
                    okBtnSolid
                    visible={visible2}
                    onCancel={() => { setVisible2(false) }}
                >
                    <ModalContent id='2' />
                </ResizableModal>
                <ResizableModal
                    itemState={{ height: 800, width: 400 }}
                    id='3'
                    title='模态窗口'
                    isModalDialog
                    visible={visible3}
                    onCancel={() => { setVisible3(false) }}
                >
                    必须关闭才能进行其他操作的弹窗
            </ResizableModal>
            </ResizableProvider>
            <div>
                <ButtonGroup style={{ marginRight: 10 }}>
                    <Button size="small" onClick={() => { setVisible4(true) }}>smart-modal (parse scheme)</Button>
                    <Button size="small" onClick={() => { setVisible5(true) }}>smart-modal (custom content)</Button>
                    <Button size="small" onClick={() => { setVisible6(true) }}>smart-modal (maximize)</Button>
                </ButtonGroup>
                <SmartModal
                    id='schememodal'
                    title='智能弹窗scheme解析'
                    visible={visible4}
                    schema={mockSchema}
                    values={{ fields_2: 123 }}
                    itemState={{
                        width: 760,
                        height: 600,
                    }}
                    onSubmit={(values) => { console.log('values=', values) }}
                    onCancel={() => { setVisible4(false) }}
                />
                <SmartModal
                    id='schememodal2'
                    title='智能弹窗自定义children+onSizeChange回调'
                    visible={visible5}
                    itemState={{
                        width: 760,
                        height: 600,
                    }}
                    onSizeChange={(width) => { console.log(width) }}
                    onSubmit={(e) => { console.log('e=', e) }}
                    onCancel={() => { setVisible5(false) }}
                >
                    自定义children
                </SmartModal>
                <SmartModal
                    id='schememodal3'
                    title='默认最大化窗口+最大化状态时窗口宽高根据浏览器窗口变化实时响应'
                    visible={visible6}
                    itemState={{ maximized: true }}
                    canMaximize={!disabled6}
                    canResize={!disabled6}
                    footer={null}
                    onCancel={() => { setVisible6(false) }}
                >
                    <div>
                        <div>禁止手动拖拽移动+禁止手动最大化最小化的切换?</div>
                        <Switch checkedChildren="是" unCheckedChildren="否" onChange={(checked) => { setDisabled6(checked) }} />
                    </div>
                </SmartModal>
            </div>
        </div>
    )
}
export default Demo