Ext.define('gantang.custom.monitor.view.TestMonitorView', {
    extend: 'gantang.component.GantSearchListEditPanel',
    uses: [],
    alias: "widget.testMonitorView",
    singleSelect: true, // 列表是否单选

    searchPanel: {
        xtype: 'panel',
        layout: {
            type: 'table',
            columns: 1
        },
        defaults: {
            labelWidth: 100,
            colspan: 1,
            xtype: 'textfield'
        },
        items: [{
            name: 'code',
            xtype: 'textfield',
            maxLength: 100,
            fieldLabel: '用户姓名'
        }]
    },

    bars: [],
    btns: [{
        xtype: 'button',
        // resourcePath: 'app.test.view.test.add',
        text: '添加日志',
        cls: 'edit-btn',
        iconCls: 'iconfont icon-xinzeng white-icon',
        itemId: 'OnAdd'
    }, {
        xtype: 'button',
        text: '编辑日志',
        cls: 'edit-btn',
        iconCls: 'iconfont icon-bianji white-icon',
        itemId: 'OnModify'
    }, {
        xtype: 'button',
        text: '删除日志',
        cls: 'edit-btn',
        iconCls: 'iconfont icon-shanchu white-icon',
        itemId: 'OnDelete'
    }],

    columns: [{
        dataIndex: 'id',
        header: '编号',
        hidden: true
    }, {
        dataIndex: 'userName',
        width: 100,
        sortable: false,
        text: "用户姓名"
    }, {
        dataIndex: 'content',
        width: 300,
        sortable: false,
        text: "日志内容"
    }, {
        dataIndex: 'createDate',
        width: 150,
        sortable: false,
        text: "创建时间"
    }],

    initComponent: function () {
        Ext.apply(this, {
            hasExport: false,
            store: Ext.create('gantang.custom.monitor.store.TestMonitorStore', {})
        });
        this.callParent(arguments);
    }
});