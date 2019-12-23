var fs = require('fs');
var path = require('path');
var Extractor = require('./Extractor');

var stylesStr = fs.readFileSync(path.join(__dirname, './antd.css'),{encoding:'utf-8'});

var extractor = new Extractor({matchColors:['var\\(\\-\\-']})

var result = extractor.extractColors(stylesStr);

fs.writeFileSync('./error-colors.css',result.join('\n'));