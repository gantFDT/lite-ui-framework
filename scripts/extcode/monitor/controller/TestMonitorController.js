Ext.define('gantang.custom.monitor.controller.TestMonitorController', {
	extend : 'Ext.app.Controller',
	views : [ 'gantang.custom.monitor.view.TestMonitorView' ],
	models : [ 'gantang.custom.monitor.model.TestMonitorModel' ],
	uses : [ 'gantang.custom.monitor.view.AddTestMonitorPanel', 'gantang.custom.monitor.view.ModifyTestMonitorPanel' ],

	init : function(application) {
		var me = this;
		this.control({
			'testMonitorView' : {
				itemdblclick : function(view, record, item, index, e, eOpts) {
				},
				afterrender : function(grid) {
					me.grid = grid;
				}
			},
			"testMonitorView button#OnAdd" : {
				click : this.clickAdd
			},
			"testMonitorView button#OnModify" : {
				click : this.clickModify
			},
			"testMonitorView button#OnDelete" : {
				click : this.clickDelete
			}
		});
	},

	clickAdd : function(obj) {
		var grid = obj.up('gantgridpanel');
		var addPanel = Ext.create('gantang.custom.monitor.view.AddTestMonitorPanel', {
			ownerStore : grid.store
		});

		var win = Ext.create("gantang.component.GantWindow", {
			title : '添加日志',
			width : 500,
			height : 180,
			resizable : false,
			maximizable : false,
			items : [ {
				layout : 'fit',
				items : [ addPanel ]
			} ]
		}).show();
	},

	clickModify : function(obj) {
		var grid = obj.up('gantgridpanel');
		var row = grid.getSelectionModel().getSelection();
		if (row.length == 1) {
			var _record = row[0].raw;

			var win = Ext.create("gantang.component.GantWindow", {
				title : '编辑日志',
				width : 500,
				height : 180,
				resizable : false,
				maximizable : false,
				items : [ {
					layout : 'fit',
					items : [ {
						xtype : 'modifyTestMonitorPanel',
						record : _record,
						ownerStore : grid.store
					} ]
				} ]
			}).show();
		} else {
			Ext.Msg.alert("提示", "请选择日志记录");
		}
	},

	clickDelete : function(obj) {
		var grid = obj.up('gantgridpanel');
		var row = grid.getSelectionModel().getSelection();
		if (row.length == 1) {
			var _record = row[0].raw;

			Ext.MessageBox.confirm('请确认', '是否删除选择的日志记录?', function(opt) {
				if (opt == 'yes') {
					gantang.Ajax.request({
						async : false,
						url : "[custom]/testMonitor/remove",
						jsonData : {
							id : _record.id
						},
						onSuccess : function(responseObj, data) {
							grid.store.load();
							gantang.Msg.showNotification('Success!', "日志记录删除成功");
						},
						onFailure : function(response) {
						}
					});
				}
			});
		} else {
			Ext.Msg.alert("提示", "请选择日志记录");
		}
	},

	mainView : 'gantang.custom.monitor.view.TestMonitorView',

	viewConfig : {
		width : '95%',
		height : '90%'
	}
});