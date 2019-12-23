import React, { useCallback, useMemo } from 'react';
import { GantAnchor } from 'gantd';
import { useLocalStorage } from '@/utils/hooks';
import _ from 'lodash'

export interface anchorListProps {
    id: string,
    title: string,
    required?: boolean | string[],
    complete?: boolean,
    type?: string
}
export interface AnchorProps {
    userId: string | number,
    anchorKey?: string,
    anchorList?: anchorListProps[],
    initalValue?: object,
    [propsname: string]: any
}

const inital = { anchorMode: 'vertical' }

function Anchor(props: AnchorProps) {
    const {
        userId,
        anchorKey,
        initalValue = inital,
        anchorList = [],
        ...nextProps
    } = props;

    const [localData, setLocalStorage] = useLocalStorage(`anchor:${userId}`, initalValue, anchorKey);

    const onSwitchChange = useCallback((anchorMode) => {
        userId && anchorKey && setLocalStorage({ anchorMode })
    }, [])

    return <GantAnchor
        anchorMode={localData.anchorMode}
        onSwitchChange={onSwitchChange}
        anchorList={anchorList}
        {...nextProps}
    />
}
export default Anchor;