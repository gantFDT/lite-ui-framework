import React, { useEffect, useState, useRef } from 'react';
import { Form, Input, Radio, Icon as IconAntd, Row, Col, InputNumber } from 'antd'
import { Header } from 'gantd'
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
        const { list = [],...restParams } = carouselWidget;
        dispatch({
            type: 'carouselWidget/save',
            payload: {
                activeIndex: index
            }
        })
        renderConfig({...restParams,...list[index]})
    }

    const handleAddImage = (ret) => {
        console.log('ret',ret)
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

    const onBaseChange = (type, e) => {
        let { list = [] } = carouselWidget;
        dispatch({
            type: 'carouselWidget/modifyData',
            payload: {
                list: list,
                [type]: e.target.value,
                widgetKey: widgetKey
            }
        })
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
            <Col span={_.isEmpty(list) ? 24 : 12} style={{ height: '100%', padding: '10px' }}>
                <div className={styles.displayWrap}>
                    {(activeIndex || activeIndex == 0) && !_.isEmpty(list) &&
                        <div className={styles.display} style={{ backgroundImage: `url(${activeItem.img})` }}>
                            <div className={styles.deleteicon} onClick={() => handleDelete()}><IconAntd type="delete" /></div>
                            <span className={styles.span} style={{
                                top: activeItem.layoutV == 't' && 0,
                                left: activeItem.layoutH == 'l' && 0,
                                bottom: activeItem.layoutV == 'b' && 0,
                                right: activeItem.layoutH == 'r' && 0,
                                color: activeItem.colorMode == 'black' ? '#000' : '#fff'
                            }}>
                                <p className={styles.title}
                                    style={{
                                        textAlign: activeItem.layoutH == 'l' ? 'left' : 'right'
                                    }}>{activeItem.title}</p>
                                <p className={styles.content}
                                    style={{
                                        textAlign: activeItem.layoutH == 'l' ? 'left' : 'right'
                                    }}>{activeItem.content}</p>
                            </span>
                        </div>
                    }
                    <div className={styles.displayItemWrap}>
                        {!_.isEmpty(list) && list.map((item: object, index: number) =>
                            <div
                                key={index}
                                className={classnames(styles.displayItem, _.isEqual(item, activeItem) ? styles.active : '')}
                                style={{
                                    backgroundImage: `url(${item['img']})`,
                                    maxWidth: '100px'
                                }}
                                onClick={() => handleSetActive(index)}
                            >
                            </div>
                        )}
                        <ImageSelector
                            shape="rectangle"
                            onConfirm={(ret: any) => handleAddImage(ret)}
                            ratio={16 / 9}
                            cropperWidth={1000}
                            className={classnames(styles.displayItem, 'aligncenter')}
                            style={{ border: '1px solid rgba(128,128,128,0.2)', borderRadius: '3px', textAlign: 'center', }}
                        >
                            <IconAntd type='plus' style={{
                                height: _.isEmpty(list) ? 'calc(100vh - 80px)' : '60px',
                                width: _.isEmpty(list) ? '960px' : '100px',
                                lineHeight: _.isEmpty(list) ? 'calc(100vh - 80px)' : '60px',
                                fontSize: _.isEmpty(list) ? '100px' : '24px'
                            }} />
                        </ImageSelector>
                    </div>
                </div>
                {!_.isEmpty(list) && <>
                    <Form.Item {...formItemLayout} label={tr('是否自动切换')} >
                        {getFieldDecorator('autoPlay', {
                            rules: [{
                                // required: true,
                                // message: tr('请选择文字布局'),
                            }],
                            initialValue: 'true'
                        })(
                            <Radio.Group buttonStyle="solid" onChange={(e) => onBaseChange('autoPlay', e)}>
                                <Radio.Button value="true">{tr('是')}</Radio.Button>
                                <Radio.Button value="false">{tr('否')}</Radio.Button>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    {/* <Form.Item {...formItemLayout} label={`${tr('切换时间间隔')}(${tr('秒')})`} >
                        {getFieldDecorator('interval', {
                            rules: [{
                                required: true,
                                message: tr('请设置切换时间间隔'),
                            }],
                            initialValue: '3'
                        })(
                            <InputNumber min={1} max={10} onChange={(value) => onBaseChange('interval', { target: { value } })} />
                        )}
                    </Form.Item> */}
                    <Form.Item {...formItemLayout} label={tr('操作条位置')} >
                        {getFieldDecorator('actionPosition', {
                            rules: [{
                                // required: true,
                                // message: tr('请选择文字布局'),
                            }],
                            initialValue: 'bottom'
                        })(
                            <Radio.Group buttonStyle="solid" onChange={(e) => onBaseChange('actionPosition', e)}>
                                <Radio.Button value="top">{tr('上')}</Radio.Button>
                                <Radio.Button value="bottom">{tr('下')}</Radio.Button>
                                {/* <Radio.Button value="left">{tr('左')}</Radio.Button>
                                <Radio.Button value="right">{tr('右')}</Radio.Button> */}
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label={tr('切换效果')} >
                        {getFieldDecorator('effect', {
                            rules: [{
                                // required: true,
                                // message: tr('请选择文字布局'),
                            }],
                            initialValue: 'scrollx'
                        })(
                            <Radio.Group buttonStyle="solid" onChange={(e) => onBaseChange('effect', e)}>
                                <Radio.Button value="scrollx">{tr('滑动')}</Radio.Button>
                                <Radio.Button value="fade">{tr('渐显')}</Radio.Button>
                            </Radio.Group>
                        )}
                    </Form.Item>
                </>}
            </Col>
            <Col span={_.isEmpty(list) ? 0 : 12} style={{ height: '100%', padding: '10px' }}>
                {(activeIndex || activeIndex == 0) && !_.isEmpty(list) && <Form layout="vertical" style={{ width: '100%' }} ref={thisRef}>
                    <Header title="信息" type='num' num={1} bottomLine={false} />

                    <Form.Item {...formItemLayout} label={tr('标题')}>
                        {getFieldDecorator('title', {
                            rules: [{
                                // required: true,
                                // message: tr('请输入标题'),
                            }],
                        })(
                            <Input placeholder={tr('请输入标题')} onChange={(e) => onChange('title', e)} />
                        )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label={tr('内容')}>
                        {getFieldDecorator('content', {
                            rules: [{
                                // required: true,
                                // message: tr('请输入内容'),
                            }],
                        })(
                            <TextArea placeholder={tr('请输入内容')} autoSize={{ minRows: 2, maxRows: 6 }} onChange={(e) => onChange('content', e)} />
                        )}
                    </Form.Item>
                    <Header title={tr("链接")} type='num' num={2} bottomLine={false} />
                    <Form.Item {...formItemLayout} label={tr('链接地址')}>
                        {getFieldDecorator('url', {
                            rules: [{

                            }],
                            initialValue: ''
                        })(
                            <Input placeholder={tr('请输入链接')} onChange={(e) => onChange('url', e)} />
                            // <Url placeholder={tr('请输入链接')} onChange={this.onChange.bind(this,'url')} edit />

                        )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label={tr('打开方式')}>
                        {getFieldDecorator('urlTarget', {
                            rules: [{

                            }],
                            initialValue: '_blank'
                        })(
                            <Radio.Group buttonStyle="solid" onChange={(e) => onChange('urlTarget', e)} >
                                <Radio.Button value="_blank">{tr('新页面')}</Radio.Button>
                                <Radio.Button value="_self">{tr('当前页面')}</Radio.Button>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <Header title={tr("文字布局")} type='num' num={3} bottomLine={false} />
                    <Form.Item {...formItemLayout} label={tr('横向')} >
                        {getFieldDecorator('layoutH', {
                            rules: [{
                                // required: true,
                                // message: tr('请选择文字布局'),
                            }],
                            initialValue: 'l'
                        })(
                            <Radio.Group buttonStyle="solid" onChange={(e) => onChange('layoutH', e)} >
                                <Radio.Button value="l">{tr('左')}</Radio.Button>
                                <Radio.Button value="r">{tr('右')}</Radio.Button>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label={tr('纵向')} >
                        {getFieldDecorator('layoutV', {
                            rules: [{
                                // required: true,
                                // message: tr('请选择文字布局'),
                            }],
                            initialValue: 't'
                        })(
                            <Radio.Group buttonStyle="solid" onChange={(e) => onChange('layoutV', e)}>
                                <Radio.Button value="t">{tr('上')}</Radio.Button>
                                <Radio.Button value="b">{tr('下')}</Radio.Button>
                            </Radio.Group>
                        )}
                    </Form.Item>

                    <Header title={tr("文字颜色")} type='num' num={4} bottomLine={false} />
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
        {/* <div
                className="widgetconfigfooter"
            >
                <Button size="small"  
                    style={{
                        marginRight: 8,
                    }}
                    onClick={() => onClose()}
                > {tr('取消')}</Button>
                <Button size="small"  
                    onClick={this.save}
                    htmlType="submit"
                    disabled={hasErrors(getFieldsError())}
                    type="primary"
                >{tr('确定')}</Button>
            </div> */}
    </>
    )

}


export default connect(({ carouselWidget, loading }: { carouselWidget: any, loading: any }) => ({
    carouselWidget,
    loading,
}))(Form.create()(Page))