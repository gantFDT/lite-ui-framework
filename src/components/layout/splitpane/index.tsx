import React, { useState, useEffect, ReactNode, useImperativeHandle, forwardRef } from 'react';
import SplitPane from 'react-split-pane';
import styles from './index.less'
import classnames from 'classnames'
import { Icon } from 'antd'

interface SplitPaneProps {
  height?: number | string;//高度
  leftWidthPercent: number;//左侧面板宽度百分比，必传，受控，
  rightWidthPercent: number;//右侧面板宽度百分比，必传，受控，
  leftExpandWidthPercent?: number;//左侧面板展开时宽度百分比，默认值 0.3，非必传，不受控，
  rightExpandWidthPercent?: number;//右侧面板展开时宽度百分比，默认值 0.3，非必传，不受控
  onSizeChange?: Function;//size改变的回调
  leftPane: ReactNode;//左侧面板，必传
  centerPane: ReactNode;//中间面板，必传
  rightPane?: ReactNode;//右侧面板，非必传
  leftMinWidth: number;
  rightMinWidth: number;
}

const resolveNumber = (num: number): number => {
  return Math.floor(num * 100) / 100
}

const generateLeftWidthPercent = (centerWidth: number, wrapWidth: number): number => {
  const leftWidthPercent = resolveNumber(1 - (centerWidth / wrapWidth))
  return leftWidthPercent
}

const generateCenterWidth = (leftWidthPercent: number, wrapWidth: number): number => {
  const centerWidth = (resolveNumber(1 - leftWidthPercent) * wrapWidth);
  return centerWidth
}


const Pane = (props: SplitPaneProps, ref: any) => {
  let {
    height = 500,
    leftWidthPercent = 0.3,
    rightWidthPercent = 0,
    leftExpandWidthPercent = 0.3,
    rightExpandWidthPercent = 0.3,
    leftMinWidth = 150,
    rightMinWidth = 150,
    onSizeChange = () => { },
    leftPane,
    centerPane,
    rightPane,
  } = props

  if (!rightPane) {
    rightWidthPercent = 0
    rightExpandWidthPercent = 0
  }
  const [wrapWidth, setWrapWidth] = useState(0)
  const [centerWidth, setCenterWidth] = useState((1 - leftWidthPercent) * wrapWidth)
  const [rightWidth, setRightWidth] = useState(rightWidthPercent * wrapWidth)

  useEffect(() => {
    const tempFunc = () => {
      const SplitPaneWrap = document.getElementsByClassName('SplitPaneWrap');
      if (SplitPaneWrap.length > 0) {
        const wrapWidth = SplitPaneWrap[0]['offsetWidth']
        setWrapWidth(wrapWidth)
        const centerWidthPercent = resolveNumber(1 - leftWidthPercent - rightWidthPercent)
        onSizeChange({
          leftWidthPercent,
          rightWidthPercent,
          centerWidthPercent,
          leftWidth: leftWidthPercent * wrapWidth,
          rightWidth: rightWidthPercent * wrapWidth,
          centerWidth: centerWidthPercent * wrapWidth
        })
      }
    }

    tempFunc()
    window.addEventListener('resize', tempFunc)
    return () => {
      window.removeEventListener('resize', tempFunc)
    }
  }, [leftWidthPercent, rightWidthPercent])


  useEffect(() => {
    setCenterWidth(generateCenterWidth(leftWidthPercent, wrapWidth))
  }, [leftWidthPercent, wrapWidth])

  useEffect(() => {
    setRightWidth(rightWidthPercent * wrapWidth)
  }, [rightWidthPercent, wrapWidth])


  const onLeftSizeChange = (size: number) => {
    // if((wrapWidth - size) < 150){
    //   setCenterWidth(wrapWidth)
    //   return
    // }
    setCenterWidth(size)
    const leftWidthPercent = generateLeftWidthPercent(size, wrapWidth);
    const centerWidthPercent = resolveNumber(1 - leftWidthPercent - rightWidthPercent)
    onSizeChange({
      leftWidthPercent,
      rightWidthPercent,
      centerWidthPercent,
      leftWidth: leftWidthPercent * wrapWidth,
      rightWidth: rightWidthPercent * wrapWidth,
      centerWidth: centerWidthPercent * wrapWidth
    })
  }

  const onRightSizeChange = (size: number) => {
    setRightWidth(size)
    const rightWidthPercent = resolveNumber(size / wrapWidth)
    const centerWidthPercent = resolveNumber(1 - leftWidthPercent - rightWidthPercent)
    onSizeChange({
      rightWidthPercent,
      leftWidthPercent,
      centerWidthPercent,
      leftWidth: leftWidthPercent * wrapWidth,
      rightWidth: rightWidthPercent * wrapWidth,
      centerWidth: centerWidthPercent * wrapWidth
    })
  }

  const collapseLeft = () => {
    setCenterWidth(wrapWidth)
    const leftWidthPercent = 0
    const centerWidthPercent = resolveNumber(1 - leftWidthPercent - rightWidthPercent)
    onSizeChange({
      rightWidthPercent,
      leftWidthPercent,
      centerWidthPercent,
      leftWidth: leftWidthPercent * wrapWidth,
      rightWidth: rightWidthPercent * wrapWidth,
      centerWidth: centerWidthPercent * wrapWidth
    })
  }
  const expandLeft = () => {
    const centerWidth = generateCenterWidth(leftExpandWidthPercent, wrapWidth)
    setCenterWidth(centerWidth)
    const leftWidthPercent = leftExpandWidthPercent
    const centerWidthPercent = resolveNumber(1 - leftWidthPercent - rightWidthPercent)
    onSizeChange({
      rightWidthPercent,
      leftWidthPercent,
      centerWidthPercent,
      leftWidth: leftWidthPercent * wrapWidth,
      rightWidth: rightWidthPercent * wrapWidth,
      centerWidth: centerWidthPercent * wrapWidth
    })
  }

  const collapseRight = () => {
    setRightWidth(0)
    const rightWidthPercent = 0
    const centerWidthPercent = resolveNumber(1 - leftWidthPercent - rightWidthPercent)
    onSizeChange({
      rightWidthPercent,
      leftWidthPercent,
      centerWidthPercent,
      leftWidth: leftWidthPercent * wrapWidth,
      rightWidth: rightWidthPercent * wrapWidth,
      centerWidth: centerWidthPercent * wrapWidth
    })
  }
  const expandRight = () => {
    setRightWidth(rightExpandWidthPercent * wrapWidth)
    const rightWidthPercent = rightExpandWidthPercent
    const centerWidthPercent = resolveNumber(1 - leftWidthPercent - rightWidthPercent)
    onSizeChange({
      rightWidthPercent,
      leftWidthPercent,
      centerWidthPercent,
      leftWidth: leftWidthPercent * wrapWidth,
      rightWidth: rightWidthPercent * wrapWidth,
      centerWidth: centerWidthPercent * wrapWidth
    })
  }

  useImperativeHandle(ref, () => ({
    collapseLeft,
    expandLeft,
    collapseRight,
    expandRight
  }));

  return (
    <div className={
      classnames('SplitPaneWrap', styles.SplitPaneWrap)}
      style={{ height: height }}>
      <SplitPane split="vertical"
        defaultSize="40%"
        onChange={onLeftSizeChange}
        primary="second"
        // minSize={leftMinWidth}
        maxSize={wrapWidth}
        size={centerWidth}
      >
        {
          (wrapWidth - centerWidth > 1) ?
            <div style={{ height: '100%', borderRight: '1px solid rgba(0,0,0,0.01)' }}>
              {leftPane}
            </div>
            :
            <div></div>
        }
        {rightPane ? <SplitPane
          split="vertical"
          defaultSize="50%"
          // minSize={wrapWidth-rightMinWidth}
          maxSize={wrapWidth}
          onChange={onRightSizeChange}
          primary="second"
          size={rightWidth}
        >
          <div style={{ height: '100%', borderRight: '1px solid rgba(0,0,0,0.01)' }}>
            {(wrapWidth - centerWidth >= 1) ?
              <div className={styles.splitLeftCollapse} onClick={collapseLeft}><Icon type="left" /></div>
              :
              <div className={styles.splitLeftExpand} onClick={expandLeft}><Icon type="right" /></div>
            }
            {(rightWidth <= 1) ?
              <div className={styles.splitRightExpand} onClick={expandRight}><Icon type="left" /></div>
              :
              <div className={styles.splitRightCollapse} onClick={collapseRight}><Icon type="right" /></div>
            }
            {centerPane}
          </div>
          {
            (rightWidth > 1) ?
              <div style={{ height: '100%', borderRight: '1px solid rgba(0,0,0,0.01)' }}>
                {rightPane}
              </div>
              :
              <div></div>
          }
        </SplitPane>
          :
          <div style={{ height: '100%', borderRight: '1px solid rgba(0,0,0,0.01)' }}>
            {(wrapWidth - centerWidth >= 1) ?
              <div className={styles.splitLeftCollapse} onClick={collapseLeft}><Icon type="left" /></div>
              :
              <div className={styles.splitLeftExpand} onClick={expandLeft}><Icon type="right" /></div>
            }
            {centerPane}
          </div>
        }
      </ SplitPane>
    </div>
  )
};
export default forwardRef(Pane)