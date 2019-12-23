# G甘棠前端开发框架


开发最小核心脚手架
详细文档请查阅https://gant.yuque.com/kvwuhw/ilkg7q

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
  
  
### 一、如果做产品  

1、新建一个产品业务项目前端仓库

2、执行git submodule add git@git.gantcloud.com:ui-team/ui-framework.git 配置前端框架为git 子模块

3、新建产品业务代码文件夹（ui-prd）

4、建立软连接  mklink /j "ui-framework/src/pages/ui-prd" "ui-prd"

5、进入框架中执行命令  cd ui-framework && npm i && npm start



  
  
### 二、如果做项目
1、新建一个项目业务项目前端仓库ui-cust-prj

2、在ui-cust-prj仓库中执行git clone git@git.gantcloud.com:procurement/IPP/ui-procurement.git  —recurse （以依赖采购产品做示例）

3、新建项目业务代码文件夹（ui-prj）

4、建立软连接  mklink /j "ui-procurement/ui-framework/src/pages/ui-prd" "ui-prj"

5、进入框架中执行命令  cd ui-procurement/ui-framework && npm i && npm start





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


## 国际化
直接使用tr('中文')

## 打包

```bash
npm run build
```

## 注意

子模块的config不会热更新，如有更改，在重新run后才会生效

## 详细文档请查阅 https://gant.yuque.com/kvwuhw/ilkg7q
