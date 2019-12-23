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

let [ git_url, alias ] = args;

alias = alias||git_url.replace(/^(https\:\/\/|http\:\/\/|git\@)git\.gantcloud\.com(\:|\/)([\w\-]+\/)+([\w\-]+)(\.git)?$/,'$4');

execCmd(`git submodule add ${git_url} src/pages/${alias}`)
  .then(()=>execCmd(`git rm --cached src/pages/${alias} .gitmodules`))
  .then(() => {
    console.log(`init ${chalk.cyan(alias)} success ${chalk.green('✔')}`);
  }).catch(error => {
    console.error(chalk.red(error));
  })