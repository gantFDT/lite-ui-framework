import React, { useState, useEffect } from 'react'
import { Spin } from 'antd'
import { getIconImageByFileName } from '@/utils/utils'
import styles from './index.less'

interface ImageProps {
  url: string
  className?: string
}

/**
 * 图片平铺显示组件
 */
export default (props: ImageProps) => {
  const {
    url,
    className = ''
  } = props

  const [isLoad, setIsload] = useState(false)
  const image = new Image()


  useEffect(() => {
    image.src = url
    image.onload = () => {
      setIsload(true)
    }
    return () => { setIsload(false) }
  }, [url])

  return (
    <Spin spinning={!isLoad}>
      <div
        className={`${styles.image} ${className}`}
        style={{ backgroundImage: `url(${isLoad ? url : getIconImageByFileName('.png')})` }}
      />
    </Spin>)
}
