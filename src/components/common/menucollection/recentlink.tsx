import React from 'react'
import { get } from 'lodash'
import { HistoryItem } from './interface'
import Link from './link'
import styles from './index.less'

interface RecentLinkProps {
    data: Array<HistoryItem>
}

const RecentLink = (props: RecentLinkProps) => {
    const { data } = props
    if (!get(data, 'length')) return null
    return (
        <div className={styles.history}>
            <h4 className={styles['history-title']} id='recent'>{tr('最近浏览')}</h4>
            <div className={styles['history-content']}>
                {
                    data.map(history => {
                        return (
                            <Link key={history.key} className={styles['history-item']} target={history.pathname} name={history.name} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default RecentLink;

