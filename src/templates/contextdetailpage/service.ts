import request, { sucMessage } from '@/utils/request';
const { modifyMes } = sucMessage;

export function getDetailApi(params: object) {
    return request('/studentHibernate/queryById', {
        method: 'POST',
        data: params
    })
}

export function updateDetailApi(params: object) {
    return request('/studentHibernate/update', {
        method: 'POST',
        data: params
    }, { showSuccess: true, successMessage: modifyMes })
}

