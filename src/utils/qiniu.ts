import request from 'umi-request';
/**
*  获取七牛云token
*
* @returns token
*/
export const getQiniuToken = async () => {
  const res = await request('/qiniu/', {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    credentials: 'include',
    params: {
      accessKey: 'oNQCRkzdwS0C46o9i3NSSYO-1iqpO3BXnMfsN_GM',
      secretKey: 'IOCrVGHMoo_83MeQfBisPnHwhwzVqirzD-wNUxPo',
      bucket: 'gant-ui'
    },
  });
  return res['token']
}


/**
 *bolb转base64
 *
 * @param {*} blob
 * @returns
 */
export const readBlobAsDataURL = (blob: any) => {
  return new Promise((resolve, reject) => {
    var fileReader = new FileReader()
    fileReader.onload = function (e: any) {
      resolve(e['target']['result'])
    }
    fileReader.readAsDataURL(blob);
  })
}