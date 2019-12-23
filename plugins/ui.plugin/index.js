const path = require('path');
const getTemplates = require('./serve/templates');
const setpage = require('./serve/setpage')

module.exports = (api) => {
    api.addUIPlugin(path.resolve(__dirname, './ui.umd.js'))
    api.onUISocket(({ action: { type, payload }, ...args }) => {
        // 获取模板列表        
        if (type === 'gantui/getTemplates') {
            getTemplates(api, payload, args)
        }
        else if (type === 'gantui/routes') {
            args.success({
                data: api.getRoutes()
            })
        } else if (type === 'gantui/setPage') {
            setpage(api, payload, args)
        }
    })
}