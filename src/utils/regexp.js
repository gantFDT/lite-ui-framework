//邮箱
export const emailRegexp = /^[a-zA-Z_\-0-9\u4e00-\u9fa5]+(\.[a-zA-Z_\-0-9\u4e00-\u9fa5]+)?@([a-zA-Z_\-0-9]{2,10}\.){1,3}[a-zA-Z]{2,10}$/

//超链接
export const urlRegexp = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/

//移动电话
export const phoneRegexp = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/

//座机、固定电话
export const landlineRegexp = "^(((\\+\\d{2}-)?0\\d{2,3}-\\d{7,8})|((\\+\\d{2}-)?(\\d{2,3}-)?([1][3,4,5,7,8][0-9]\\d{8})))$"

// 校验ip
export const ipRegexp = /((?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d))/
// export const ipRegexp = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

// 账号检测支持汉字
export const accountRegexp = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]{4,15}$/

// 禁止输入含有%&',;=?$"等字符,包含得时候返回false， 表示输入不可用
export const illegalRegexp = /[^%&'",;=?$\x22]+/

//
export const extpropRegexp = /^\[{.*}\]$/

//传真
export const faxRegexp = /^(\d{3,4}-)?\d{7,8}$/

//检验省份
function checkProv(val) {
  const pattern = /^[1-9][0-9]/;
  const provs = { 11: tr("北京"), 12: tr("天津"), 13: tr("河北"), 14: tr("山西"), 15: tr("内蒙古"), 21: tr("辽宁"), 22: tr("吉林"), 23: tr("黑龙江 "), 31: tr("上海"), 32: tr("江苏"), 33: tr("浙江"), 34: tr("安徽"), 35: tr("福建"), 36: tr("江西"), 37: tr("山东"), 41: tr("河南"), 42: tr("湖北 "), 43: tr("湖南"), 44: tr("广东"), 45: tr("广西"), 46: tr("海南"), 50: tr("重庆"), 51: tr("四川"), 52: tr("贵州"), 53: tr("云南"), 54: tr("西藏 "), 61: tr("陕西"), 62: tr("甘肃"), 63: tr("青海"), 64: tr("宁夏"), 65: tr("新疆"), 71: tr("台湾"), 81: tr("香港"), 82: tr("澳门") };
  if (pattern.test(val)) {
    if (provs[val]) {
      return true;
    }
  }
  return false;
}

//检验时间
function checkDate(val) {
  const pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
  if (pattern.test(val)) {
    const year = val.substring(0, 4);
    const month = val.substring(4, 6);
    const date = val.substring(6, 8);
    const date2 = new Date(`${year}-${month}-${date}`);
    if (date2 && date2.getMonth() === month * 1 - 1) {
      return true;
    }
  }
  return false;
}

//
function checkCode(val) {
  const p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
  const code = val.substring(17);
  if (p.test(val)) {
    let sum = 0;
    for (let i = 0; i < 17; i += 1) {
      sum += val[i] * factor[i];
    }
    if (parity[sum % 11] === code.toUpperCase()) {
      return true;
    }
  }
  return false;
}

// 校验身份证
export const checkID = function checkID(val) {
  if (checkCode(val)) {
    const date = val.substring(6, 14);
    if (checkDate(date)) {
      if (checkProv(val.substring(0, 2))) {
        return true;
      }
    }
  }
  return false;
}