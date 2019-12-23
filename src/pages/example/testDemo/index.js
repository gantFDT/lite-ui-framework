import React, { Component } from 'react'
import { connect } from 'dva'
import { Table, EditStatus, Input } from 'gantd'
import { BindAll } from 'lodash-decorators'
import { NameInput } from '../../sysmgmt/othermodulemanage/codelistmanage/components/ModalForm'
@connect(({ testDemo }) => ({ ...testDemo }))
@BindAll()
export default class Test extends Component {
	state = {
		data: [{
			name: `{"zh_CN":"中文","en":"en"}`, key: 1
		}]
	}
	onChange(value) {
		// const { dispatch } = this.props;
		// // const value = e.target.value;
		// dispatch({
		// 	type: 'testDemo/save', payload: {
		// 		data: [{ title: value, key: 1 }]
		// 	}
		// })
		this.setState({
			data: [{
				name: value, key: 1
			}]
		})
	}
	onChangeText(value) {
		const { dispatch } = this.props;
		// const value = e.target.value;
		dispatch({
			type: 'testDemo/save', payload: {
				text: value
			}
		})
	}
	onSelectChange(selectedRowKeys) {
		const { dispatch } = this.props;
		dispatch({
			type: 'testDemo/save', payload: {
				selectedRowKeys
			}
		})
	}
	testInput() {
		return <NameInput onChange={this.onChange} />
	}
	render() {
		const { text, data, selectedRowKeys } = this.props;
		const columns = [{
			dataIndex: "name",
			title: "input",
			editConfig: {
				render: this.testInput
			}
		}]
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
			type: 'radio',
			clickable: true,
			columnWidth: 40
		};
		// return <NameInput value={text} onChange={this.onChangeText} />
		return <>
			<div>
				{
					// <NameInput value={text} onChange={this.onChangeText} />
				}
				<Table
					rowSelection={rowSelection}
					columns={columns}
					dataSource={this.state.data}
					editable={EditStatus.EDIT}
				/>
			</div>
		</>

	}
}