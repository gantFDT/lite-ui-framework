import React, { useState, useCallback, useEffect, useMemo, Dispatch } from 'react'
import { Form, Col, Row, Button, Tooltip, Drawer,Icon } from 'antd'
import { Header } from 'gantd'
import { connect } from 'dva'
import classnames from 'classnames'
import { debounce } from 'lodash'
import { generValues, enterValues } from './fieldgenerator'
import SearchHistory from './SearchHistory';
import { tr } from '@/components/common/formatmessage'
import styles from './style.less'
import WithKeyEvent from '@/components/common/withkeyevent';

export interface SearchFormProps {
  form: any,
  title: string,
  fields: Array<any>,
  filterTtrigger?: 'auto' | 'manual',
  filterDisplay?: 'tile' | 'drawer',
  onFilter?: (values: any) => void,
  onReload?: (values: any) => void,
  children: React.ReactNode,
  [_propName: string]: any
}

const isInitFilter = (filter: object) => {
  let jumpKeys: any[] = []; // 不验证的参数
  let isInit = true;
  isInit = !Object.entries(filter).some(([_key, _value]) => ( // 需要验证的参数 并且 不是初始的值
    !jumpKeys.includes(_key) &&
    _value
  ))
  return isInit;
}

const LastFilterName = tr('上次查询')
const TempFilterName = tr('临时查询')

const tileColLayout = {
  span: 24,
  md: {
    span: 12
  },
  xxl: {
    span: 6
  }
}
const drawerColLayout = {
  span: 24
}

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

function SearchForm(props: SearchFormProps) {
  const {
    form: { getFieldDecorator, setFieldsValue, getFieldsValue },
    title,
    fields,
    fieldsMap,
    filterTrigger,
    filterDisplay,
    filterKey,
    onFilter,
    onReload,
    // 以下为快捷键相关
    drawerStack,
    setFilterDrawerStack,
    setFilterDrawerVisible
  } = props;
  const [filterLabel, setFilterLabel] = useState(''); // 筛选器名字
  const [displayFilterLabel, setDisplayFilterLabel] = useState(''); // 筛选器名字

  // 以下为快捷键相关
  useEffect(() => {
    setFilterDrawerStack({
      ...drawerStack,
      activeKey: filterKey,
      [filterKey]: false
    })
    return () => {
      setFilterDrawerStack(drawerStack)
    }
  }, [])
  const finalVisible = useMemo(() => drawerStack[filterKey], [drawerStack, filterKey])
  const handlerVisible = useCallback((visible: boolean) => {
    setFilterDrawerVisible({
      filterKey,
      visible
    })
  }, [filterKey])

  // 筛选参数
  const searchParams: any = getFieldsValue()

  // 处理筛选
  const handlerFilter = useCallback(debounce((searchParams) => {
    searchParams = generValues(searchParams, fieldsMap);
    if (onFilter)
      onFilter(searchParams)
  }, 200), [onFilter])

  // 重置
  const onReset = useCallback(() => {
    const reset = {}
    fields.forEach(_field => reset[_field.key] = undefined);
    setFilterLabel('')
    setDisplayFilterLabel('')
    setFieldsValue(reset)
    handlerFilter(reset)
  }, [fields, handlerFilter])

  // 刷新
  const handlerReload = useCallback(() => {
    let params = generValues(searchParams, fieldsMap);
    if (onReload)
      return onReload(params)
    if (onFilter)
      onFilter(params)
  }, [searchParams, onReload, onFilter])

  // 待记忆的参数
  const [filterMemo, setFilterMemo] = useState({})

  // 点击筛选器
  const handlerChoose = useCallback((_filter) => {
    let _params = {}
    fields.forEach(_field => _params[_field.key] = _filter.params[_field.key]);
    _params = enterValues(_params, fieldsMap);
    setFieldsValue(_params)
    setFilterLabel(_filter.label)
  }, [])

  // 点击Drawer的查询按钮
  const handlerClickDrawerSearch = useCallback(() => {
    if (!filterLabel || filterLabel === LastFilterName) {
      setFilterLabel(TempFilterName)
      setDisplayFilterLabel(TempFilterName)
    } else {
      setDisplayFilterLabel(filterLabel)
    }
    setFilterMemo({
      ...searchParams,
      isLastFilter: true
    })
    handlerFilter(searchParams)
    handlerVisible(false)
  }, [searchParams, filterLabel, handlerFilter])

  const handlerToggleDrawer = useCallback(() => {
    if (drawerStack.activeKey === filterKey)
      handlerVisible(!drawerStack[filterKey])
  }, [drawerStack])

  const handlerFastFilter = useCallback(() => {
    if (drawerStack.activeKey === filterKey && drawerStack[filterKey]) {
      handlerClickDrawerSearch()
    }
  }, [handlerClickDrawerSearch, drawerStack])

  // 关闭Drawer
  const handlerCloseDrawer = useCallback(() => {
    setFilterLabel('')
    setDisplayFilterLabel('')
    handlerVisible(false)
  }, [])

  // 自动筛选
  useEffect(() => {
    if (filterTrigger === 'auto')
      handlerFilter(searchParams)
  }, [searchParams, filterTrigger, handlerFilter])

  // 识别出来的BlockHeader标题
  const blocks = useMemo(() => [...new Set(fields.map(({ searchBlockName }) => searchBlockName))], [fields])

  const FormContent = (
    <div className={styles.searchForm}>{
      blocks.map((block, idx) => {
        return (
          <div key={block || idx}>
            {block && filterDisplay !== 'tile' && <Header bottomLine title={block} />}
            <Form layout='horizontal' style={{ marginTop: !block && filterDisplay !== 'tile' ? 15 : 0 }} labelCol={{ span: 6 }} wrapperCol={{ span: 16, offset: 1 }}>
              <Row gutter={24} >
                {
                  fields.filter(_v => _v.searchBlockName === block).map(({
                    key,
                    name,
                    component
                  }) => {
                    return (
                      <Col key={key} {...filterDisplay === 'tile' ? tileColLayout : drawerColLayout}>
                        <Form.Item label={name} {...formItemLayout}>
                          {
                            getFieldDecorator(key, {})(component)
                          }
                        </Form.Item>
                      </Col>
                    )
                  })
                }
              </Row>
            </Form>
          </div>
        )
      })
    }</div>
  )

  return <WithKeyEvent
    onAltS={handlerToggleDrawer}
    onEnter={handlerFastFilter}
  >
    {
      filterDisplay === 'tile' ? (
        <div className={styles.searchContainer} >
          <div className={styles.searchTool} >
            <div className={styles.searchTips} >
              <Header size="big" bottomLine={false} title={title} />
            </div>
            <div className={styles.searchRest} >
              <Tooltip title={tr(`重置`)}>
                <Button size="small" icon="undo" className="marginh5" onClick={onReset}></Button>
              </Tooltip>
              {
                filterTrigger !== 'auto' &&
                <Tooltip title={tr(`筛选`)}>
                  <Button size="small" icon="search" onClick={() => handlerFilter(searchParams)}></Button>
                </Tooltip>
              }
            </div>
          </div>
          {FormContent}
        </div>
      ) : (
          <>
            <Drawer
              visible={finalVisible}
              title={title}
              width={400}
              className={classnames(styles.draw, "notranslate")}
              bodyStyle={{ padding: "0px 24px" }}
              onClose={handlerCloseDrawer}
            >
              <>
                <SearchHistory
                  filter={filterMemo}
                  filterKey={filterKey}
                  onChoose={handlerChoose}
                />
                {FormContent}
                <div className="widgetconfigfooter">
                  <Button size="small" disabled={isInitFilter(searchParams)} icon="undo" className="marginh5" onClick={onReset}>{tr('重置')}</Button>

                  <Button size="small" disabled={isInitFilter(searchParams)} icon="plus" className="marginh5" onClick={() => setFilterMemo(searchParams)}>{tr('记忆')}</Button>

                  <Button size="small" type='primary' className="marginh5" icon="search" onClick={handlerClickDrawerSearch}>{tr('查询')}</Button>
                </div>
              </>
            </Drawer>
            <Tooltip title={tr(`刷新`)}>
              <Button size="small" icon="reload" className="marginh5" onClick={handlerReload}></Button>
            </Tooltip>
            <Tooltip title={tr(`筛选`)}>
              {displayFilterLabel ? (
                // <div className={styles.filterBtn}>
                <Button.Group size='small'>
                  <Button onClick={() => handlerVisible(true)} >{displayFilterLabel}</Button>
                  <Button onClick={onReset}><Icon type="close"/></Button>
                </Button.Group>
              ) : (
                  <Button size="small" icon="filter" onClick={() => handlerVisible(true)}></Button>
                )}
            </Tooltip>
          </>
        )
    }
  </WithKeyEvent>
}

const SearchFormWrap = Form.create()(SearchForm);

export default connect(
  ({ global }: any) => ({
    drawerStack: global.filterDrawerStack
  }),
  (dispatch: Dispatch<any>) => ({
    setFilterDrawerVisible: (payload: { filterKey: string, visible: boolean }) => {
      dispatch({
        type: 'global/setFilterDrawerVisible',
        payload
      })
    },
    setFilterDrawerStack: (stack: any) => {
      dispatch({
        type: 'global/save',
        payload: {
          filterDrawerStack: stack
        }
      })
    },
  })
)(SearchFormWrap)