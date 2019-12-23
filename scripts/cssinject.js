var fs = require('fs');
var path = require('path');

var stylesStr = fs.readFileSync(path.join(__dirname, './retCss.css'),{encoding:'utf-8'});

var ret = stylesStr.match(/calc\([^;^\}^%^c^v^e.]+\)/g)

console.log('ret', ret)
console.log('ret', ret.length)

var i = 0;
stylesStr = stylesStr.replace(/calc\([^;^\}^%^c^v^e.]+\)/g, (V)=>{
  i++;
  return eval(V.slice(5,-1).replace(/px/g,'')) + 'px'
})

console.log('i', i)

fs.writeFileSync('./scripts/result.css',stylesStr)