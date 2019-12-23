import React, { useEffect } from 'react'
import { Card } from 'antd';
import styles from './index.less'
import { connect } from 'dva';
import event from '@/utils/events';


interface Props {
	loading: any;
	itemHeight: number;
}

const WIDGET_NAME = (props: Props) => {
	const {
		loading, itemHeight,
		save, fetch, update
	} = props;

	const load = () => {
		fetch()
	}

	useEffect(() => {
		event.on('WIDGET_NAMEInit', (params) => {
			load();
		})
		return () => (
			event.off('WIDGET_NAMEInit', (params) => {
				load();
			})
		)
	}, [])


	return (
		<Card
			bordered={false}
			className="full"
			loading={loading}
			bodyStyle={{ padding: '0px' }}
		>
			<div className="aligncenter" style={{ height: itemHeight }}>
				<div className={styles.WIDGET_NAME} />
			</div>
		</Card>
	)

}

export default connect(({ WIDGET_NAME, loading }: { WIDGET_NAME: object, loading: any }) => ({
	WIDGET_NAME,
	loading,
}), (dispatch: any) => {
	const mapProps = {};
	['fetch', 'update', 'save'].forEach(method => {
		mapProps[method] = (payload: object, callback: Function, final: Function) => {
			dispatch({
				type: `WIDGET_NAME/${method}`,
				payload,
				callback,
				final
			})
		}
	})
	return mapProps
})(WIDGET_NAME)
