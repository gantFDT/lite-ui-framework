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
    pictureId: 1

  },
  'accountUser/getUserPicture': async () => {
    return 'https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture'
  },
}