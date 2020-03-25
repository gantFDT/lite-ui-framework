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
  //百度翻译的appid和key,
  baiduTranslate: {
    appid: '你的百度翻译appid',
    key: '你的百度翻译appkey',
  }
};

//初始化
global.localeObj = {};
const localesPath = path.join(__dirname, `../src/`);
const TargetPath = path.join(__dirname, `../src/locales/`);

console.log('删除locale文件');
delDir(TargetPath);
console.log('创建locaale文件夹');
fs.mkdirSync(TargetPath);
console.log('正在编译国际化语言…………');
getFileList(localesPath);

//主流程(核心代码)
function getFileList(path, langulage) {
  var files = [], dirs = [];
  var walker = walk.walk(path, { followLinks: false });
  walker.on('file', function (roots, stat, next) {
    files.push(roots + '/' + stat.name);
    next();
  });
  walker.on('directory', function (roots, stat, next) {
    var name = stat.name;
    dirs.push(roots + '/' + stat.name);
    next();
  });
  walker.on('end', function () {
    var fileslength = files.length;
    files.map(file => {
      readfileAsync(file, 'utf8')
        .then(data => {
          const regex = /tr\(['"]([\u4e00-\u9fa5]+)['"]\)/gm;
          var newdata = data.match(regex);
          if (newdata) {
            newdata.map((item, index, arr) => {
              item = item.replace(/tr\(/g, '');
              item = item.replace(/[)'"]/g, '');
              global.localeObj[item] = item;
            });
          }
          return true;
        }).then(result => {
          fileslength--;
          if (fileslength === 0) {
            Object.keys(config.langulages).map(langulage => {
              var tolangulage = antdKeyToBaiduKey(langulage);
              var localeStr = '';
              var keyslength = Object.keys(global.localeObj).length;
              if (langulage == 'zh-CN') {//中文不用翻译，直接把key写入
                Object.keys(global.localeObj).map(keyword => {
                  keyslength--;
                  localeStr = localeStr + `\t'${keyword}':'${keyword}',\n`;
                  if (keyslength === 0) {
                    localeStr = 'export default {\n' + localeStr + '}';
                    fs.writeFileSync(TargetPath + `${langulage}.js`, localeStr);
                    console.log(`${langulage}.js 编译完成`);
                  }
                });
              } else {//其他语言要翻译后写入
                let localeObj = {}
                let keyArry = Object.keys(global.localeObj)

                let resultKeyArray = [], resultStrArray = [];
                const sliceNum = 500
                for (var i = 0; i < keyArry.length; i += sliceNum) {
                  resultKeyArray.push(keyArry.slice(i, i + sliceNum));
                }
                resultKeyArray.map((arr) => {
                  const keyword = arr.reduce((res, cur) => {
                    return res + '\n' + cur
                  });
                  resultStrArray.push(keyword)
                });
                let resultStrArrayLength = resultStrArray.length;
                resultStrArray.map((resultStr, index, arr) => {
                  translate(resultStr, 'zh', tolangulage).then(value => {
                    resultStrArrayLength--
                    console.log('value', index, value)
                    value && value.map(item => {
                      localeObj[item.src] = item.dst.replace(new RegExp('[/=|/？|/。|/，|/；|/!|/~|/^|/*|/?|/#|/@|/;|/&|/,|/-]'), '')
                    })
                    if (resultStrArrayLength == 0) {
                      let str = JSON.stringify(localeObj).replace(/,/gm, ',\n').replace('{', 'export default {\n').replace('}', '\n}')
                      fs.writeFileSync(TargetPath + `${langulage}.js`, str);
                      console.log(`${langulage}.js 编译完成`);
                    }

                  });
                  return arr
                })
              }
            });
          }
        });
    });
  });
}

//antd语言key和百度翻译语言key装换
function antdKeyToBaiduKey(antdkey) {
  let baidukey = antdkey;
  antdkey == 'zh-TW' && (baidukey = 'cht');
  antdkey == 'en-US' && (baidukey = 'en');
  antdkey == 'pt-BR' && (baidukey = 'pt');
  antdkey == 'ja-JP' && (baidukey = 'jp');
  return baidukey;
}


//调用百度翻译
function translate(keyword, from, to) {
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
        q: keyword,
        from,
        to,
        appid,
        salt,
        sign
      },
      json: true
    };

    requestpromise(options).then(function (parsedBody) {
      console.log('parsedBody', parsedBody)
      resolve(parsedBody.trans_result);
    }).catch(function (err) {
      console.log('百度翻译服务暂不可用，请稍后再试，错误信息', err);
      reject(err);
    });
  });
}


//同步读取文件
function readfileAsync(path, encoding) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, encoding, (err, data) => {
      if (err) {
        reject(err);
        console.log('同步读取文件失败');
      } else {
        resolve(data);
      }
    });
  });
}

//同步写入文件
function appendFileAsync(path, arrstr) {
  return new Promise((resolve, reject) => {
    fs.appendFile(path, arrstr, (err, data) => {
      if (err) {
        reject(err);
        console.log('同步写入文件失败');
      } else {
        resolve(data);
      }
    });
  });
}

//同步删除文件夹
function delDir(path, callback) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      let curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath); //递归删除文件夹
      } else {
        fs.unlinkSync(curPath); //删除文件
      }
    });
    fs.rmdirSync(path);
  }
}
