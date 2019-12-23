import React, { useEffect, useState, useRef } from 'react';
import { Form, Input, Radio, Icon as IconAntd, Row, Col } from 'antd'
import { BlockHeader } from 'gantd'
import { connect } from 'dva';
import styles from './index.less'
import classnames from 'classnames'
import ImageSelector from '@/components/form/upload/ImageSelector';
import { getImageById } from '@/utils/utils'
import { turnRightFileApi } from '@/services/file'

const formItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};
const { TextArea } = Input;


const Page = (props: any) => {

    const thisRef = useRef()
    const { carouselWidget = {}, dispatch, widgetKey, form } = props;
    const { list = [], activeIndex = 0 } = carouselWidget;
    const activeItem = list[activeIndex]
    const { getFieldDecorator } = form;


    // 回显配置信息
    const renderConfig = (item) => {
        form.setFieldsValue({ ...item });
    };

    const handleSetActive = (index) => {
        const { list = [] } = carouselWidget;
        dispatch({
            type: 'carouselWidget/save',
            payload: {
                activeIndex: index
            }
        })
        renderConfig(list[index])
    }

    const handleAddImage = (ret) => {
        let { list = [] } = carouselWidget;
        list.push({
            title: '',
            content: '',
            pictureId: ret.id,
            img: getImageById(ret.id),
            layoutH: 'l',
            layoutV: 't',
            url: '',
            urlTarget: '_blank',
            colorMode: 'white'
        })
        turnRightFileApi({
            recTypeId: 0, // 关联业务类型id
            recId: 0, // 关联业务对象id
            subRecTypeId: 0, // 关联子业务类型id
            subRecId: 0, // 关联子业务对象id
            description: tr('轮播图片'),
            id: ret.id
        })
        save(list)
        dispatch({
            type: 'carouselWidget/save',
            payload: {
                activeIndex: list.length - 1,
            }
        })
    }

    const save = (list) => {

        dispatch({
            type: 'carouselWidget/modifyData',
            payload: {
                list: list,
                widgetKey: widgetKey
            }
        })
    }

    const onChange = (type, e) => {
        let { list = [], activeIndex = 0 } = carouselWidget;
        let value = e.target.value;
        list[activeIndex][type] = value
        save(list);
    }

    const handleDelete = () => {

        let { list = [], activeIndex = 0 } = carouselWidget;
        list.splice(activeIndex, 1)
        save(list)
    }



    useEffect(() => {
        handleSetActive(0)
    }, []);



    return (<>
        <Row style={{ height: '100%' }}>
            <Col span={12} style={{ height: '100%', padding: '10px' }}>
                {(activeIndex || activeIndex == 0) && !_.isEmpty(list) && <Form layout="vertical" style={{ width: '100%' }} ref={thisRef}>
                    <BlockHeader title={tr("文字颜色")} type='num' num={4} bottomLine={false} />
                    <Form.Item {...formItemLayout} >
                        {getFieldDecorator('colorMode', {
                            rules: [{
                                // required: true,
                                // message: tr('请选择文字颜色'),
                            }],
                            initialValue: 'white'
                        })(
                            <Radio.Group buttonStyle="solid" onChange={(e) => onChange('colorMode', e)}>
                                <Radio.Button value="black">{tr('黑')}</Radio.Button>
                                <Radio.Button value="white">{tr('白')}</Radio.Button>
                            </Radio.Group>
                        )}
                    </Form.Item>
                </Form>
                }
            </Col>
        </Row>
    </>
    )
}

export default connect(({ widgetTodoList, loading }: { widgetTodoList: any, loading: any }) => ({
    widgetTodoList,
    loading,
}))(Form.create()(Page))
