import React, { useCallback, useState, useEffect } from 'react'
import { Table, EditStatus, Generator, SwitchStatus, Card, Input as GantInput } from 'gantd'
import { Button, Icon, Input, Tabs } from 'antd'
import { Title } from '@/components/common';
import { SettingsProps } from '@/models/settings'
import { UserProps } from '@/models/user'
import { ModelProps } from '@/models/locale'
import { connect } from 'dva';
import { getTableHeight } from '@/utils/utils'

const Search = Input.Search;
const TabPane = Tabs.TabPane;

const Page = (props: any) => {
  const { MAIN_CONFIG, route, langulages, mergeLangulage, listLoading, dispatch } = props;
  const [editing, setEditing] = useState(EditStatus.CANCEL);
  const [visibleData, setVisibleData] = useState({})
  const [currentLangulage, setCurrentLangulage] = useState('zh-CN')
  const bodyHeight = getTableHeight(MAIN_CONFIG, 120)

  const columns = [
    {
      title: tr('语言文字'),
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: tr('客制化语言文字'),
      dataIndex: 'value',
      key: 'value',
      editConfig: {
        render: (text: string, record: object, index: number) => {
          return <GantInput onChange={
            (value: string) => {
              setVisibleData(({ ...data }) => {
                data[currentLangulage][index]['value'] = value
                return data
              })
            }
          } />
        }
      }
    },
  ]


  const handleTabChange = useCallback((activeKey) => {
    setCurrentLangulage(activeKey)
    const visibleDataTemp = _.cloneDeep(visibleData)
    visibleDataTemp[activeKey] = mergeLangulage[activeKey].slice(0, 50);
    setVisibleData(visibleDataTemp)
  }, [mergeLangulage, visibleData])

  const handleSearch = useCallback((value) => {
    const visibleDataTemp = _.cloneDeep(visibleData)
    if (value == '') {
      visibleDataTemp[currentLangulage] = mergeLangulage[currentLangulage].slice(0, 50);
      setVisibleData(visibleDataTemp)
      return
    }
    const result = mergeLangulage[currentLangulage].filter((item: object) => {
      return item['keyword'].indexOf(value) > -1 || item['value'].indexOf(value) > -1
    })
    visibleDataTemp[currentLangulage] = result
    setVisibleData(visibleDataTemp)
  }, [visibleData, currentLangulage, mergeLangulage])

  useEffect(() => {
    dispatch({
      type: 'locale/getCustomLocale',
      payload: {
        localeKey: currentLangulage
      }
    })
  }, [])

  useEffect(() => {
    setVisibleData((visibleData) => {
      const visibleDataTemp = _.cloneDeep(visibleData)
      visibleDataTemp[currentLangulage] = mergeLangulage[currentLangulage].slice(0, 50)
      return visibleDataTemp
    })
  }, [mergeLangulage])



  const wheel = useCallback(() => {
    const visibleDataTemp = _.cloneDeep(visibleData)
    visibleDataTemp[currentLangulage] = mergeLangulage[currentLangulage].slice(0, visibleData[currentLangulage].length + 20);
    setVisibleData(visibleDataTemp)
  }, [visibleData, currentLangulage, mergeLangulage])

  //执行保存
  const handleSave = useCallback(() => {
    setEditing(EditStatus.SAVE)
    const mergeLangulageTemp = _.cloneDeep(mergeLangulage)
    mergeLangulageTemp[currentLangulage] = _.unionWith(
      visibleData[currentLangulage],
      mergeLangulageTemp[currentLangulage],
      (arrVal: any, othVal: any) => {
        if (arrVal['key'] == othVal['key']) {
          return true
        }
      }
    );
    dispatch({
      type: 'locale/modifyCustomLocale',
      payload: {
        localeKey: currentLangulage,
        localeData: mergeLangulageTemp[currentLangulage]
      }
    })
  }, [dispatch, mergeLangulage, currentLangulage, visibleData])

  return (
    <Card
      title={<Title route={route} />}
      className='specialCardHeader'
    >
      <Tabs defaultActiveKey={currentLangulage}
        onChange={handleTabChange}
      >
        {
          langulages.map((item: object) =>
            <TabPane tab={item['name']} key={item['key']} style={{ padding: 10 }}>
              {currentLangulage == item['key'] && <Table
                columns={columns}
                dataSource={visibleData[item['key']]}
                hideVisibleMenu
                rowKey='key'
                headerLeft={
                  <>
                    <Search
                      placeholder={tr('请输入语言文字')}
                      onSearch={handleSearch}
                      onChange={(e) => handleSearch(e.target.value)}
                      prefix={<Icon type="exception" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      allowClear
                    />
                  </>
                }
                headerRight={
                  <>
                    <Button size="small" onClick={() => { setEditing(SwitchStatus) }}>{editing === EditStatus.EDIT ? tr("退出") : tr("进入")}{tr('编辑')}</Button>
                    {editing === EditStatus.EDIT && <Button size="small" type="primary" onClick={handleSave}>{tr('保存')}</Button>}
                  </>
                }
                editable={editing}
                scroll={{ x: '100%', y: bodyHeight }}
                pagination={false}
                flex
                wheel={wheel}
                loading={listLoading}
              />}
            </TabPane>
          )
        }
      </Tabs>



    </Card>
  )
}

export default connect(
  ({ locale, settings, loading, user }: { locale: ModelProps, settings: SettingsProps, loading: any, user: UserProps }) => ({
    MAIN_CONFIG: settings.MAIN_CONFIG,
    userId: user.currentUser.id,
    langulages: locale.langulages,
    LocaleLangulages: locale.LocaleLangulages,
    remoteLangulages: locale.remoteLangulages,
    mergeLangulage: locale.mergeLangulage,
    listLoading: loading.effects['locale/fetch'] || loading.effects['locale/reload'],
  })
)(Page)

