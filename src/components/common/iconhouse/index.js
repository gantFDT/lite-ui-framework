/* eslint-disable compat/compat */
/* eslint-disable no-useless-escape */

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { Drawer, Radio, Empty } from 'antd'
// import { connect } from 'dva'
import { Icon, Input, EditStatus } from 'gantd'
import classnames from 'classnames'

import styles from './index.less'
import { tr } from '../formatmessage';

const { getOutLine } = Icon
const outline = getOutLine()
const iconstyle = {
  // transform: "scale(1.5) translate(3.5px,0)"
}
const bodyStyle = {
  height: 'calc(100vh - 41px)',
  overflow: 'hidden'
}

const iconTypes = ['iconFont', 'antIcon']

const IconHouse = ({ inForm = true, onChange = undefined, value = undefined, onBlur = undefined }) => {
  // 图标抽屉
  const [visible, setvisible] = useState(false)
  // 图标id
  const [IDs, setIDs] = useState([])
  // 搜索框
  const [text, settext] = useState()
  // 当前icon
  const [currentId, setCurrentId] = useState(value)
  // 当前显示的图标类型
  const [iconType, seticonType] = useState(iconTypes[0])

  const icons = useMemo(() => ({
    iconFont: IDs,
    antIcon: outline
  }), [IDs])

  const ref = useRef()

  useEffect(() => {
    const click = (e) => {
      // 点击了其他区域
      if (!ref.current.contains(e.target)) {
        if (onBlur && typeof onBlur === 'function') {
          onBlur()
        }
      }
    }
    window.addEventListener('click', click, false)
    return () => {
      window.removeEventListener('click', click)
    };
  }, [ref, onBlur])

  useEffect(() => {
    setCurrentId(value)
  }, [value])

  const toggleVisible = useCallback(
    () => {
      if (!visible) { // 打开
        settext('')
      }
      setvisible(!visible)
    },
    [visible],
  )

  const onSelectIcon = useCallback(id => {
    setCurrentId(id)
    onChange(id)
    toggleVisible()
  })

  // 获取图标id
  useState(() => {
    // const tag = queryIconHouse(iconWareHouse)
    const tag = document.querySelector('svg');
    const iconIds = [].slice.call(tag.querySelectorAll('symbol')).map(symbol => symbol.id)
    setIDs(iconIds)
  })

  // 切换图标
  const handleTypeChange = useCallback(
    (e) => {
      seticonType(e.target.value)
    },
    [],
  )

  const iconsWithFilter = useMemo(() => (
    icons[iconType].filter(id => {
      if (text) {
        const findIndex = [...text].reduce((start, word) => {
          if (start === -1) return start
          const index = id.indexOf(word, start)
          // 没有搜索到
          if (index === -1) return -1
          return index + 1
        }, 0)
        if (findIndex === -1) return false
      }
      return true
    })
  ), [icons, iconType, text])

  return (
    <div ref={ref}>
      <div style={inForm ? { display: 'inline-block', cursor: 'pointer' } : {}} onClick={toggleVisible}>
        {
          currentId ? <Icon type={currentId} title={tr('点击切换')} style={inForm ? iconstyle : {}} /> : <span className={styles['select-btn']}>{tr('点击选择')}</span>
        }
      </div>
      <Drawer
        width={visible ? 500 : 0}
        title={tr("请选择图标")}
        destroyOnClose
        placement='right'
        onClose={toggleVisible}
        visible={visible}
        bodyStyle={bodyStyle}
        getContainer={ref.current}
      >
        <div className={classnames(styles['icon-house-search'])}>
          <Radio.Group value={iconType} onChange={handleTypeChange}>
            {
              iconTypes.map(type => <Radio.Button key={type} value={type}>{type}</Radio.Button>)
            }
          </Radio.Group>
          <div style={{ flex: 1, marginLeft: 10, }}>
            <Input edit={EditStatus.EDIT} value={text} onChange={settext} placeholder={tr('只支持图标id搜索')} allowClear />
          </div>
        </div>
        <div className={classnames(styles['icon-house-scroll'])}>
          {iconsWithFilter.length ? null : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={tr('没有匹配图标')} style={{ margin: '30px auto 0' }} />}
          <div className={classnames(styles['icon-house-content'])}>
            {
              iconsWithFilter.map(id => (
                <div className={styles['icon-house-item']} title={id} key={id} onClick={() => onSelectIcon(id)}>
                  <Icon type={id} className={styles['icon-house-iconitem']} />
                  <div style={{ width: '100%' }}>{id}</div>
                </div>
              ))
            }
          </div>
        </div>
      </Drawer>
    </div>
  )
}

IconHouse.defaultProps = {
  onChange() { }
}

export default IconHouse