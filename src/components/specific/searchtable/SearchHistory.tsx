import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Col, Row, Tag, Icon, Input, Modal, Form } from 'antd'
import { SortableContainer, SortableElement, SortEndHandler } from 'react-sortable-hoc'
import arrayMove from 'array-move'
import { isEmpty } from 'lodash'
import classnames from 'classnames'
import moment from 'moment'
import { tr } from '@/components/common/formatmessage'
import { useLocalStorage } from './hooks'
import styles from './style.less'

const LastFilterName = tr('上次查询')

export interface SearchHistoryProps {
  key?:string,
  filter:any,
  filterKey:any,
  onChoose:(params:any)=>void
}

function SearchHistory(props:SearchHistoryProps){
  const {
    filter,
    filterKey,
    onChoose
  } = props
  const [expend, setExpend] = useState<boolean>(false)
  const [filterName, setFilterName] = useState<string>('')
  const [filters, setFilters] = useLocalStorage(filterKey,[])
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [timestamp, setTimestamp] = useState<number|null>(null)

  const lastFilterIndex = useMemo(() => filters.findIndex(({isLastFilter}:{isLastFilter:boolean})=>isLastFilter),[filters])

  const handlerClick = useCallback((filter) => {
    onChoose&&onChoose(filter);
  },[onChoose])
  const handlerRemove = useCallback((index,e) => {
    if(e){
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    let fakeFilters = [...filters];
    fakeFilters.splice(~lastFilterIndex?(index+1):index,1);
    setFilters(fakeFilters)
  },[filters,lastFilterIndex])

  useEffect(() => {
    if(!isEmpty(filter)){
      setTimestamp(moment.now());
      if(filter.isLastFilter){
        setFilterName(LastFilterName)
      }else{
        setFilterName(moment().format('MM/DD HH:mm'))
        setModalVisible(true);
      }
    }
  }, [filter])
  
  useEffect(() => {
    // 记录上次查询
    if(filterName === LastFilterName){
      if(filters[0]&&filters[0].timestamp===timestamp){
        return;
      }
      let fakeFilters:any = [...filters],
        fakeRecord:any = {
          timestamp,
          label:filterName,
          params:filter,
          isLastFilter:true
        }
      if(~lastFilterIndex){
        // 如果有上次查询记录
        fakeFilters[lastFilterIndex] = fakeRecord
      }else{
        // 如果没有上次查询记录
        fakeFilters.unshift(fakeRecord)
      }
      setFilters(fakeFilters)
    }
  }, [filterName,filters,filter,lastFilterIndex,filterKey,timestamp])
  
  const handlerSave = useCallback(() => {
    let fakeFilters:any = [...filters],
      fakeRecord:any = {
        timestamp,
        label:filterName,
        params:filter
      }
    if(~lastFilterIndex){
      // 如果有上次查询记录
      fakeFilters.splice(1,0,fakeRecord)
    }else{
      // 如果没有上次查询记录
      fakeFilters.unshift(fakeRecord)
    }
    setFilters(fakeFilters)
    setModalVisible(false)
  },[filterName,filter,filters,lastFilterIndex,filterKey,timestamp])

  const handlerClose = useCallback(() => {
    setModalVisible(false)
  },[])

  const SortableItem = SortableElement(
      ({ value, index }:any) => <Tag closable onClose={handlerRemove.bind(null,index)} className={styles.tag} onClick={(e)=>handlerClick(value)}>{value.label}</Tag>
  );

  const SortableList = SortableContainer(({ children }:any) => {
      return <Col className={classnames(styles.wrap,expend?styles.expend:'')}>{children}</Col>;
  });

  const handlerSortEnd:SortEndHandler = useCallback(({ oldIndex, newIndex }) => {
    let final:any[] = [];
    if(~lastFilterIndex){
      final = [filters[0],...arrayMove(filters.slice(1), oldIndex, newIndex)]
    }else{
      final = [...arrayMove(filters, oldIndex, newIndex)]
    }
    setFilters(final);
  },[filters,lastFilterIndex])
  

  return (
    <>
      <Modal
        title={tr('记忆筛选器')}
        visible={modalVisible}
        onOk={handlerSave}
        onCancel={handlerClose}
      >
        <Form layout='horizontal'>
          <Form.Item label={tr('名称')}>
            <Input value={filterName} onChange={(e)=>setFilterName(e.target.value)}></Input>
          </Form.Item>
        </Form>
      </Modal>
      {
        filters&&filters.length?
        <Row className={styles.searchHistory}>
          <SortableList onSortEnd={handlerSortEnd} axis="xy" distance={5} helperClass={styles.sortableHelper}>
            {
              !!~lastFilterIndex&&
              <Tag className={styles.tag} onClick={()=>handlerClick(filters[0])}>{filters[0].label}</Tag>
            }
            {
              (!!~lastFilterIndex?filters.slice(1):filters).map((filter:any,index:number)=>(
                <SortableItem key={filter.timestamp} index={index} value={filter}/>
              ))
            }
          </SortableList>
          <Col className={styles.expendIcon} span={2}>
            <Icon type={expend?"up":"down"} onClick={()=>setExpend(!expend)}/>
          </Col>
        </Row>:
        null
      }
    </>
  )
}

export default SearchHistory