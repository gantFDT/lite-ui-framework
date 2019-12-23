import React, { Component, useEffect, useState, useMemo, useCallback } from 'react';
import router from 'umi/router'
import Link from 'umi/link';
import styles from './index.less';
import { Icon, Dropdown, Menu } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import { useLocalStorage } from '@/utils/hooks'

import { routerRedux } from 'dva/router';
const initalValue = {
  localTaskbarData: [],
  localCurrentId: ''
}
function TaskBar(props) {
  const username = window.localStorage.getItem('username')
  const arrowsClassName = `${styles.arrowsIcon} ${styles.forbidArrows}`
  const { location, menuData, dispatch, userId } = props;
  const [currentId, setCurrentId] = useState('');
  const [taskbarData, setTaskBarData] = useState([]);
  const [menuArr, setmenuArr] = useState([]);
  const [arrowsShow, setArrowsShow] = useState(false)
  const [isfirst, setIsFirst] = useState(true);
  const [leftArrowsCss, setLeftArrowsCss] = useState(arrowsClassName)
  const [rightArrowsCss, setRightArrowsCss] = useState(styles.arrowsIcon)

  const [localData, setLocalStorage] = useLocalStorage(`TaskBar:${username}`, initalValue);
  const { localTaskbarData, localCurrentId } = localData;
  //taskbar之间的切换
  const onChangePage = (structurFormData, currentId, e) => {
    dispatch(routerRedux.push({
      pathname: structurFormData.path,
    }))
    setCurrentId(structurFormData.id)
  }

  const onClosePage = (structurFormData, currentId, e) => {
    e.stopPropagation();
    e.preventDefault();
    const currentIndex = taskbarData.findIndex(item => item.id === structurFormData.id);
    let changeId = currentId;
    const newArray = _.map(taskbarData, (a) => { return a })
    newArray.splice(currentIndex, 1)
    if (structurFormData.id == currentId) {  //删除为高亮情况
      if (newArray.length) {
        if (newArray.length > currentIndex) { //后面有多余项
          dispatch(routerRedux.push({
            pathname: newArray[currentIndex].path,
          }))
          changeId = newArray[currentIndex].id
        } else if (newArray.length == currentIndex) { //删除的为最后面一项时
          dispatch(routerRedux.push({
            pathname: newArray[currentIndex - 1].path,
          }))
          changeId = newArray[currentIndex - 1].id
        }
      } else {
        dispatch(routerRedux.push({
          pathname: '/',
        }))
        changeId = '';
      }
    }
    setCurrentId(changeId)
    setTaskBarData(newArray)
  }

  //遍历menuData将所有数据展开存入menuArr
  const recursionMenu = (location, structurFormData) => {
    structurFormData.map((item, index) => {
      if (item.children) {
        recursionMenu(location, item.children)
      }
      menuArr.push(item)
    })
    setmenuArr(menuArr)
  }
  //第一次进入系统并且有路由情况下获取menuArr
  useEffect(() => {
    if (menuData.length && menuData.length > 2 && !menuArr.length) {
      recursionMenu(location, menuData);
      setIsFirst(false)
    }
  }, [menuData])

  //第一次进入系统并且有路由情况下将数据set进taskbarData
  useEffect(() => {
    if (!isfirst && menuArr.length && location.pathname && location.pathname !== '/') {
      let item = '';
      if (localTaskbarData.length) {
        item = localTaskbarData.find(val => val.path == location.pathname);
        setTaskBarData(localTaskbarData)

      } else {
        item = menuArr.find(val => val.path == location.pathname);
        if (item) { setTaskBarData([item]) }
      }
      if (item) { setCurrentId(item.id) }
    }
  }, [isfirst])

  //非第一次进入系统taskbarData变化
  useEffect(() => {

    if ((taskbarData.length > 1 || menuArr.length) && location.pathname !== '/' && location.pathname !== '/home') {
      let pathitem = taskbarData.find(val => val.path == location.pathname);
      if (!pathitem) {
        let item = menuArr.find(val => val.path == location.pathname);
        if (item) {
          taskbarData.push(item)
          setCurrentId(item.id)
          setTaskBarData(taskbarData)
          userId && setLocalStorage({ localTaskbarData: taskbarData, localCurrentId: item.id })
        }
      } else {
        setCurrentId(pathitem.id)
        setTaskBarData(taskbarData)
        userId && setLocalStorage({ localTaskbarData: taskbarData, localCurrentId: pathitem.id })
      }
    }
    if (location.pathname == '/' || location.pathname == '/home') {
      setCurrentId('')
      setTaskBarData(taskbarData)
      userId && setLocalStorage({ localTaskbarData: taskbarData, localCurrentId: '' })
    }
  }, [taskbarData, location])



  const handleMobileTaskbar = ((e) => {
    const tsakbarul = document.getElementById('tsakbarul');
    const taskbarouter = document.getElementById('taskbarouter');
    const left = tsakbarul.offsetLeft;
    const right = tsakbarul.offsetWidth - taskbarouter.offsetWidth + left;
    if (e == 'left') {
      if (left < 0 && left > -500) {
        tsakbarul.style.left = '0px';
      } else if (left < -500) {
        tsakbarul.style.left = `${left + 500}` + 'px';

      }
    } else {
      if (right > 0 && right < 500) {
        tsakbarul.style.left = `${left - right}` + 'px';
      } else if (right >= 0 && right > 500) {
        tsakbarul.style.left = `${left - 500}` + 'px';
      }
    }
    const currentleft = parseInt(tsakbarul.style.left);
    const currentright = tsakbarul.offsetWidth - taskbarouter.offsetWidth + currentleft;
    setLeftArrowsCss(currentleft < 0 ? `${styles.arrowsIcon}` : arrowsClassName)
    setRightArrowsCss(parseInt(currentright) <= 0 ? arrowsClassName : `${styles.arrowsIcon}`)
  })

  //监听窗口大小变化
  useEffect(() => {
    handleChangeWidth()
    window.addEventListener('resize', handleChangeWidth)
    return function cleanup() {
      window.removeEventListener('resize', handleChangeWidth);
    };
  })

  const handleChangeWidth = (() => {
    const tsakbarul = document.getElementById('tsakbarul');
    const taskbarouter = document.getElementById('taskbarouter');
    if (tsakbarul && taskbarouter) {
      if (tsakbarul.offsetWidth > taskbarouter.offsetWidth) {
        setArrowsShow(true)
      } else {
        setArrowsShow(false)
        tsakbarul.style.left = '0px';
      }
    }
  });

  const menu = useMemo(() => {
    return (<Menu selectedKeys={[currentId]}>
      {
        taskbarData.length && taskbarData.map((item) => {
          return (
            <Menu.Item key={item.id} onClick={(e) => onChangePage(item, currentId, e)}>
              {item.name}
              <Icon className={styles.taskbarclose} type="close" onClick={(e) => onClosePage(item, currentId, e)} />
            </Menu.Item>
          )
        })
      }
    </Menu>)
  }, [currentId, taskbarData]);

  let className = `${styles.taskbarbtn} ${styles.taskbaractive}`;
  return (
    <>
      {taskbarData.length ?
        <div className={styles.taskbarcontent}>
          <Icon type="left" className={leftArrowsCss} style={{ display: arrowsShow ? 'block' : 'none', float: 'left' }} onClick={() => handleMobileTaskbar('left')} />
          <div className={styles.taskbarouter} id='taskbarouter'>
            <ul className={styles.headerright} id='tsakbarul'>
              {taskbarData.map((item, index) => (
                <Link to={item.path} key={item.id}>
                  <li className={currentId === item.id ? className : styles.taskbarbtn} onClick={(e) => onChangePage(item, currentId, e)} key={item.id}>
                    <span className={styles.taskbartitle}>{item.name}</span>
                    <Icon type="close" onClick={(e) => onClosePage(item, currentId, e)} />
                  </li>
                </Link>
              ))}
            </ul>
          </div>
          <Dropdown overlay={menu} style={{ float: 'right' }} placement="bottomRight">
            <Icon type="down" className={styles.arrowsIcon} style={{ display: arrowsShow ? 'block' : 'none', float: 'right' }} />
          </Dropdown>
          <Icon type="right" className={rightArrowsCss} style={{ display: arrowsShow ? 'block' : 'none', float: 'right' }} onClick={() => handleMobileTaskbar('right')} />

        </div>
        : null}
    </>
  )
}
export default TaskBar;