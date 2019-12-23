# G甘棠前端开发框架


开发最小核心脚手架


## 基础功能
0、请求类封装
1、动态菜单，菜单权限拦截
2、权限
3、国际化
4、面包屑，历史
5、回到顶部
6、消息通知
……


## 快速开始

```bash
npm i
npm run start
```

## 添加区块

因为umi-block限制区块源必须以github或者gitlab开头，我们需要在自己的机器上host配置映射到gitlab服务器，

>192.168.1.21  gitlab.gantcloud.com

#### 1、单个添加区块
umi block add 区块地址 --path=你想安装的路由参数
如
```bash
umi block add https://gitlab.gantcloud.com/ui-team/gant-blocks/tree/master/table --path=/Test_Hello/hello-Block
```
为什么要添加参数以及如何开发umi标准block请参阅 [gant-blocks](https://git.gantcloud.com/ui-team/gant-blocks)

#### 2、批量添加区块

```bash
npm run fetch:blocks
```

## 打包

```bash
npm run build
```

## 注意

子模块的config必须在重新run后才会生效
