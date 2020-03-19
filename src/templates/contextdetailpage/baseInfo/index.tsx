import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Steps, Tooltip, Button } from 'antd';
import { Anchor } from '@/components/common';
import { SchemaForm } from 'gantd';
import { formSchema, anchorList } from './schema';
import { SettingsProps } from '@/models/settings';
import { UserProps } from '@/models/user';
import { getContentHeight } from '@/utils/utils'
const { Step } = Steps;

const ids = Object.keys(formSchema.propertyType || {});
const uiSchema = {
  "ui:col": {
    span: 24,
    sm: 12,
    xl: 8,
    xxl: 6,
  },
  "ui:labelCol": {},
  "ui:wrapperCol": {}
};

function Page(props: any) {
  const {
    MAIN_CONFIG,
    detailContent,
    userId,
    update,
  } = props;

  const { fixedHeader } = MAIN_CONFIG;

  const formRef = useRef<any>({} as any);

  const onSave = useCallback((values, cb) => {
    update({ ...values, id: detailContent.id }, cb)
  }, [detailContent])

  const onSaveForm = useCallback(async (id: string) => {
    const { errors, values } = await formRef.current.validateForm([id])
    if (errors) return
    onSave(values[id], null)
  }, [onSave])

  //标题配置
  const titleConfig = useMemo(() => {
    let titleConfig = { "title:type": "num" };
    ids.map((itemId, itemIndex) => {
      titleConfig[itemId] = {
        "title:id": itemId,
        "title:num": itemIndex + 1,
        "title:extra": <div>
          <Tooltip title={tr("保存")}>
            <Button size="small" icon="save"
              className="gant-margin-h-5"
              onClick={() => onSaveForm(itemId)}
            />
          </Tooltip>
        </div>
      }
    })
    return titleConfig
  }, [])

  //将详情数据转化为schemaForm接受的数据格式
  const data = useMemo(() => {
    if (_.isEmpty(detailContent)) return;
    let valueData = {};
    ids.map((itemId) => {
      valueData[itemId] = {};
      let propertyType = formSchema.propertyType && formSchema.propertyType[itemId].propertyType || {};
      Object.keys(propertyType).map((itemName: string) => {
        valueData[itemId][itemName] = detailContent[itemName]
      })
    })
    return valueData;
  }, [detailContent])

  //当前锚点渲染列表
  const currentAnchorList = useMemo(() => {
    if (!data) return anchorList;
    let anchorIds: Array<string> = []; //值为空和不需判断的id
    let anchorNeedIds = [];
    anchorList.map((item) => {
      if (item.type == 'form') {
        Object.keys(data[item.id]).map(itemName => {
          if (item.required && _.isArray(item.required) && item.required.length) {
            let commonId = item.required.find(val => val == itemName)
            if (commonId && !data[item.id][itemName]) { anchorIds.push(item.id) }
          } else {
            anchorIds.push(item.id);
          }
        })
        let newAnchorIds = _.uniq(anchorIds) //值为空和不需判断的id去重后数组
        anchorNeedIds = _.difference(ids, newAnchorIds) //筛选出已完成的模块id
        item.complete = anchorNeedIds.find(val => val == item.id) ? true : false;
      } else if (item.type == 'table') {
        //...
      }
    })
    return anchorList;
  }, [data, anchorList])

  const minHeight = getContentHeight(MAIN_CONFIG, 40 + 60 + 2);
  return <>
    <Anchor
      anchorKey='demoUserManageDetailBase'
      userId={userId}
      headerHeight={40}
      fixedHeader={fixedHeader}
      anchorList={currentAnchorList}
      minHeight={minHeight}
      content={
        <>
          <div style={{ padding: '10px 0 0', marginTop: 10 }}>
            <Steps style={{ flexWrap: 'wrap' }} current={2} size='small' labelPlacement='vertical'>
              <Step title={tr('注册')} />
              <Step title={tr('收到账号密码邮件')} description={`(${tr('可登录')})`} />
              <Step title={tr('完善资料')} />
              <Step title={tr('审核')} />
              <Step title={tr('潜在供应商')} />
              <Step title={tr('注册成功')} description={`(${tr('可报价')})`} />
              <Step title={tr('中标')} />
              <Step title={tr('完善资料')} />
              <Step title={tr('审核')} />
              <Step title={tr('正式供应商')} description={`(${tr('可签订合同')})`} />
              <Step title={tr('完成')} />
            </Steps>
          </div>
          <SchemaForm
            wrappedComponentRef={formRef}
            data={data}
            schema={formSchema}
            uiSchema={uiSchema}
            titleConfig={titleConfig}
          />
        </>
      }
    />
  </>
}
export default connect(
  ({ pageName, settings, user }: { pageName: any, settings: SettingsProps, user: UserProps }) => ({
    MAIN_CONFIG: settings.MAIN_CONFIG,
    userId: user.currentUser.id,
    ...pageName,
  }),
  (dispatch: any) => {
    const mapProps = {};
    ['update'].forEach(method => {
      mapProps[method] = (payload: object, callback: Function, final: Function) => {
        dispatch({
          type: `pageName/${method}`,
          payload,
          callback,
          final,
        })
      }
    })
    return mapProps
  }
)(Page)
