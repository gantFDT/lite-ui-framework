// https://umijs.org/plugin/umi-plugin-react.html#dynamicimport
import React from 'react';
import { Spin,Icon } from 'antd';
import {PageLoading} from 'gantd'


//设置全局loading样式
Spin.setDefaultIndicator(<Icon type="loading-3-quarters" style={{ fontSize: 24 }} spin />)
const Loading = () => (
  // <div
  //   style={{
  //     paddingTop: 100,
  //     textAlign: 'center',
  //   }}
  // >
  //   <Spin size="large" />
  //   <PageLoading index={2} height={150}/>
  // </div>
  <PageLoading index={2} height='calc(100vh - 40px)'/>
);

export default Loading;
