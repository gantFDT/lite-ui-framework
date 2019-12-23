import React, { useState, useEffect, useCallback } from 'react';
import { Select } from 'gantd';
import request from '@/utils/request';
export default function RelateGroupSelect(props: any) {
	const [dataSource, setDataSource] = useState([]);
	const queryList = useCallback(async () => {
		const data = await request.post('/aclGroup/findHierarchicalCategory', {
			data: {}
		});
		if (data && data.length > 0) setDataSource(data.map((item: any) => ({ label: item.categoryName, key: item.id, value: item.id })));
	}, [setDataSource])
	useEffect(() => {
		queryList()
	}, [])
	return <Select {...props} dataSource={dataSource} />
}