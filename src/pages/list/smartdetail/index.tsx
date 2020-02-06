import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { Anchor } from '@/components/common'
import { SubMenu, Card, EditStatus, SwitchStatus, BlockHeader, Icon } from 'gantd'
import { Avatar, Button, Tooltip, Radio,Modal } from 'antd'
import { connect } from 'dva';
import { Title } from '@/components/common';
import FormSchema from '@/components/form/schema'
import { LoadingIF } from '@/models/connect';
import { SettingsState } from '@/models/setting';
import { UserState } from '@/models/user';
import { ModelProps } from './model';
import { getContentHeight } from '@/utils/utils'
import { formSchema, formUISchema, getVisitData } from './schema'
import { MiniArea, Pie } from '@/components/chart'
import router from 'umi/router'

const confirm=Modal.confirm
const ids = Object.keys(formSchema.propertyType);
const avatars = [
  'http://www.duoziwang.com/uploads/1512/1-1512291K2430-L.jpg',
  'http://www.duoziwang.com/uploads/1512/1-1512291K3400-L.jpg',
  'http://www.duoziwang.com/uploads/1512/1-1512292055010-L.jpg',
  'http://www.duoziwang.com/uploads/1512/1-1512291K6240-L.jpg',
  'http://www.duoziwang.com/2016/10/05/2032097569.jpg',
  'http://www.duoziwang.com/2016/10/05/21143213927.jpg',
  'http://www.duoziwang.com/2016/10/05/21135613834.png',
  'http://www.duoziwang.com/2016/10/05/2025046706.jpg',
  'http://www.duoziwang.com/2016/10/05/21102913178.png',
  'http://www.duoziwang.com/uploads/1512/1-1512292051490-L.jpg',
]
const menuData = [
  {
    name: '基本信息',
    icon: 'user',
    path: 'baseInfo',
  },
  {
    name: '社区',
    icon: 'global',
    path: 'community',
  }
].map(item => ({ ...item, key: item.path }));

interface AnchorListIF {
  id: string,
  title: string,
  type: string,
  required: string[],
  complete?: boolean
}

const anchorList: AnchorListIF[] = [
  {
    id: 'base',
    title: tr('基本信息'),
    type: 'form',
    required: ['name', 'age', 'gender'],
  },
  {
    id: 'code',
    title: tr('代码'),
    type: 'form',
    required: ['domain'],
  },
  {
    id: 'more',
    title: tr('其他'),
    type: 'form',
    required: [],
  }
]

const Page = (props: any) => {
  const {
    match: { params: { id } },
    MAIN_CONFIG, route, userId,
    dispatch,
    detail,
    fetch, update,remove,
    removeLoading
  } = props;

  const { fixedHeader } = MAIN_CONFIG
  const minHei = getContentHeight(MAIN_CONFIG, 42);
  const [edit, setEdit] = useState(EditStatus.CANCEL)

  useEffect(() => {
    fetch({ id })
  }, [])

  useEffect(() => {
    detailRef.current = detail
  }, [detail]);

  const [selectedKey, setSelectedKey] = useState(menuData[0].path)

  const formRef = useRef(null)
  const detailRef = useRef(null)

  const onSelectedChange = (path: string, eventKey: string) => {
    setSelectedKey(eventKey);
  }
  async function onSaveForm(id: string) {
    const { errors, values } = await formRef['current'].validateForm([id])
    console.log('values', values)
    if (errors) return
    // onSave(values, setItemEdit(id, EditStatus.SAVE))
    update(values[id])
  }
  async function onSaveAll() {
    const { errors, values } = await formRef['current'].validateForm()
    console.log('values', values)
    if (errors) return
    // onSave(values, setItemEdit(id, EditStatus.SAVE))
    update({ id: parseInt(id), ...values['base'], ...values['code'], ...values['more'] }, () => {
      setEdit(EditStatus.CANCEL)
    })
  }
  //整理schemaform的title
  const titleConfig = useMemo(() => {
    let titleConfig = {
      "title:type": "num",
    }
    ids.map((itemId, itemIndex) => {
      titleConfig[itemId] = {
        "title:id": itemId,
        "title:num": itemIndex + 1,
        "title:bottomLine": false,
      }
    })
    return titleConfig
    // }, [edit])
  }, [edit])

  //整理schemaform的data
  const data = useMemo(() => {
    if (_.isEmpty(detail)) return;
    let valueData = {};
    detail['view'] = Math.ceil(Math.random() * 10000)
    detail['popularIndex'] = (Math.random() * 100).toFixed(2)
    ids.map((itemId) => {
      valueData[itemId] = {};
      Object.keys(formSchema.propertyType[itemId].propertyType).map(itemName => {
        valueData[itemId][itemName] = detail[itemName]
      })
    })
    return valueData;
  }, [detail])

  //计算锚点显示的complete
  const currentAnchorList = useMemo(() => {
    if (!data || !anchorList.length) return;
    let anchorIds: any = []; //值为空和不需判断的id
    let anchorNeedIds = [];
    anchorList.map((item) => {
      if (item.type == 'form') {
        Object.keys(data[item.id]).map(itemName => {
          if (item.required && item.required.length) {
            const commonId = item.required.find((val) => val == itemName)
            if (commonId && !data[item.id][itemName]) { anchorIds.push(item.id); }
          } else {
            anchorIds.push(item['id']);
          }
        })
        let newAnchorIds = _.uniq(anchorIds) //值为空和不需判断的id去重后数组
        anchorNeedIds = _.difference(ids, newAnchorIds) //筛选出已完成的模块id
        item['complete'] = anchorNeedIds.find((val) => val == item.id) ? true : false
      } else if (item.type == 'table') {
        item.complete = item.required && eval(item['dataSourceName']).length ? true : false
      }
    })
    console.log('anchorList', anchorList)
    return anchorList;
  }, [data, anchorList])

  const handleremove = useCallback(() => {
    confirm({
      title: `${tr('提示')}?`,
      content: `${tr('确定删除吗')}?`,
      cancelText: tr('取消'),
      okText: tr('确定'),
      okType: 'danger',
      okButtonProps: {
        size: 'small',
        loading: removeLoading
      },
      cancelButtonProps: { size: 'small' },
      onOk() {
        return new Promise((resolve, reject) => {
          remove({
            id
          }, () => {
            router.push('/list/smarttable')
            resolve()
          })
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() { },
    });
  }, [id,removeLoading])

  return <Card title={<>
    <span className="marginh5"><Icon type="form" /></span>
    {tr('智能详情')}
  </>} bodyStyle={{ padding: 0 }}>
    <SubMenu
      menuData={menuData}
      selectedKey={selectedKey}
      width={180}
      onSelectedChange={onSelectedChange}
      extra={
        <div id='menuExtra' style={{ padding: '10px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto', width: 'auto' }}>
          <div>
            <Avatar size={64} src={avatars[detail.id]} />
            <div>{detail.name}</div>
          </div>
        </div>
      }
    >

      <div style={{ minHeight: minHei }}>
        {selectedKey == 'baseInfo' && <Anchor
          anchorKey='demoUserManageDetailBase'
          userId={userId}
          fixedTop={fixedHeader ? 40 : 0}
          anchorList={currentAnchorList}
          onClick={(e) => { e.preventDefault() }}
          cardContent={
            <>
              <BlockHeader title={
                <>
                  <span className="marginh5"><Icon type="user" /></span>
                  {tr('基本信息')}
                </>
              }
                bottomLine
                extra={<>
                {edit === EditStatus.EDIT && <Tooltip title={tr("保存")}>
                    <Button size="small" icon="save"
                      // disabled={itemEdit != EditStatus.EDIT}
                      className="marginh5"
                      onClick={() => onSaveAll()}
                    />
                  </Tooltip>}
                  {edit !== EditStatus.EDIT && <Tooltip title={tr("进入编辑")}>
                    <Button size="small" icon="edit"
                      // disabled={itemEdit != EditStatus.EDIT}
                      className="marginh5"
                      onClick={() => setEdit(EditStatus.EDIT)}
                    />
                  </Tooltip>}
                  {edit !== EditStatus.CANCEL && <Tooltip title={tr("结束编辑")}>
                    <Button size="small" icon="minus-circle"
                      // disabled={itemEdit != EditStatus.EDIT}
                      className="marginh5"
                      onClick={() => setEdit(EditStatus.CANCEL)}
                    />
                  </Tooltip>}
                  
                </>}
              />
              <FormSchema
                edit={edit}
                wrappedComponentRef={formRef}
                // edit={'CANCEL'}
                data={data}
                schema={formSchema}
                uiSchema={formUISchema}
                titleConfig={titleConfig}
              // onSave={onItemSave}
              />
              <div style={{ padding: 10 }}><Button type='danger' style={{ width: '100%' }} onClick={handleremove}>{tr('删除')}</Button></div>
            </>
          }
        />
        }
        {selectedKey == 'community' && <>
          <BlockHeader title={
            <>
              <span className="marginh5"><Icon type="global" /></span>
              {tr('社区')}
            </>
          }
            bottomLine
          />
          <div style={{ padding: 10 }}>
            <BlockHeader title={
              <>
                {tr('受欢迎指数')}
              </>
            }
              type='num'
              num={1}
            />
            <Pie
              animate={false}
              inner={0.55}
              tooltip={false}
              margin={[0, 0, 0, 0]}
              percent={Math.random() * 100}
              height={100}
            />
          </div>
          <div style={{ padding: 10 }}>

            <BlockHeader title={
              <>
                {tr('代码提交频度')}
              </>
            }
              type='num'
              num={2}
            />
            <MiniArea color="#36C66E" data={getVisitData()} height={300} />
          </div>

        </>}
      </div>

    </SubMenu>
  </Card>




}
export default connect(
  ({ exampleSmartDetail, settings, loading, user }: { exampleSmartDetail: ModelProps, settings: SettingsState, loading: LoadingIF, user: UserState }) => ({
    MAIN_CONFIG: settings.MAIN_CONFIG,
    userId: user.currentUser.id,
    ...exampleSmartDetail,
    removeLoading: loading.effects['exampleSmartDetail/remove'],
  }),
  (dispatch: any) => {
    const mapProps = {};
    ['fetch', 'reload', 'create', 'remove', 'update', 'save'].forEach(method => {
      mapProps[method] = (payload: object, callback: Function, final: Function) => {
        dispatch({
          type: `exampleSmartDetail/${method}`,
          payload,
          callback,
          final
        })
      }
    })
    return mapProps
  }
)(Page)