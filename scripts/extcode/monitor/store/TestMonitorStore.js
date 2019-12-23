Ext.define("gantang.custom.monitor.store.TestMonitorStore", {
    extend: 'Ext.data.Store',
    constructor: function (cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'gantang.custom.monitor.model.TestMonitorModel',
            autoLoad: true,
            remoteFilter: true,
            remoteSort: true,
            pageSize: 50,
            proxy: Ext.create("gantang.proxy.AjaxProxy", {
                url: '[custom]/testMonitor/find',
                reader: {
                    type: 'json',
                    root: 'data.content',
                    totalProperty: 'data.totalCount'
                }
            })
        }, cfg)]);
    }
});