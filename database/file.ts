
import { gStatus } from './utils'
import * as qiniu from 'qiniu-js'
import { generateUuid } from '@/utils/utils'
import { getQiniuToken } from '@/utils/qiniu'


//example:

const putExtra = {}
const config = {}
export default {
  '/file/upload': async (params: any) => {
    const token = await getQiniuToken()
    const content = params.get('files')
    // const base64 = await readBlobAsDataURL(content);
    // let data = await db['file'].add({ data: base64 });
    let data
    let options = {
      quality: 0.92,
      noCompressIfLarger: true
      // maxWidth: 1000,
      // maxHeight: 618
    }
    const key = generateUuid() + '.png'
    // qiniu.compressImage(content, options).then(data => {
    var observable = qiniu.upload(content, key, token, putExtra, config)
    var subscription = observable.subscribe({
      next(res) {
        console.log('res1', res)
      },
      error(err) {
        console.log('err', err)
      },
      async complete(res) {
        const file = res['key']
        console.log('res3', res)
        if (file) { data = await db['file'].add({ id: key, data: file }) }

      }
    })
    // })
    data = gStatus('success', { id: key })
    return data

  },
  '/file/turnRight': async (params: any) => {
    // const { dataType, dataId } = params
    // let data = await db['companyData'].where({ dataType, dataId }).toArray();
    // if (!_.isEmpty(data)) {
    //   data = data[0]
    // } else {
    //   data = null
    // }
    // data = gStatus('success', data)
    return true
  },
}