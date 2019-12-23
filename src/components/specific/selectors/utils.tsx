import React from 'react';
import Link from 'umi/link';
import { getUserField, getUserInfo } from '@/utils/user';

export const renderlinkEle = (id: string, name: string, linkTo: any) => {
    if (!linkTo) return name || id;
    if (typeof linkTo === 'object') {
        return <Link to='' {...linkTo}>{name}</Link>;
    } else {
        return <Link to={typeof linkTo === 'function' ? linkTo(id) : linkTo}>{name}</Link>;
    }
}

export const getUserLabels = (array: any[], isLoginName: boolean) => {
    return array.map(V => {
        return isLoginName ? getUserInfo('', V)['userName'] : getUserField({ id: V }) || V
    }).join('、')
}

export const getUserRecord = (value: string, isLoginName: boolean) => {
    return isLoginName ? getUserInfo('', value) : getUserInfo(value)
}