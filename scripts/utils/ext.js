
const coFs = require('co-fs');
const moment = require('moment')

const utils = {
  *generateTableSchema(viewFile, modelFile) {
    let tableSchema = []
    let modelContent = yield coFs.readFile(modelFile, 'utf8');
    let viewContent = yield coFs.readFile(viewFile, 'utf8');
    const fields = utils.fetchFields(modelContent)
    const columns = utils.fetchColumns(viewContent)
    columns.map((column) => {
      fields.map((field) => {
        if (field.name == column.dataIndex) {
          tableSchema.push({
            fieldName: column.dataIndex,
            title: column.text ||  '序号'
          })
          columns.type = field.type
        }
      })
    })
    return tableSchema
  },

  *generateModalSchema(viewFile, modelFile) {
    let modalSchema = {}
    let modelContent = yield coFs.readFile(modelFile, 'utf8');
    let viewContent = yield coFs.readFile(viewFile, 'utf8');
    const fields = utils.fetchFields(modelContent)
    const columns = utils.fetchColumns(viewContent)
    let required = []
    let propertyType = {}
    columns.map((column) => {
      required.push(column.dataIndex)
      fields.map((field) => {
        if (field.name == column.dataIndex) {
          propertyType[column.dataIndex] = {
            type: field.type,
            title: column.text ||  '序号',
            componentType: "input"
          }
        }
      })
    })
    modalSchema['type'] = 'object';
    modalSchema['required'] = required
    modalSchema['propertyType'] = propertyType
    return modalSchema
  },

  *generateSearchSchema(viewFile, modelFile) {
    let searchSchema = {}
    let viewContent = yield coFs.readFile(viewFile, 'utf8');
    const fields = utils.fetchSearchFields(viewContent)
    let searchFields = []
    fields.map((field) => {
      searchFields.push({
        fieldName: field.name,
        title: field.fieldLabel,
        suppOperator: ['LIKE'],
        type: 'string'
      })
    })
    searchSchema['supportFilterFields'] =searchFields;
    searchSchema['supportOrderFields'] = [{
      fieldName: fields[0].name,
      title: fields[0].title
    }]
    searchSchema['systemViews'] = []
    let searchFieldsView = []
    searchFields.map((field) => {
      searchFieldsView.push({
        fieldName: field.fieldName,
        operator: 'LIKE',
        title: field.title,
      })
    })
    searchSchema['systemViews'].push({
      viewId: 'systemView0001',
      name: "系统视图",
      version: moment().format(),
      panelConfig: {
        searchFields: searchFieldsView,
        orderFields: [{
          fieldName:searchFieldsView[0].fieldName,
          title: searchFieldsView[0].title,
          orderType: 'ASC'
        }]
      }
    })
    searchSchema['systemFilters'] = [{}]
    return searchSchema
  },

  fetchSearchFields(viewContent) {
    const regexp = new RegExp(/searchPanel\s?\:\s?(\{[\s\S]*)\}\]\r\n/)
    // console.log(viewContent.match(regexp))
    let temp = '{' + viewContent.match(regexp)[0] + '}}'

    temp = temp.replace(/(\w+)\:/g, '"$1":')
    temp = temp.replace(/'/g, '"')
    // console.log('temp',temp)
    let fields = JSON.parse(temp)['searchPanel']['items']
    return fields
  },

  fetchFields(modelContent) {
    const regexp = new RegExp(/fields\:([\s\S]*)\n\}\)\;/)
    let temp = modelContent.match(regexp)[1]
    temp = temp.replace(/name/g, '"name"');
    temp = temp.replace(/type/g, '"type"')
    temp = temp.replace(/'/g, '"')
    temp = `{"fields":${temp}}`
    let fields = JSON.parse(temp).fields
    return fields
  },

  fetchColumns(viewContent) {
    const regexp = new RegExp(/columns\s?\:\s?(\[\{[\s\S]*\])/)
    let temp = viewContent.match(regexp)[1]
    temp = temp.replace(/(\w+)\:/g, '"$1":')
    temp = temp.replace(/'/g, '"')
    temp = `{"columns":${temp}}`
    let columns = JSON.parse(temp).columns
    return columns
  }
}
module.exports = utils