Ext.define("gantang.custom.monitor.view.ModifyTestMonitorPanel", {
	extend: 'gantang.component.GantFormPanel',
	xtype: 'modifyTestMonitorPanel',
	uses: [],
	alais: 'widget.modifyTestMonitorPanel',
	border: false,
	frame: false,
	dataUrl: '[custom]/testMonitor/modify', // 保存数据的url地址
	showButtons: true, // 显示提交，重置按钮,false则不显示
	showSubmitButton: true, // true 为显示,false为不显示
	showResetButton: false, // true 为显示,false为不显示

	defaults: {
		anchor: '100%'
	},

	config: {
		model: 'gantang.custom.monitor.model.TestMonitorModel' // 必须配置
	},

	items: [{
		layout: 'form',
		defaults: {
			anchor: '90%',
			labelWidth: 100
		},
		items: [{
			xtype: 'textfield',
			fieldLabel: '日志编号',
			name: 'id',
			itemId: 'id',
			hidden: true
		}, {
			xtype: 'textfield',
			fieldLabel: '日志内容',
			name: 'content',
			itemId: 'content'
		}]
	}]
});