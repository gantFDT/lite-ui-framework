const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const yParser = require('yargs-parser');
const fetch = require('node-fetch');
const exec = require('child_process').exec;

const args = yParser(process.argv.slice(2));

if(process.env.npm_package_engines_node!=='>=10.0.0') return console.error(chalk.red('Node.js\'s version expect >=v10.0.0'));

const PRIVATE_TOKEN = 'UmeCBm54hH7Xh_LjzuZA'; // 过期时间 2025-01-01
const REPOSITORY_PATH = 'ui-team%2fgant-blocks'; // 项目路径 ui-team/gant-blocks (/ 需要转义成 %2f)

const fetchGithubFiles = async () => {
  const ignoreFile = ['_scripts'];
  const data = await fetch(`https://git.gantcloud.com/api/v4/projects/${REPOSITORY_PATH}/repository/tree?private_token=${PRIVATE_TOKEN}`);
  if (data.status !== 200) {
    return;
  }
  const tree = await data.json();
  const files = tree.filter(file => file.type === 'tree' && !ignoreFile.includes(file.path));// block文件夹
  return Promise.resolve(files);
};

const findBlocks = () => {
  const blocks = fs.readdirSync('./src/pages',{withFileTypes:true})
  .filter(router=>router.isDirectory()) // 过滤掉文件
  .map(router=>router.name)
  return blocks;
};

const firstUpperCase = pathString => {
    return pathString
        .replace('.', '')
        .split(/\/|\-/)
        .map(s => s.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase()))
        .filter(s => s)
        .join('');
};

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
      resolve();
    });
  });
};

const addBlocks = blocks => blocks.reduce(async (total,block) => {
  return total.then(()=>{
    console.log('install ' + chalk.blue(block) + ' start...');
    const cmd = `umi block add git@gitlab.gantcloud.com:ui-team/gant-blocks/tree/master/${block}`;
    return execCmd(cmd)
  }).then(()=>{
    console.log(`install ${chalk.magenta(block)} success ${chalk.green('✔')}`)
  });
},Promise.resolve())

const installBlocks = async () => {
  const localBlocks = findBlocks();
  const gitBlocks = await fetchGithubFiles();
  let blockOptions = [];
  gitBlocks.forEach(async gitBlock => {
    gitBlock.showName = firstUpperCase(gitBlock.path);
    if(localBlocks.includes(gitBlock.path)){
      gitBlock.disabled = 'Block name repeat.';
    }
  });
  let blockSelected = await inquirer.prompt([{
    type: 'checkbox',
    message: 'Select block(s) to add.',
    name: 'blocks',
    choices: gitBlocks.map(block=>({
      name:block.showName,
      value:block.path,
      checked:!!block.checked,
      disabled:block.disabled||false
    })),
    validate: function (answer) {
      if (answer.length < 1) {
        return 'You must choose at least one block.';
      }
      return true;
    }
  }])
  return addBlocks(blockSelected.blocks)
}

installBlocks().then(() => {
  console.log(`install ${chalk.cyan('all')} success ${chalk.green('✔')}`);
}).catch(error => {
  console.error(chalk.red(error));
})
