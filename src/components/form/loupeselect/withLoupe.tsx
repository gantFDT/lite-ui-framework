import React, { ComponentClass, ReactNode, useCallback } from 'react'
import { compose, mapProps } from 'recompose'
import { Icon } from 'antd';
import { Group } from 'gantd';
import classnames from 'classnames';
import styles from './styles.less';

interface WrapperComponentProps {
    addonAfter: ReactNode,
    loupeSelectStyle?: React.CSSProperties;
    onLoupeClick?: () => void,
    [propsname: string]: any
}

const withLoupe = () => compose(
    (WrapperComponent: ComponentClass) => (props: WrapperComponentProps) => {
        const { addonAfter, selectWrapStyle = {}, onLoupeClick, extra } = props;

        const handleLoupeClick = useCallback(() => {
            onLoupeClick && onLoupeClick()
        }, [])

        return <Group gant>
            <div className={styles.loupeSelectorWrap}>
                <div className={styles.loupeSelectorContent}>
                    <div
                        className={classnames(styles.selectWrap, addonAfter ? styles.editState : null)}
                        style={selectWrapStyle}
                    >
                        <WrapperComponent {...props} />
                        <Icon className={styles.searchIcon} type="search" onClick={handleLoupeClick} />
                    </div>
                    {extra && extra}
                </div>
            </div>
            {addonAfter ? <span className="ant-input-group-addon">{addonAfter}</span> : null}
        </Group >
    },
    mapProps(({
        addonAfter,
        loupeSelectStyle,
        onLoupeClick,
        extra,
        ...props
    }: WrapperComponentProps) => props)
)

export default withLoupe
