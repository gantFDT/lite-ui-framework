import React, { useState } from 'react'
import { Card, Carousel, Empty } from 'antd';
import styles from './index.less'
import { connect } from 'dva';
import {ConfigBar, registerModel } from '@/widgets/utils'
import classnames from 'classnames'
import SnapShot from './snapshot.png'
const modelRegisterKey = 'carouselModelInit'


interface Props {
	loading: any;
	itemHeight: number;
	carouselWidget: any;
	widgetKey: string;
	[propname: string]: any;
}

const CarouselWidget = (props: Props) => {
	const { loading, carouselWidget = {}, dispatch, itemHeight, editMode, widgetKey, handleDeleteWidget, } = props;
	const {
		list = [],
		autoPlay,
		interval,
		actionPosition,
		effect
	} = carouselWidget;
	const load = () => {
		dispatch({
			type: 'carouselWidget/fetchData',
			payload: {
				widgetKey: widgetKey
			}
		})
	}
	//注册model
	registerModel(modelRegisterKey, load)

	return (
		<Card
			bordered={false}
			className={classnames('full', styles.Carousel)}
			loading={loading}
			bodyStyle={{ padding: '0px' }}
		>
			{!_.isEmpty(list) ? <Carousel
				autoplay={autoPlay === 'true' ? true : false}
				style={{ height: itemHeight }}
				dotPosition={actionPosition}
				effect={effect}
			>
				{list.map((item: object, index: number) =>
					<div className={styles.banner} key={index} >
						<a href={item['url'] ? item['url'] : "javascript:void(0);"} target={item['url'] && item['urlTarget']} style={{ cursor: item['url'] ? 'pointer' : 'default' }}>
							<div
								style={{
									height: itemHeight,
									backgroundImage: `url(${item['img']})`,
								}}
								className={styles.banner}
							>
								<span className={styles.span} style={{
									top: item['layoutV'] == 't' ? 0 : 'unset',
									left: item['layoutH'] == 'l' ? 0 : 'unset',
									bottom: item['layoutV'] == 'b' ? 0 : 'unset',
									right: item['layoutH'] == 'r' ? 0 : 'unset',
									color: item['colorMode'] == 'black' ? '#000' : '#fff'
								}}>
									<p className={styles.title}
										style={{
											textAlign: item['layoutH'] == 'l' ? 'left' : 'right'
										}}>{item['title']}</p>
									<p className={styles.content}
										style={{
											textAlign: item['layoutH'] == 'l' ? 'left' : 'right'
										}}>{item['content']}</p>
								</span>

							</div>
						</a>
					</div>
				)}


			</Carousel>
				:
				<div className="emptyContent" style={{ height: itemHeight }}>
					<Empty
						description={
							<span>
								{tr('还没有配置')},{tr('请进行配置')}
							</span>
						}
					>
					</Empty>
				</div>
			}
			<ConfigBar widgetKey={widgetKey} editMode={editMode} handleDeleteWidget={handleDeleteWidget} />
		</Card>
	)

}


export default connect(({ carouselWidget, loading }: { carouselWidget: any, loading: any }) => ({
	carouselWidget,
	loading: loading.effects['carouselWidget/fetchData'],
}))(CarouselWidget)

export { SnapShot, modelRegisterKey }
