#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const yParser = require('yargs-parser');
const fetch = require('node-fetch');
const exec = require('child_process').exec;

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

const getDependencies = () => {
  let subModules = fs.readdirSync(path.join(__dirname, '../src/pages'),{withFileTypes:true})
  .filter(item=>item.isDirectory()&&!item.name.includes('.')) // 过滤掉文件
  .map(item=>item.name);

  let dependencies = [];
  // 子模块路由
  subModules.forEach(_module=>{
    // 子模块配置
    let moduleConfig;
    // 兼容找不到config.js的情况
    try{
      moduleConfig = require(path.join(__dirname, '../src/pages',_module,'config.json'));

      if(moduleConfig.dependencies){
        dependencies = [...dependencies,...Object.keys(moduleConfig.dependencies)]
      }
      if(moduleConfig.devDependencies){
        dependencies = [...dependencies,...Object.keys(moduleConfig.devDependencies)]
      }

    }catch(e){
    }
  })

  return [...new Set(dependencies)];
}

const dependencies = getDependencies().join(' ');

if(!dependencies) return console.log(`install ${chalk.cyan('all')} success ${chalk.green('✔')}`);

console.log(chalk.yellow(`npm install ${getDependencies().join(' ')}`));

execCmd(`npm install ${getDependencies().join(' ')}`).then(() => {
  console.log(`install ${chalk.cyan('all')} success ${chalk.green('✔')}`);
}).catch(error => {
  console.error(chalk.red(error));
})