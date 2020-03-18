import React, { useCallback, useState, useMemo } from 'react';
import { Form, Button, Switch, Tabs, Icon, Radio, Row, Col, Progress, Input, InputNumber, message } from 'antd';
import { ColorPicker, Icon as GantIcon, Header, EditStatus } from 'gantd';
import { merge } from 'lodash';
// import PictureWall from './PictureWall';
import { cssVar2camel, isIE } from '@/utils/utils';
import styles from './index.less';
import { themes, JS_VAR_KEYS } from '@/themes/themes'
import themeConfigs from '@/themes'
import classnames from 'classnames'

const isIeBrowser = isIE();
const { TabPane } = Tabs;
const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 16 },
  },
}
const defaultThemeConfig = {
  BASE_CONFIG,
  LOGIN_CONFIG,
  MAIN_CONFIG
}

const dispatch = window['g_app']['_store']['dispatch']

const Page = (props: any) => {
  const { form, settings, tabPosition, height } = props;
  const { MAIN_CONFIG, LOGIN_CONFIG } = settings;
  const { getFieldDecorator } = form;
  const [themeLoading, setThemeLoading] = useState(false)
  const [themeLoadingPercent, setThemeLoadingPercent] = useState(0)
  const activeTheme = MAIN_CONFIG.theme;
  const themeType = MAIN_CONFIG.themeType

  let percent = 0;
  const changeTheme = useCallback((theme) => {
    dispatch({
      type: 'settings/changeSetting',
      payload: merge(
        {},
        defaultThemeConfig,
        theme.uiConfig,
        {
          MAIN_CONFIG: {
            ...cssVar2camel(themeConfigs[theme.value], JS_VAR_KEYS),
            theme: theme.value
          }
        }
      )
    })
  }, [])

  const reset = useCallback(() => {
    dispatch({
      type: 'settings/changeSetting',
      payload: merge(
        {},
        defaultThemeConfig
      )
    })
    // window.location.reload()
  }, [])

  const handleChangeTheme = useCallback((theme) => {
    if (isIeBrowser) {
      message.info(`${tr('更多主题切换与自定义配色功能请使用最新版谷歌')}、${tr('火狐')}、${tr('Edge或360浏览器进行体验')}`, 5)
      return
    }
    changeTheme(theme)
  }, [])

  const shouldThemeDisabled = useMemo(() => {
    return isIeBrowser
  }, [isIeBrowser])

  return (
    <div className={styles.wrap}>
      <Tabs tabPosition='top' size="small">
        <TabPane
          tab={
            <span>
              <GantIcon type="icon-theme" />
              {tr('主题')}
            </span>
          }
          key="1"
        >
          <Row gutter={10} style={{ padding: '0 10px 10px 10px', height }} className={styles.fixheight}>
            {
              themes.map((theme) =>
                <Col span={6} key={theme.value}>
                  <div className={classnames(styles.theme, (activeTheme == theme.value) && styles.active)} style={{ backgroundImage: `url(${theme.image})` }}>
                    <div className={styles.contentWrap}>
                      <div className={styles.title}>
                        {theme.name}
                      </div>
                      <div className={styles.intro}>
                        {theme.intro}
                      </div>
                    </div>
                    {activeTheme != theme.value &&
                      <div className={styles.actionWrap}>
                        {!themeLoading && <Button size="large" type="primary" onClick={handleChangeTheme.bind(null, theme)} className={classnames('btn-solid', styles.action)}>{tr('应用')}</Button>}
                        {themeLoading && <Progress type="circle" className={styles.progress} percent={themeLoadingPercent} />}
                      </div>
                    }
                  </div>
                </Col>
              )
            }

          </Row>
        </TabPane>
        <TabPane
          tab={
            <span>
              <GantIcon type="icon-settings" />
              {tr('配置')}
            </span>
          }
          key="2"
        >
          <Form layout='horizontal' className="fixed-label-from-h" labelAlign="right">
            <Tabs tabPosition={tabPosition}>
              <TabPane
                tab={
                  <span>
                    <Icon type="home" />
                    {tr('主页面')}
                  </span>}
                key="2"
              >
                <div style={{ height }} className={styles.fixheight}>

                  <Header title={
                    < span className="primary-color">
                      <Icon type="desktop" className="marginhr5" />
                      {tr('基础')}
                    </span>
                  } bottomLine={false}
                    type='none'
                  />
                  <Form.Item label={tr('主题色')} {...formItemLayout}>
                    {getFieldDecorator('MAIN_CONFIG.primaryColor', {
                      initialValue: MAIN_CONFIG.primaryColor,
                    })(
                      <ColorPicker disabled={shouldThemeDisabled} edit={EditStatus.EDIT} />
                    )}
                  </Form.Item>
                  <Header title={
                    < span className="primary-color">
                      <Icon type="layout" className="marginhr5" />
                      {tr('主菜单')}
                    </span>
                  } bottomLine={false}
                    type='none'
                  />
                  <Form.Item label={tr('风格')} {...formItemLayout}>
                    {getFieldDecorator('MAIN_CONFIG.navTheme', {
                      initialValue: MAIN_CONFIG.navTheme
                    })(
                      <Radio.Group buttonStyle="solid" disabled={shouldThemeDisabled}>
                        <Radio.Button value="dark">{tr('暗色')}</Radio.Button>
                        <Radio.Button value="light">{tr('亮色')}</Radio.Button>
                      </Radio.Group>
                    )}
                  </Form.Item>

                  <Form.Item label={tr('固定')} {...formItemLayout}>
                    {getFieldDecorator('MAIN_CONFIG.fixSiderbar', {
                      initialValue: MAIN_CONFIG.fixSiderbar,
                      valuePropName: 'checked'
                    })(
                      <Switch />
                    )}
                  </Form.Item>
                  {/* <Form.Item label={tr('背景图')} {...formItemLayout}>
                    {getFieldDecorator('MAIN_CONFIG.showNavBackgroundImage', {
                      initialValue: MAIN_CONFIG.showNavBackgroundImage,
                      valuePropName: 'checked'
                    })(
                      <Switch />
                    )}
                  </Form.Item> */}
                  {/* <Form.Item style={{ display: MAIN_CONFIG.showNavBackgroundImage ? "block" : "none" }} label={tr('背景图选择')} {...formItemLayout}>
                    {getFieldDecorator('MAIN_CONFIG.navBackgroundImages', {
                      initialValue: MAIN_CONFIG.navBackgroundImages
                    })(
                      <PictureWall edit={EditStatus.EDIT} maxLength={5} />
                    )}
                  </Form.Item> */}
                  <Form.Item label={tr('侧边栏文字色')} {...formItemLayout}>
                    {getFieldDecorator('MAIN_CONFIG.siderMenuTextColor', {
                      initialValue: MAIN_CONFIG.siderMenuTextColor
                    })(
                      <ColorPicker disabled={shouldThemeDisabled} edit={EditStatus.EDIT}/>
                    )}
                  </Form.Item>
                  <Form.Item label={tr('侧边栏背景色')} {...formItemLayout}>
                    {getFieldDecorator('MAIN_CONFIG.siderMenuBackground', {
                      initialValue: MAIN_CONFIG.siderMenuBackground
                    })(
                      <ColorPicker disabled={shouldThemeDisabled} edit={EditStatus.EDIT}/>
                    )}
                  </Form.Item>
                  <Form.Item label={tr('logo栏文字色')} {...formItemLayout}>
                    {getFieldDecorator('MAIN_CONFIG.siderMenuLogoColor', {
                      initialValue: MAIN_CONFIG.siderMenuLogoColor
                    })(
                      <ColorPicker disabled={shouldThemeDisabled} edit={EditStatus.EDIT}/>
                    )}
                  </Form.Item>
                  <Form.Item label={tr('logo栏背景色')} {...formItemLayout}>
                    {getFieldDecorator('MAIN_CONFIG.siderMenuLogoBackground', {
                      initialValue: MAIN_CONFIG.siderMenuLogoBackground
                    })(
                      <ColorPicker disabled={shouldThemeDisabled} edit={EditStatus.EDIT}/>
                    )}
                  </Form.Item>
                  {/* <Form.Item label={tr('背景色透明度')} {...formItemLayout}>
                    {getFieldDecorator('MAIN_CONFIG.navBackgroundOpacity', {
                      initialValue: MAIN_CONFIG.navBackgroundOpacity
                    })(
                      <Slider
                        min={0.5}
                        max={1}
                        step={0.05}
                      />
                    )}
                  </Form.Item> */}
                  {/* <Form.Item label={tr('收起时宽度')} {...formItemLayout}>
                    {getFieldDecorator('MAIN_CONFIG.slideCollapsedWidth', {
                      initialValue: MAIN_CONFIG.slideCollapsedWidth
                    })(
                      <Slider
                        min={40}
                        max={80}
                        step={5}
                      />
                    )}
                  </Form.Item> */}
                  {/* <Form.Item label={tr('导航模式')} {...formItemLayout}>
                    {getFieldDecorator('MAIN_CONFIG.layout', {
                      initialValue: MAIN_CONFIG.layout
                    })(
                      <Radio.Group buttonStyle="solid" >
                        <Radio.Button value="sidemenu">侧边菜单布局</Radio.Button>
                        <Radio.Button value="topmenu">顶部菜单布局</Radio.Button>
                      </Radio.Group>
                    )}
                  </Form.Item> */}
                  <Form.Item style={{ display: MAIN_CONFIG.layout === 'topmenu' ? "block" : "none" }} label={tr('内容区域宽度')} {...formItemLayout}>
                    {getFieldDecorator('MAIN_CONFIG.contentWidth', {
                      initialValue: MAIN_CONFIG.contentWidth
                    })(
                      <Radio.Group buttonStyle="solid" >
                        <Radio.Button value="Fixed">{tr('定宽')}</Radio.Button>
                        <Radio.Button value="Fluid">{tr('流式')}</Radio.Button>
                      </Radio.Group>
                    )}
                  </Form.Item>

                  <Header title={
                    < span className="primary-color">
                      <Icon type="layout" className="marginhr5" />
                      {tr('头部设置')}
                    </span>

                  }
                    type='none'
                    bottomLine={false}
                  />
                  <Form.Item label={tr('header文字色')} {...formItemLayout}>
                    {getFieldDecorator('MAIN_CONFIG.globalHeaderTextColor', {
                      initialValue: MAIN_CONFIG.globalHeaderTextColor
                    })(
                      <ColorPicker disabled={shouldThemeDisabled} edit={EditStatus.EDIT}/>
                    )}
                  </Form.Item>
                  <Form.Item label={tr('header背景色')} {...formItemLayout}>
                    {getFieldDecorator('MAIN_CONFIG.globalHeaderBackground', {
                      initialValue: MAIN_CONFIG.globalHeaderBackground
                    })(
                      <ColorPicker disabled={shouldThemeDisabled} edit={EditStatus.EDIT}/>
                    )}
                  </Form.Item>

                  <Form.Item label={tr('固定')} {...formItemLayout}>
                    {getFieldDecorator('MAIN_CONFIG.fixedHeader', {
                      initialValue: MAIN_CONFIG.fixedHeader,
                      valuePropName: 'checked'
                    })(
                      <Switch />
                    )}
                  </Form.Item>
                  <Form.Item label={tr('下滑时隐藏')} {...formItemLayout}>
                    {getFieldDecorator('MAIN_CONFIG.autoHideHeader', {
                      initialValue: MAIN_CONFIG.autoHideHeader,
                      valuePropName: 'checked'
                    })(
                      <Switch />
                    )}
                  </Form.Item>

                  <Form.Item label={tr('任务栏')} {...formItemLayout}>
                    {getFieldDecorator('MAIN_CONFIG.showTaskBar', {
                      initialValue: MAIN_CONFIG.showTaskBar,
                      valuePropName: 'checked'
                    })(
                      <Switch />
                    )}
                  </Form.Item>
                  <Form.Item label={tr('面包屑')} {...formItemLayout}>
                    {getFieldDecorator('MAIN_CONFIG.showBreadcrumb', {
                      initialValue: MAIN_CONFIG.showBreadcrumb,
                      valuePropName: 'checked'
                    })(
                      <Switch />
                    )}
                  </Form.Item>
                  <Form.Item label={tr('导航按钮')} {...formItemLayout}>
                    {getFieldDecorator('MAIN_CONFIG.showNavigationButton', {
                      initialValue: MAIN_CONFIG.showNavigationButton,
                      valuePropName: 'checked'
                    })(
                      <Switch />
                    )}
                  </Form.Item>
                  {/* <Form.Item label={tr('高度')} {...formItemLayout}>
                    {getFieldDecorator('MAIN_CONFIG.headerHeight', {
                      initialValue: MAIN_CONFIG.headerHeight
                    })(
                      <Slider
                        min={40}
                        max={60}
                        step={5}
                      />
                    )}
                  </Form.Item> */}
                </div>
              </TabPane>





              <TabPane
                tab={
                  <span>
                    <Icon type="login" />
                    {tr('登陆界面')}
                  </span>
                }
                key="3"
              >
                <div style={{ height }} className={styles.fixheight}>
                  <Header
                    title={
                      < span className="primary-color">
                        <Icon type="table" className="marginhr5" />
                        {tr('登陆表单')}
                      </span>
                    }
                    bottomLine={false}
                    type="none"
                  />
                  <Form.Item label={tr('布局')} {...formItemLayout}>
                    {getFieldDecorator('LOGIN_CONFIG.loginAlign', {
                      initialValue: LOGIN_CONFIG.loginAlign
                    })(
                      <Radio.Group buttonStyle="solid" >
                        <Radio.Button value="left">{tr('居左')}</Radio.Button>
                        <Radio.Button value="center">{tr('居中')}</Radio.Button>
                        <Radio.Button value="right">{tr('居右')}</Radio.Button>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </div>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Icon type="appstore" />
                    {tr('其他')}
                  </span>
                }
                key="4"
              >
                <div style={{ height }} className={styles.fixheight}>
                  <Header title={
                    < span className="primary-color">
                      <Icon type="highlight" className="marginhr5" />
                      {tr('水印')}
                    </span>
                  } bottomLine={false}
                    type='none'
                  />
                  <Form.Item label={tr('类型')} {...formItemLayout}>
                    {getFieldDecorator('MAIN_CONFIG.waterStatus', {
                      initialValue: MAIN_CONFIG.waterStatus,
                    })(
                      <Radio.Group buttonStyle="solid" >
                        <Radio.Button value="none">{tr('无水印')}</Radio.Button>
                        <Radio.Button value="guest">{tr('用户信息')}</Radio.Button>
                        <Radio.Button value="company">{tr('公司信息')}</Radio.Button>
                        <Radio.Button value="custom">{tr('自定义文字')}</Radio.Button>
                      </Radio.Group>
                    )}
                  </Form.Item>
                  {MAIN_CONFIG.waterStatus !== "none" && <>
                    {MAIN_CONFIG.waterStatus === "custom" && <Form.Item label={tr('自定义文字')} {...formItemLayout}>
                      {getFieldDecorator('MAIN_CONFIG.waterText', {
                        initialValue: MAIN_CONFIG.waterText,
                      })(
                        <Input
                          disabled={MAIN_CONFIG.waterStatus !== "custom"}
                          placeholder={tr("输入水印文字")} />
                      )}
                    </Form.Item>}
                    <Form.Item label={tr('显示日期')} {...formItemLayout}>
                      {getFieldDecorator('MAIN_CONFIG.waterShowTime', {
                        initialValue: MAIN_CONFIG.waterShowTime,
                        valuePropName: 'checked'
                      })(
                        <Switch />
                      )}
                    </Form.Item>
                    <Form.Item label={tr('文字间距')} {...formItemLayout}>
                      {getFieldDecorator('MAIN_CONFIG.waterPadding', {
                        initialValue: MAIN_CONFIG.waterPadding,
                      })(
                        <InputNumber
                          disabled={MAIN_CONFIG.waterStatus === "none"}
                          step={5}
                          min={0}
                          precision={0}
                          placeholder={tr("输入水印间距")} />
                      )}
                    </Form.Item>
                    <Form.Item label={tr('文字大小')} {...formItemLayout}>
                      {getFieldDecorator('MAIN_CONFIG.waterFontSize', {
                        initialValue: MAIN_CONFIG.waterFontSize,
                      })(
                        <InputNumber
                          disabled={MAIN_CONFIG.waterStatus === "none"}
                          min={14}
                          precision={0} placeholder={tr("输入文字大小")} />
                      )}
                    </Form.Item>
                    <Form.Item label={tr('不透明度')} {...formItemLayout}>
                      {getFieldDecorator('MAIN_CONFIG.waterFontAlpha', {
                        initialValue: MAIN_CONFIG.waterFontAlpha,
                      })(
                        <InputNumber
                          disabled={MAIN_CONFIG.waterStatus === "none"}
                          min={0.1}
                          max={1}
                          step={0.1}
                          precision={1} placeholder={tr("输入文字透明度")} />
                      )}
                    </Form.Item>
                    <Form.Item label={tr('旋转角度')} {...formItemLayout}>
                      {getFieldDecorator('MAIN_CONFIG.waterFontRotate', {
                        initialValue: MAIN_CONFIG.waterFontRotate,
                      })(
                        <InputNumber
                          disabled={MAIN_CONFIG.waterStatus === "none"}
                          min={-360}
                          max={360}
                          step={10}
                          precision={0}
                          placeholder={tr("输入文字旋转角度")} />
                      )}
                    </Form.Item>
                    <Form.Item label={tr('颜色')} {...formItemLayout}>
                      {getFieldDecorator(`MAIN_CONFIG.${themeType}WaterFontColor`, {
                        initialValue: MAIN_CONFIG[`${themeType}WaterFontColor`],
                      })(
                        <ColorPicker edit={EditStatus.EDIT} />
                      )}
                    </Form.Item>
                  </>}
                </div>
              </TabPane>
            </Tabs>
          </Form>
        </TabPane>
      </Tabs>
      <div style={{ width: '100%', height: '40px' }}></div>
      <div className={styles.footer}>
        <Button size="small" onClick={() => reset()}>{tr('重置为默认')}</Button>
      </div>
    </div>
  )
}

const FormCP = Form.create({
  onValuesChange(props: any, changedValues, allValues) {
    // console.log('changedValues', changedValues)
    // 如果是侧边栏则不能用定宽
    if (changedValues.MAIN_CONFIG) {
      if (changedValues.MAIN_CONFIG.layout) {
        allValues.MAIN_CONFIG.contentWidth = 'Fluid';
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 300)
      }
      allValues.MAIN_CONFIG.theme = props.settings.MAIN_CONFIG.theme;
    }
    dispatch({
      type: 'settings/changeSetting',
      payload: merge({}, allValues)
    })
  }
})(Page);

export default FormCP