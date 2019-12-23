import React, { useState, useCallback, useMemo } from 'react'
import { Title } from '@/components/common'
import { Row, Col, Input, Empty, Radio } from 'antd'
import { Icon as Gicon, Card } from 'gantd'
import { connect } from 'dva'
import _ from 'lodash'
import classnames from 'classnames'
import { getContentHeight, CARD_BORDER_HEIGHT } from '@/utils/utils'
import styles from './index.less'

const outline = Gicon.getOutLine()
const iconIds = _.map((document.querySelector('svg') as any).querySelectorAll('symbol'), symbol => symbol.id)
const icons = {
  iconFont: iconIds,
  antIcon: outline
}
const iconTypes = ['iconFont', 'antIcon']
/**
 * 平台管理-图标管理页面
 */
export default connect(({ settings, loading }: any) => ({
  MAIN_CONFIG: settings.MAIN_CONFIG
}))((props: any) => {
  const { MAIN_CONFIG, route } = props
  const height = getContentHeight(MAIN_CONFIG, 40 + CARD_BORDER_HEIGHT + 53)
  const [keyword, setKeyword] = useState('')
  const [isSimpleInputFocus, setIsSimpleInputFocus] = useState(false)
  const [iconType, seticonType] = useState(iconTypes[0])
  const showIconIds = useMemo(() => {
    let tempKeyword = keyword.toLowerCase()
    return icons[iconType].filter((id: string) => {
      let tempId = id.toLowerCase()
      return tempKeyword ? tempKeyword.includes(tempId) || tempId.includes(tempKeyword) : true
    })
  }, [keyword, iconType])

  const setKeywordDebounce = useCallback(_.debounce((value: string) => {
    setKeyword(value)
  }, 300), [])

  const onKeywordChange = useCallback((e) => {
    setKeywordDebounce(e.target.value)
  }, [])

  const simpleSearchInputFocusStatusChange = useCallback((res: boolean) => {
    setIsSimpleInputFocus(res)
  }, [])

  // 切换图标
  const handleTypeChange = useCallback(
    (e) => {
      seticonType(e.target.value)
    },
    [],
  )

  return (
    <Card
      title={<Title route={route} />}
      className='specialCardHeader'
      bodyStyle={{ padding: 0 }}
    >
      <div className={styles['input-wrapper']}>
        <Radio.Group value={iconType} onChange={handleTypeChange}>
          {
            iconTypes.map(type => <Radio.Button key={type} value={type}>{type}</Radio.Button>)
          }
        </Radio.Group>
        <Input.Search
          placeholder={tr('通过图标的id搜索')}
          onChange={onKeywordChange}
          style={{ width: '50%', marginLeft: 20 }}
          className={classnames([styles['simple-search-input']], {
            [styles['simple-search-input-focus']]: isSimpleInputFocus
          })}
          onFocus={simpleSearchInputFocusStatusChange.bind(null, true)}
          onBlur={simpleSearchInputFocusStatusChange.bind(null, false)}
        />
      </div>
      <div className={classnames(styles.container, { 'aligncenter': showIconIds.length === 0 })} style={{ height }}>
        {
          showIconIds.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={tr('没有匹配图标')} /> : (
            <Row gutter={3}>
              {showIconIds.map(id => {
                return (
                  <Col span={6} key={id}>
                    <div className={styles.iconWrapper}>
                      <Gicon type={id} className={styles.icon} />
                      <span className={styles.id}>{id}</span>
                    </div>
                  </Col>
                )
              })}
            </Row>
          )
        }
      </div>
    </Card>
  )
})
