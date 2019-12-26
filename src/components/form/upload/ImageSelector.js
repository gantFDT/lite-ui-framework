import React, { Component, useCallback } from 'react';
import propTypes from 'prop-types';
import { Upload, Icon, message, Modal, Button, Slider, Tooltip } from 'antd';
import fetch from 'dva/fetch';
import numeral from 'numeral';
import styles from './index.less';
import classNames from 'classnames';
import { SmartModal } from '../../specific'
import 'cropperjs/dist/cropper.css';
import Cropper from 'react-cropper';

import { uploadFileApi } from '@/services/api'

const large = numeral(600)
const middle = numeral(large).multiply(0.4)
const small = numeral(middle).divide(6)

/**
 * @param { function } onConfirm  点击确定按钮
 * @param { string } shape 预览形状
 */
export default class ImageSelectorCmp extends Component {
  state = {
    uploadFile: null,
    imageSrc: '',
    visible: false,
    sliderDisabled: true,
    uploading: false,
    modalWidth: 700,
    modalHeight: 500
  };

  constructor(props) {
    super(props);

    this.closeModal = this.closeModal.bind(this);
    // this.handlerSizeChange = this.handlerSizeChange.bind(this);

    this.confirm = this.confirm.bind(this); // 确定
  }

  async confirm() {
    const { uploadFile } = this.state
    if (!uploadFile) return
    if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
      return;
    }

    this.setState({
      uploading: true
    })

    const { closeModal } = this
    const { onConfirm, ratio } = this.props
    const fileName = uploadFile.name

    const blob = await new Promise(resolve => {
      this.cropper.getCroppedCanvas().toBlob(b => {
        resolve(b)
      })
    })

    const body = new FormData()
    body.append(fileName, blob);
    body.append('files', blob, fileName);
    //把请求相关参数放入formData中
    body.append('tempFile', false);
    body.append('recTypeId', 0);
    body.append('recId', 0);
    body.append('subRecTypeId', 0);
    body.append('subRecId', 0);

    let ret = await uploadFileApi(body);
    onConfirm(ret.length === 1 ? ret[0] : ret)

    this.setState({
      uploading: false
    })

    closeModal()
  }

  reset() {
    this.setState({
      uploadFile: null,
      imageSrc: '',
      sliderDisabled: true,
    });
  }

  closeModal() {
    this.setState({ visible: false });
  }

  // handlerSizeChange(width, height) {
  //   console.log('handlerSizeChange')
  //   const { imageSrc, uploadFile } = this.state;
  //   this.setState({
  //     modalWidth: width,
  //     modalHeight: height,
  //     uploadFile,
  //     imageSrc,
  //     sliderDisabled: false,
  //     scale: 1,
  //     visible: true
  //   });
  // }

  render() {
    const that = this;
    const { closeModal, confirm, handlerSizeChange } = this;
    const { visible, imageSrc, sliderDisabled, uploadFile, uploading, modalWidth, modalHeight } = this.state;
    const { children, ratio, shape, style, className } = this.props

    let cropperWidth;
    let cropperHeight;
    if (modalWidth - 150 >= (modalHeight - (41 + 45 + 20)) * ratio) {
      cropperHeight = modalHeight - (41 + 45 + 20);
      cropperWidth = cropperHeight * ratio;
    } else {
      cropperWidth = modalWidth - 150;
      cropperHeight = cropperWidth / ratio;
    }

    const uploadProps = {
      accept: 'image/*',
      showUploadList: false,
      className: styles.floatLeft,
      beforeUpload({ type }) {
        if (!/^image\//.test(type)) {
          message.error('请选择图片文件上传');
        }
        return false;
      },

      onChange({ file: originFile, fileList: list }) {
        // 重置图片
        that.setState({
          uploadFile: originFile,
          imageSrc: URL.createObjectURL(originFile),
          sliderDisabled: false,
          scale: 1,
          visible: true
        });
      },
      // ...this.props,
    };

    const footer = [
      <div key="footer">
        <Upload {...uploadProps}>
          <Button size="small">{tr('重新选择')}</Button>
        </Upload>
        <Button size="small" onClick={closeModal}>{tr('取消')}</Button>
        {
          uploadFile ? <Button size="small" type="primary" onClick={confirm} loading={uploading}>{tr('确认')}</Button>
            : <Tooltip title={tr('请选择上传的图片')}><Button size="small" type="primary" disabled style={{ marginLeft: 8 }}>{tr('确认')}</Button></Tooltip>
        }
      </div>
    ];

    return (
      <div
        style={style}
        className={className}
        ref={thisRef => this.thisRef = thisRef}
      >
        <Upload {...uploadProps}>
          {children}
        </Upload>
        <SmartModal
          id='ImageSelectorCmp'
          itemState={{
            height: modalHeight,
            width: modalWidth
          }}
          title={tr('上传图片')}
          visible={visible}
          maskClosable={false}
          onCancel={closeModal}
          footer={footer}
          getContainer={this.thisRef}
        // onSizeChange={handlerSizeChange}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Cropper
              style={{ height: cropperHeight, width: cropperWidth }}
              aspectRatio={ratio}
              viewMode={1}
              guides={false}
              src={imageSrc}
              ref={cropper => this.cropper = cropper}
              preview=".preview"
            />
            <div style={{ width: 120, marginLeft: 10 }}>
              <div className={classNames('preview', styles.preview, shape === 'circle' && styles.circle)} />
              <p style={{ textAlign: 'center', color: '#bfbfbf' }}>{tr('预览')}</p>
            </div>
          </div>
        </SmartModal>
      </div>
    );
  }
}


ImageSelectorCmp.defaultProps = {
  onConfirm: function onConfirm() { },
  ratio: 1,
  cropperWidth: 320,
  shape: 'rectangle'
}

ImageSelectorCmp.propTypes = {
  onConfirm: propTypes.func,
  ratio: propTypes.number,
  cropperWidth: propTypes.number,
  shape: propTypes.oneOf(['rectangle', 'circle']),
}