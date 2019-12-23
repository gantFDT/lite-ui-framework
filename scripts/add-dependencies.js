#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const yParser = require('yargs-parser');
const fetch = require('node-fetch');
const exec = require('child_process').exec;

const args = yParser(process.argv.slice(2))._;

if(process.env.npm_package_engines_node!=='>=10.0.0') return console.error(chalk.red('Node.js\'s version expect >=v10.0.0'));

const execCmd = shell => {
  return new Promise((resolve, reject) => {
    exec(shell, {
      encoding: 'utf8'
    }, (error, statusbar) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      console.log(statusbar);
      resolve(statusbar);
    });
  });
};

const moduleName = args[0];

let subModule = fs.readdirSync(path.join(__dirname, '../src/pages'),{withFileTypes:true})
  .find(item=>item.isDirectory()&&item.name===moduleName);

if(!subModule) return console.error(chalk.red(`请输入正确的子模块名字，(${moduleName})不是正确的名字。`));

let moduleConfig = require(path.join(__dirname, '../src/pages',moduleName,'config.json'));

const isDev = args.slice(1).includes('dev');

const modules = args.slice(1).filter(name=>name!=='dev');

const addModules = moduleNames => moduleNames.reduce(async (total,_module,index) => {
  return total.then(()=>{
    console.log('install ' + chalk.blue(_module) + ' start...');
    const cmd = `npm install ${_module}`;
    return execCmd(cmd)
  }).then((res)=>{
    const keyName = isDev?'devDependencies':'dependencies';
    if(!moduleConfig[keyName]){
      moduleConfig[keyName] = {}
    }
    moduleConfig[keyName][args[index+1]] = res.replace(/^\+.*@((\d|[A-z]|\.|\-)+)\su.*\s$/,'^$1');
    console.log(`install ${chalk.magenta(_module)} success ${chalk.green('✔')}`)
    return fs.writeFileSync(path.join(__dirname, '../src/pages',moduleName,'config.json'), JSON.stringify(moduleConfig,null,2))
  });
},Promise.resolve())

addModules(modules).then(() => {
  console.log(`install ${chalk.cyan('all')} success ${chalk.green('✔')}`);
}).catch(error => {
  console.error(chalk.red(error));
})