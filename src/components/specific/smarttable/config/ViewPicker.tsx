import React, { useState, useCallback } from 'react'
import { Icon, Popover, Row, Divider, Tag, Modal, Input, Button } from 'antd'
import { isEmpty } from 'lodash';
import styles from './index.less';
import { tr } from '@/components/common';

interface ViewPickerProps {
  [propName:string]:any
}
export function ViewPicker(props:ViewPickerProps){
  const { children, views, value, onChange, onSaveViews, ...restProps } = props;

  const [activeKey, setActiveKey] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [fakeTitle, setFakeTitle] = useState('');

  const setDefault = useCallback((key,index,e) => {
    if (e) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    views.systemViews.forEach(V=>{
      V.defaultView = false;
    })
    views.customViews.forEach(V=>{
      V.defaultView = false;
    })
    views[key][index].defaultView = true;
    onSaveViews({...views});
  },[views,onChange])

  const handlerChangeView = useCallback((key,index,e) => {
    if (e) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    onChange({...views[key][index]})
  },[views,onChange])

  const handlerEdit = useCallback((key,index,e) => {
    if (e) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    setActiveIndex(index)
    setActiveKey(key)
    setFakeTitle(views[key][index].name)
    setEditModalVisible(true)
  },[views])
  
  const handlerRemove = useCallback((key,index,e) => {
    if (e) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    let row = views[key][index];
    // 删掉默认
    if(row.defaultView){
      views.systemViews[0].defaultView = true;
    }
    // 删掉已启用
    if(value.viewId === row.viewId){
      onChange({...views.systemViews[0]})
    }
    views[key].splice(index,1);
    onSaveViews({...views});
  },[value, views, activeIndex])

  const handlerSave = useCallback(() => {
    views[activeKey][activeIndex].name = fakeTitle;
    onSaveViews({...views});
    setEditModalVisible(false)
  },[views,fakeTitle,activeKey,activeIndex])
  
  const stoppropagation = useCallback((e) => {
    if (e) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
  },[])

  const PopoverContent = (
    <div
      style={{width:300,margin: '-18px -10px -10px',padding: '18px 10px 10px'}}
      onMouseDown={stoppropagation}
      onDoubleClick={stoppropagation}
    >
      <Divider style={{fontSize:14,margin:'8px 0'}} orientation="left">{tr('系统视图')}</Divider>
      {
        views.systemViews.map((sysView,index)=>(
          <Row type="flex" className={styles.viewPickerRow} onClick={handlerChangeView.bind(null,'systemViews',index)} justify="space-between" style={{height:'24px'}} key={sysView.viewId}>
            <div>
              <span>{sysView.name}</span>
              {sysView.defaultView&&<Tag className="marginh5">{tr('默认')}</Tag>}
              {/* {value.viewId === sysView.viewId&&<Tag className="marginh5">启用</Tag>} */}
            </div>
            <div className={styles.opreator}>
              {!sysView.defaultView&&<span onClick={setDefault.bind(null,'systemViews',index)}>{tr('设为默认')}</span>}
            </div>
          </Row>
        ))
      }
      {
        !isEmpty(views.customViews)&&(
          <>
            <Divider style={{fontSize:14,margin:'8px 0'}} orientation="left">{tr('我的视图')}</Divider>
            {
              views.customViews.map((cusView,index)=>(
                <Row type="flex" className={styles.viewPickerRow} onClick={handlerChangeView.bind(null,'customViews',index)} justify="space-between" style={{height:'24px'}} key={cusView.viewId}>
                  <div>
                    <span>{cusView.name}</span>
                    {cusView.defaultView&&<Tag className="marginh5">{tr('默认')}</Tag>}
                    {/* {value.viewId === cusView.viewId&&<Tag className="marginh5">启用</Tag>} */}
                  </div>
                  <div className={styles.opreator}>
                    {!cusView.defaultView&&<span onClick={setDefault.bind(null,'customViews',index)}>{tr('设为默认')}</span>}
                    <Icon className="pointer marginh5" type="edit" onClick={handlerEdit.bind(null,'customViews',index)}/>
                    <Icon className="pointer marginh5" type="delete" onClick={handlerRemove.bind(null,'customViews',index)}/>
                  </div>
                </Row>
              ))
            }
          </>
        )
      }
      <Modal
        visible={editModalVisible}
        title={tr('修改视图名称')}
        onCancel={() => setEditModalVisible(false)}
        zIndex={1040}
        footer={<div>
            <Button size="small"   icon='close-circle' onClick={() => setEditModalVisible(false)}>{tr('取消')}</Button>
            <Button size="small"   type='primary' disabled={!fakeTitle} icon='save' onClick={handlerSave}>{tr('保存')}</Button>
        </div>}
      >
        <Input value={fakeTitle} onChange={e => setFakeTitle(e.target.value)}></Input>
      </Modal>
    </div>
  )
  
  return (
    <Popover
      {...restProps}
      content={PopoverContent}
    >
      {children}
    </Popover>
  )
}

export default ViewPicker;