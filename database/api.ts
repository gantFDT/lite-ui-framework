

const APIS = {
  // '/security/getReactStartMenu': {
  //   success: true,
  //   state: 'success',
  //   data: [{
  //     id: "kBqvKIfKY6WdlHxinvm",
  //     parentResourceId: "ROOT",
  //     type: "REACTMENU_CATEGORY",
  //     name: "个人中心",
  //     icon: "alibaba",
  //     seqNum: 1,
  //     leaf: false,
  //     children: [],
  //     optCounter: 5
  //   }]
  // },
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
    pictureId:1

  },
  'accountUser/getUserPicture': async () => {
    return 'https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture'
  },
  '/security/getReactStartMenu': async () => {
    const data = await db['menu'].toArray();
    return data
  },
  '/accountUserSelf/getUserData': async (params: any) => {
    let data = await db['userData'].where(params).toArray();
    if (!_.isEmpty(data)) {
      data = data[0]
    } else {
      data = null
    }
    return data
  }
}

export default APIS