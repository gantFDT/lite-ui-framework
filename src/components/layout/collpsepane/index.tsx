import React, { ReactNode } from 'react'
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

interface collposePaneProps {
  height?: number | string;//高度
  leftWidthPercent: number;//左侧面板宽度百分比，必传，受控，
  rightWidthPercent: number;//右侧面板宽度百分比，必传，受控，
  leftExpandWidthPercent?: number;//左侧面板展开时宽度百分比，默认值 0.3，非必传，不受控，
  rightExpandWidthPercent?: number;//右侧面板展开时宽度百分比，默认值 0.3，非必传，不受控
  onSizeChange?: Function;//size改变的回调
  leftPane: ReactNode;//左侧面板，必传
  centerPane: ReactNode;//中间面板，必传
  rightPane?: ReactNode;//右侧面板，非必传
  leftMinWidth: number;
  rightMinWidth: number;
}


const Comp = (props: collposePaneProps) => {
  const {
    height = 500,
    leftWidthPercent = 0.3,
    rightWidthPercent = 0,
    leftExpandWidthPercent = 0.3,
    rightExpandWidthPercent = 0.3,
    leftMinWidth = 150,
    rightMinWidth = 150,
    onSizeChange = () => { },
    leftPane,
    centerPane,
    rightPane,
  } = props;
  return (
    <div>
      <Layout>
        <Sider>{leftPane}</Sider>
        <Layout>
          {centerPane}
          <Header>Header</Header>
          <Content>Content</Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default Comp