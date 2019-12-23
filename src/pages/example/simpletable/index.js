import React from 'react'
import {Table} from 'gantd';
import {Button} from 'antd'
const columns = [
	{
		title: tr('姓名'),
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: tr('年龄'),
		dataIndex: 'age',
		key: 'age',
	},
	{
		title: tr('住址'),
		dataIndex: 'address',
		key: 'address',
	},
];


const DisabledResizeTable=(props)=> {
  const {title} = props
	let dataArray = new Array(10), dataSource = [];
	dataArray = dataArray.fill()
	dataArray.map((item, index) => {
		dataSource.push({
			name: "name" + index,
			age: index,
			address: "123",
			key: index
		})
	})
	return <Table
		columns={columns}
		title={title}
		headerRight={<Button size="small" className="gant-margin-5">right</Button>}
		dataSource={dataSource} resizeCell={false}
	/>
}

export default DisabledResizeTable