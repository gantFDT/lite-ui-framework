import React from 'react';
import { Radio } from 'antd'
import styles from './index.less';
function RadioGroup(props: any, ref: any) {
	const { dataSource, value, onChange } = props;
	return <Radio.Group value={value} onChange={onChange} ref={ref} className={styles.radio} buttonStyle="solid"   >
		{
			dataSource.map((item: any) => <Radio.Button key={item.value} value={item.value}>{item.label}</Radio.Button>)
		}
	</Radio.Group>
}
export default  React.forwardRef(RadioGroup)