Ext.define("gantang.custom.monitor.model.TestMonitorModel", {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [{
        name: 'id',
        type: 'number'
    }, {
        name: 'userLoginName',
        type: 'string'
    }, {
        name: 'userName',
        type: 'string'
    }, {
        name: 'content',
        type: 'string'
    }, {
        name: 'createDate',
        type: 'string'
    }]
});