import React, { useCallback, useState, useEffect, forwardRef, Ref } from 'react'
import { Icon, EditStatus, SwitchStatus } from 'gantd'
import classnames from 'classnames'
import Zmage from 'react-zmage'
import { Tooltip, Modal, message } from 'antd';
import { isEqual } from 'lodash'
import { getUserIdentity } from '@/utils/utils'
import ImageSelector from './ImageSelector'
import styles from './index.less'
// import { tr } from '@/components/common';
import request from '@/utils/request'

interface Image {
  id?: number | string,
  virtureId: string,
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

export const getImageById = (pictureId: string) => {
  if (!pictureId) return ``;
  const { userToken, userLoginName, userLanguage } = getUserIdentity();
  const path = `/api/file/previewFile?id=${pictureId}&userLanguage=${userLanguage}&userLoginName=${userLoginName}&userToken=${encodeURIComponent(userToken)}`
  return path
}

// 缓存数组默认值
const cacheValueInit: RenderImage[] = []
const initialValue = [] as Array<Image>
/**
 * 
 * 
 * @value array `value`表示图片数组，每一个图片对象包含`virtureId`字段,用以获取图片
 * @onChange function 上传或删除之后的回调
 * @maxLength 图片数量最大值，超过以后不显示上传按钮
 * @edit 是否处于编辑状态，默认false,不会显示上传按钮，保存的时候传0,才会去调取删除图片的接口
 * @allowDelete 是否显示删除按钮
 */
const Upload = (props: Props, ref: Ref<any>) => {
  const {
    value = initialValue,
    maxLength = 5,
    onChange = () => { },
    edit = EditStatus.CANCEL,
    allowDelete = true,
    placeholder = <span style={{ color: '#ccc' }}>{tr('暂无图片')}</span>
  } = props

  if (!Number.isInteger(maxLength) || maxLength < 0) {
    throw new Error("maxLength" + tr('必须是大于0的整数'))
  }

  const getImages = useCallback(
    () => value.slice(0, maxLength).map((item: RenderImage) => {
      if (item.src) return item
      return { ...item, src: getImageById(item.virtureId) }
    }),
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
      if (!isEqual(list, images)) {
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
      request.post('/file/remove', {
        data: {
          ids: deleteImages.map(img => img.virtureId),
        }
      })
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
      console.log(image)
      const item = { ...image, src: getImageById(image.virtureId) }
      const newList: Array<RenderImage> = [...images, item]
      modifyImages(newList)
    },
    [images],
  )

  const onZmage = useCallback(
    (zg: any) => {
      if (zg) {
        setZmage(zg)
      }
    },
    []
  )

  if (edit !== EditStatus.EDIT && images.length <= 0) {
    return placeholder
  }

  return (
    <div className={styles.upload} ref={ref}>
      {
        images.map((img: RenderImage, index) => (
          <div className={styles['upload-list-item']} style={{ backgroundImage: `url(${img.src})` }} key={img.virtureId || img.id} >
            <div className={styles['upload-list-item-tools']}>
              <Tooltip title={tr('预览')}>
                <Icon.Ant
                  type="eye"
                  className={styles['upload-list-item-icon']}
                  onClick={() => preview(index)}
                />
              </Tooltip>
              {
                (edit === EditStatus.EDIT && allowDelete) ? (
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
        (images.length < maxLength && edit === EditStatus.EDIT) ? (
          <ImageSelector onConfirm={onConfirm}>
            <div className={classnames(styles['upload-block'], styles['upload-list-item'])}>
              <Icon.Ant type="cloud-upload" />
            </div>
          </ImageSelector>
        ) : null
      }
      <Zmage
        style={{ width: 0 }}
        ref={onZmage}
        set={images}
        defaultPage={previewIndex}
      />
    </div>
  )
}

export default forwardRef(Upload)
