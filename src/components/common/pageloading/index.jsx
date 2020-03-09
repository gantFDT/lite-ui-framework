// https://umijs.org/plugin/umi-plugin-react.html#dynamicimport
import React from 'react';
import { Spin,Icon } from 'antd';
import { Loading } from 'gantd'


//设置全局loading样式
Spin.setDefaultIndicator(<Icon type="loading-3-quarters" style={{ fontSize: 24 }} spin />)
const PageLoading = () => (
  // <div
  //   style={{
  //     paddingTop: 100,
  //     textAlign: 'center',
  //   }}
  // >
  //   <Spin size="large" />
  //   <Loading index={2} height={150}/>
  // </div>
  <Loading index={2} height='calc(100vh - 40px)'/>
);

export default PageLoading;
