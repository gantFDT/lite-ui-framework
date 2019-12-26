import {gStatus} from './utils'

export default {
  '/security/getUserByUserLoginName': {
    id: 91,
    userLoginName: "TEST",
    userName: "样例用户",
    staffNumber: "001",
    gender: "MALE",
    organizationId: "sH47bl7MkZcQc9I6OZG",
    mobil: "18011358691",
    telephone: "021-45457812",
    email: "995749721@qq.com",
    isActive: true,
    pictureId: 'avatar.png'

  },
  'accountUser/getUserPicture': async () => {
    return 'https://hbimg.huabanimg.com/5bf124eb9870173a7424391887efd94035dd652d36a5-yP7p4H_fw658'
  },
}