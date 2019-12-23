const co = require('co');
const coFs = require('co-fs');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const walkSync = require('walk-sync');
const path = require('path')

const { delDir, dirReplace, copyDir, sleep, formatJSON2String } = require('./utils/utils')
const { generateTableSchema, generateModalSchema, generateSearchSchema } = require('./utils/ext')

const srcDir = path.join(__dirname, `extcode/`);
const distDir = path.join(__dirname, `reactcode/`);
const templatesDir = path.join(__dirname, `../src/templates/`);

const templates = fs.readdirSync(templatesDir)
let templatesArr = []
templates.forEach((p) => { templatesArr.push(p) })

//作业主流程
co(function* () {
  delDir(distDir)
  sleep(100)
  const answersPageName = yield inquirer.prompt([{
    type: 'input',
    message: 'pageName:',
    name: 'pagename',
    choices: templatesArr,
    validate: function (answer) {
      if (answer.length < 1) {
        return 'You must wirte a pagename';
      }
      return true;
    }
  }])
  const pageName = answersPageName.pagename
  const answersTemplate = yield inquirer.prompt([{
    type: 'list',
    message: 'Select a template.',
    name: 'template',
    choices: templatesArr,
    validate: function (answer) {
      if (answer.length < 1) {
        return 'You must choose a template';
      }
      return true;
    }
  }])

  yield coFs.mkdir(distDir);
  const pageDir = pageName.toLowerCase();
  copyDir(templatesDir + answersTemplate.template, distDir + pageDir)
  dirReplace(distDir + pageDir, new RegExp(/pageName/g), pageName)
  console.log(chalk.green(`√ page:${distDir + pageDir} generated success`))

  console.log(chalk.cyan(`generating schema……`))
  const { tableSchema, modalSchema, searchSchema } = yield generateSchema()

  let tableSchemaContent = `
import React from 'react'
import { SmartSearchSchema } from '@/components/specific/smartsearch'\n
export const smartTableSchema = ${
    formatJSON2String(tableSchema)
    }
  `

  let modalSchemaContent = `
export const modalSchema = ${
    formatJSON2String(modalSchema)
    }
  `

  let searchSchemaContent = `
export const smartSearchSchema = ${
    formatJSON2String(searchSchema)
    }
    `


  yield coFs.unlink(distDir + pageDir + '/schema.tsx');
  yield coFs.writeFile(distDir + pageDir + '/schema.tsx', tableSchemaContent + '\n\n' + modalSchemaContent + '\n\n' + searchSchemaContent);
  console.log(chalk.green('√ ' + distDir + pageDir + '\\schema.tsx' + ' updated'))

})


function* generateSchema() {
  const modelPaths = walkSync(srcDir, { globs: ['**/*Model.js'] });
  const viewPaths = walkSync(srcDir, { globs: ['**/*View.js'] });
  const tableSchema = yield generateTableSchema(srcDir + viewPaths[0], srcDir + modelPaths[0])
  const modalSchema = yield generateModalSchema(srcDir + viewPaths[0], srcDir + modelPaths[0])
  const searchSchema = yield generateSearchSchema(srcDir + viewPaths[0], srcDir + modelPaths[0])
  return { tableSchema, modalSchema, searchSchema }
}






