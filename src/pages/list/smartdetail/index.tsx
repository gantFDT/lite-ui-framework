import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { Anchor } from '@/components/common'
import { SubMenu, Card } from 'gantd'
import { Avatar, Button, Tooltip } from 'antd'
import { connect } from 'dva';
import { Title } from '@/components/common';
import FormSchema from '@/components/form/schema'
import { LoadingIF } from '@/models/connect';
import { SettingsState } from '@/models/setting';
import { UserState } from '@/models/user';
import { ModelProps } from './model';
import { getContentHeight } from '@/utils/utils'
import { formSchema, formUISchema } from './schema'
const ids = Object.keys(formSchema.propertyType);

const menuData = [
  {
    name: '个人设置',
    icon: 'user',
    path: 'personal',
  },
  {
    name: '语言偏好',
    icon: 'global',
    path: 'preferences',
  }
].map(item => ({ ...item, key: item.path }));

const anchorList = [
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
    fetch
  } = props;

  const { fixedHeader } = MAIN_CONFIG
  const minHei = getContentHeight(MAIN_CONFIG, 40);

  useEffect(() => {
    fetch({ id })
  }, [])

  useEffect(() => {
    detailRef.current = detail
  }, [detail]);

  const [selectedKey, setSelectedKey] = useState(menuData[0].name)

  const formRef = useRef(null)
  const detailRef = useRef(null)

  const onSelectedChange = (path, eventKey) => {
    setSelectedKey(eventKey);
  }

  const titleConfig = useMemo(() => {
    let titleConfig = {
      "title:type": "num",
    }
    ids.map((itemId, itemIndex) => {
      // const itemEdit = edit[itemId]
      titleConfig[itemId] = {
        "title:id": itemId,
        "title:num": itemIndex + 1,
        "title:extra": <div>
          {/* <Tooltip title={itemEdit == EditStatus.EDIT ? tr("取消编辑") : tr("编辑")}>
            <Button size="small" className="marginh5" style={{ padding: '0 8px' }} onClick={() => setItemEdit(itemId, itemEdit == EditStatus.EDIT ? EditStatus.CANCEL : EditStatus.EDIT)}>
              <Icon type={itemEdit != EditStatus.EDIT ? "edit" : "minus-circle"} />
            </Button>
          </Tooltip> */}
          <Tooltip title={tr("保存")}>
            <Button size="small" icon="save"
              // disabled={itemEdit != EditStatus.EDIT}
              className="marginh5"
              onClick={() => onSaveForm(itemId)}
            />
          </Tooltip>
        </div>
      }
    })
    return titleConfig
    // }, [edit])
  }, [])

  const data = useMemo(() => {
    if (_.isEmpty(detail)) return;
    let valueData = {};
    ids.map((itemId) => {
      valueData[itemId] = {};
      Object.keys(formSchema.propertyType[itemId].propertyType).map(itemName => {
        valueData[itemId][itemName] = detail[itemName]
      })
    })
    return valueData;
  }, [detail])

  return <Card title={<Title route={route} />} bodyStyle={{ padding: 0 }}>
    <SubMenu
      menuData={menuData}
      selectedKey={selectedKey}
      width={180}
      onSelectedChange={onSelectedChange}
      extra={
        <div id='menuExtra' style={{ padding: '10px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto', width: 'auto' }}>
          <div>
            <Avatar size={64} src={'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1560143638308&di=bd43a25e740c8010cd803bffb6191a74&imgtype=0&src=http%3A%2F%2Fimg3.duitang.com%2Fuploads%2Fitem%2F201605%2F07%2F20160507191419_J2m8R.thumb.700_0.jpeg'} />
            <div>name</div>
          </div>
        </div>
      }
    >
      <div style={{ minHeight: minHei }}>
        <Anchor
          anchorKey='demoUserManageDetailBase'
          userId={userId}
          fixedTop={fixedHeader ? 40 : 0}
          anchorList={anchorList}
          onClick={(e) => { e.preventDefault() }}
          cardContent={
            <>

              <FormSchema
                wrappedComponentRef={formRef}
                // edit={'CANCEL'}
                data={data}
                schema={formSchema}
                uiSchema={formUISchema}
                titleConfig={titleConfig}
              // onSave={onItemSave}
              />

            </>
          }
        />
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