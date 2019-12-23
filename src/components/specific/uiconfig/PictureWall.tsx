import React, { useCallback, useState, useMemo, useEffect, forwardRef, Ref } from 'react'
import { Icon, EditStatus } from 'gantd'
import classnames from 'classnames'
import Zmage from 'react-zmage'
import { Tooltip, Modal, message } from 'antd'
import { getImageByPreviewId, JSONisEqual } from '@/utils/utils'
import { Upload as ImageSelector } from '@/components/form'
import styles from './index.less'
import { removeFileApi, turnRightFileApi } from '@/services/file'

import sidebar1 from '@/assets/images/sidebar-1.jpg'
import sidebar2 from '@/assets/images/sidebar-2.jpg'
import sidebar3 from '@/assets/images/sidebar-3.jpg'
import sidebar4 from '@/assets/images/sidebar-4.jpg'

const LocalImages = [
  {src:sidebar1,virtureId:sidebar1},
  {src:sidebar2,virtureId:sidebar2},
  {src:sidebar3,virtureId:sidebar3},
  {src:sidebar4,virtureId:sidebar4}
]

interface Image {
  id?: number | string,
  virtureId: string,
  main?:boolean
}

interface RenderImage extends Image {
  src?: string
}

interface Props {
  placeholder: React.ReactNode | string | null,
  maxLength: number,
  value: Array<Image>,
  onChange: (value: Array<Image>) => void,
  edit: EditStatus,
  allowDelete: boolean,
}

// 缓存数组默认值
const cacheValueInit: RenderImage[] = []

/**
 * 
 * 
 * @value array `value`表示图片数组，每一个图片对象包含`virtureId`字段,用以获取图片
 * @onChange function 上传或删除之后的回调
 * @maxLength 图片数量最大值，超过以后不显示上传按钮
 * @edit 是否处于编辑状态，默认false,不会显示上传按钮，保存的时候传0,才会去调取删除图片的接口
 * @allowDelete 是否显示删除按钮
 */
const PictureWall = (props: Props,ref: Ref<any>) => {
  const {
    value = [],
    maxLength = 5,
    onChange = () => {},
    edit = EditStatus.CANCEL,
    allowDelete = true,
    placeholder = <span style={{ color: '#ccc' }}>{tr('暂无图片')}</span>
  } = props

  if (!Number.isInteger(maxLength) || maxLength < 0) {
    throw new Error("maxLength必须是大于0的整数")
  }

  const maxLen = useMemo(() => maxLength+5,[maxLength]);

  const getImages = useCallback(
    () => {
      let hasLoacalImages = value.find(_item=>~_item.virtureId.indexOf('/'));
      let final = [...(hasLoacalImages?[]:LocalImages),...value].slice(0, maxLen).map((item: RenderImage) => {
        if (item.src) return item
        return { ...item, src: getImageByPreviewId(item.virtureId) }
      });
      let hasMain = final.some(v=>v.main);
      if(!hasMain){
        final[0].main = true;
      }
      return final;
    },
    [value],
  )

  const [images, setImages] = useState(getImages)
  const [previewIndex, setPreviewIndex] = useState(0)
  const [zmage, setZmage] = useState({ setState: (param: any) => { } })
  const [modal, setModal] = useState()
  const [deleting, setDeleting] = useState(false)

  const [cacheValue, setcacheValue] = useState(images)
  const [deleteImages, setdeleteImages] = useState(cacheValueInit)

  // 图片改变手动更新一次
  useEffect(() => {
    setImages(getImages())
  }, [value])

  // 修改图片
  const modifyImages = useCallback(
    (list: Array<RenderImage>) => {
      if (!JSONisEqual(list, images)) {
        setImages(list)
        onChange(list)
      }
    },
    [images],
  )
  // 调用删除接口
  const deleteAction = useCallback(
    () => {
      if (!deleteImages.length) return;
      removeFileApi(deleteImages.map(img => img.virtureId))
    },
    [deleteImages],
  )
  // 编辑状态改变
  useEffect(() => {
    if (edit === EditStatus.EDIT) { // 进入编辑状态，要缓存
      setcacheValue(images)
    } else if (edit === EditStatus.SAVE) { // 保存
      setcacheValue(cacheValueInit)
      deleteAction()
    } else { // 取消编辑，重置value
      setcacheValue(cacheValueInit)
      setdeleteImages(cacheValueInit)
      modifyImages(cacheValue)
    }
  }, [edit])

  // 设为主图
  const toMain = useCallback(
    (index) => {
      let fakeImages = images.map((image,idx) => {
        return {
          ...image,
          main: idx === index
        }
      });
      modifyImages(fakeImages)
    },
    [images],
  )

  // 预览
  const preview = useCallback(
    (index) => {
      setPreviewIndex(index)
      zmage.setState({
        browsing: true,
      })
    },
    [zmage],
  )

  useEffect(() => {
    if (modal) {
      modal.update({
        okButtonProps: {
          loading: deleting,
        },
      })
    }
  }, [deleting])

  // 删除
  const remove = useCallback(
    (index) => {
      const deleteModal = Modal.warning({
        title: tr('提示'),
        content: `${tr('是否确认删除')}`,
        okText: tr('确认'),
        okType: 'danger',
        cancelText: tr('取消'),
        onOk(cb) {
          setDeleting(true)
          const copyList = [...images]
          const deleted = copyList.splice(index, 1)[0]

          setdeleteImages(d => {
            d.push(deleted)
            return d
          })
          modifyImages(copyList)
          setDeleting(true)
          message.success(tr('删除成功'))
          cb()
        },
      })
      setModal(() => deleteModal)
    },
    [images],
  )

  const onConfirm = useCallback(
    (image: Image) => {
      turnRightFileApi(image);
      const item = { ...image, src: getImageByPreviewId(image.virtureId) }
      const newList: Array<RenderImage> = [...images, item]
      modifyImages(newList)
    },
    [images],
  )

  if (edit !== EditStatus.EDIT && images.length <= 0) {
    return placeholder
  }

  return (
    <div className={styles.upload} ref={ref}>
      {
        images.map((img: RenderImage, index) => (
          <div className={classnames(styles['upload-list-item'],img.main&&styles['main'])} style={{ backgroundImage: `url(${img.src})` }} key={img.virtureId || img.id} >
            <div className={styles['upload-list-item-tools']}>
              <Tooltip title={tr('预览')}>
                <Icon.Ant
                  type="eye"
                  className={styles['upload-list-item-icon']}
                  onClick={() => preview(index)}
                />
              </Tooltip>
              {
                !img.main&&(
                  <Tooltip title={tr('设为主图')}>
                    <Icon.Ant
                      type="heart"
                      className={styles['upload-list-item-icon']}
                      onClick={() => toMain(index)}
                    />
                  </Tooltip>
                )
              }
              {
                (index>3 && edit === EditStatus.EDIT && allowDelete) ? (
                  <Tooltip title={tr('删除')}>
                    <Icon.Ant
                      type="delete"
                      className={styles['upload-list-item-icon']}
                      onClick={() => remove(index)}
                    />
                  </Tooltip>
                ) : null
              }
            </div>
          </div>
        ))
      }
      {
        (images.length < maxLen && edit === EditStatus.EDIT) ? (
          <ImageSelector onConfirm={onConfirm} ratio={.5}>
            <div className={classnames(styles['upload-block'], styles['upload-list-item'])}>
              <Icon.Ant type="cloud-upload" />
            </div>
          </ImageSelector>
        ) : null
      }
      <Zmage
        style={{ width: 0 }}
        ref={(zg: any) => { if (zg) setZmage(zg) }}
        set={images}
        defaultPage={previewIndex}
      />
    </div>
  )
}

export default forwardRef(PictureWall)
