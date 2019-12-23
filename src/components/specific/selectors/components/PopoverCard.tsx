import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Popover } from 'antd';
import { ProfileCard } from 'gantd';
import { getCodeNameSync, getCodeList } from '@/utils/codelist';

export interface PopoverCardProps {
    data: any,
    width?: string,
    fields?: Array<any>
    nameKey: string,
    placement: string,
    trigger: 'click' | 'hover',
    overlayClassName?: string,
    codeList: string,
    codeListKey: string,
    children?: any
}

const PopoverCard = (props: PopoverCardProps) => {
    const { data, width, fields, nameKey, placement, trigger, overlayClassName, codeList, codeListKey, children } = props;

    const [codeType, setCodeType] = useState([]);

    useEffect(() => {
        codeList && getCodeType()
    }, [])

    const getCodeType = useCallback(async () => {
        const res = await getCodeList(codeList);
        setCodeType(res);
    }, [])

    const _data = useMemo(() => {
        if (codeList) return { ...data, [codeListKey]: getCodeNameSync(codeType, data[codeListKey]) };
        return data;
    }, [data, codeList, codeListKey, codeType])

    return <Popover
        placement={placement}
        trigger={trigger}
        overlayClassName={overlayClassName}
        content={<div onClick={e => e.stopPropagation()} style={{ width }}>
            <ProfileCard
                data={_data}
                fields={fields}
                backgroundBlur={false}
                backgroundImage={false}
                showAvatar={false}
            />
        </div>}
    >
        {children || <a onClick={(e) => { e.stopPropagation() }}> {data[nameKey]}</a>}
    </Popover>
}
PopoverCard.defaultProps = {
    width: 240,
    fields: [],
    nameKey: 'orgName',
    placement: 'right',
    trigger: 'click',
    overlayClassName: '',
    codeList: '',
    codeListKey: ''
}
export default PopoverCard
