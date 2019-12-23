import { useState } from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Form, Col, Row, Button, Drawer } from 'antd'
import { BlockHeader } from 'gantd'
import { searchFileds } from './fileds'
import _ from 'lodash'
import styles from './style.less'
const colLayout = {
	span: 24,
	md: {
		span: 12
	}
}
const drawerColLayout = {
	span: 24
}
function SearchForm(props) {
	const { form: { getFieldDecorator, setFieldsValue }, title, values, mode } = props;
	const filedsKeys = Object.keys(searchFileds);
	const [visible, setVisible] = useState(false)
	const onReset = () => {
		const reset = {}
		filedsKeys.map(item => reset[item] = undefined);
		setFieldsValue(reset)
	}
	const isTile = mode === "tile";
	const _colLayout = isTile ? colLayout : drawerColLayout;
	const FormContent = <Form layout='horizontal' className={classnames(styles.searchForm, !isTile && styles.drawSearchForm)}  >
		<Row gutter={24} >
			{
				filedsKeys.map(key => <Col key={key} {..._colLayout}   >
					<Form.Item label={searchFileds[key].title}    >
						{
							getFieldDecorator(key, {
								initialValue: values[key]
							})(searchFileds[key].Component)
						}
					</Form.Item>
				</Col>)
			}
		</Row>
	</Form>
	return <div className={styles.searchContainer} >
		<div className={styles.searchTool} >
			<div className={styles.searchTips} >
				<BlockHeader title={title} />
			</div>
			<div className={styles.searchRest} >
				{isTile ? <Button size="small" size='small' type='primary' onClick={onReset}  >{tr('重置')}</Button> : <Button size="small" size='small' type='primary' onClick={() => setVisible(true)}  >{tr('筛选')}</Button>}
			</div>
		</div>
		{
			isTile ? FormContent : <Drawer
				visible={visible}
				title={title}
				width={400}
				className={styles.draw}
				bodyStyle={{ padding: "0px 24px" }}
				onClose={() => setVisible(false)}
			>
				{FormContent}
				<div style={{ textAlign: 'right', marginTop: 5 }} >
					<Button size="small" type='primary' onClick={onReset} >{tr('重置')}</Button>
				</div>
			</Drawer>
		}
	</div>
}
SearchForm.defaultProps = {
	title: tr("过滤条件"),
	onChange: () => { },
	params: {},
	mode: "tile"
}
SearchForm.propTypes = {
	title: PropTypes.string.isRequired,
	onChange: PropTypes.func,
	params: PropTypes.object,
	mode: PropTypes.oneOf(['tile', 'drawer'])
}
export default Form.create({
	onValuesChange: (props, changedValues, allValues) => {
		Object.keys(searchFileds).map(key => {
			if (searchFileds[key].type == 'date' && changedValues[key]) {
				changedValues[key] = changedValues[key] ? changedValues[key].format(searchFileds[key].format) : changedValues[key]
			}
		})
		props.onChange(changedValues, allValues)
	}
})(SearchForm)