const fs = require('fs');
const path = require('path');
const walk = require('walk');
const MD5 = require('md5-node');
//const requestpromise = require('request-promise');
const requestpromise = require('request-promise-native').defaults({ family: 4 });

//配置：
const config = {
  //标本语言
  sampleLangulage: 'zh-CN',
  //要翻译的目标语言，key为antd所需的key
  langulages: {
    // 'ja-JP': '日语',
    'en-US': '英语',
    // 'pt-BR': '葡萄牙语',
    'zh-CN': '中文简体',
    // 'zh-TW': '中文繁体',
  },
  //百度翻译的appid和key
  baiduTranslate: {
    appid: '20190222000269988',
    key: 'LGFk8C3pgW8GBvyG5MrS',
  }
};

//调用百度翻译
function translate1(keyword, from, to) {
  return new Promise((resolve, reject) => {
    var appid = config.baiduTranslate.appid;
    var key = config.baiduTranslate.key;
    var salt = new Date().getTime();
    var str1 = appid + keyword + salt + key;
    var sign = MD5(str1);
    var options = {
      uri: 'http://api.fanyi.baidu.com/api/trans/vip/translate',
      method: 'POST',
      headers: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      form: {
        q:keyword,
        from,
        to,
        appid,
        salt,
        sign
      },
      json: true 
    };
    requestpromise(options).then(function (parsedBody) {
      console.log(parsedBody);
      resolve(parsedBody);
    }).catch(function (err) {
      console.log('百度翻译服务暂不可用，请稍后再试');
      console.log(err, '报错位置');
      reject(err);
    });
  });
}

translate1('你好\n哈哈', 'cht', 'en')