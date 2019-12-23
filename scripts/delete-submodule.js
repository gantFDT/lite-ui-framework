#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const yParser = require('yargs-parser');
const fetch = require('node-fetch');
const exec = require('child_process').exec;

const args = yParser(process.argv.slice(2))._;
const isWin = process.platform === 'win32';

if (process.env.npm_package_engines_node !== '>=10.0.0') return console.error(chalk.red('Node.js\'s version expect >=v10.0.0'));

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

const isExists = path => {
  return new Promise((resolve, reject) => {
    fs.access(path, (error) => {
      resolve(!error);
    });
  });
}

const removeFile = async path => {
  const isFileExists = await isExists(path);
  if(isFileExists){
    return execCmd((isWin ? `rd/s/q` : `rm -rf`) + ` "${path}"`)
  }
  return;
}

let [alias] = args;
const main = async () => {
  // 删除.git/config内相关信息
  let gitConfig = fs.readFileSync('.git/config', { encoding: 'utf-8' });
  let reg = new RegExp(`\\\[submodule\\s\\\"src\\\/pages\\\/${alias}\\\"\\\]\(\(\?\!submodule\)\.\)\+\(\\\[\|\$\)`);
  gitConfig = gitConfig.replace(/\n/g, '--n')
  gitConfig = gitConfig.replace(reg, '$2');
  gitConfig = gitConfig.replace(/\-\-n/g, '\n');
  fs.writeFileSync('.git/config', gitConfig)
  await removeFile(`.git/modules/src/pages/${alias}`)
  await removeFile(`src/pages/${alias}`)
  return removeFile(`.gitmodules`)
}

try {
  main()
  // 提交git
  // .then(()=>execCmd(`git add .`))
  // .then(()=>execCmd(`git commit -m 'delete module - (${alias})'`))
  // .then(()=>execCmd(`git push`))
  .then(() => {
    console.log(`delete ${chalk.cyan(alias)} success ${chalk.green('✔')}`);
  })
} catch (error) {
  console.error(chalk.red(error));
}