import request from '@/utils/request'

const sucMsg = tr('新建成功');
const editMsg = tr('编辑成功');
const delMsg = tr('删除成功');

export function getStudentsApi(params = {}) {
    return request('/studentHibernate/smartQuery', {
        method: 'POST',
        data: params
    })
}

export function createStudentApi(params = {}) {
    return request('/studentHibernate/create', {
        method: 'POST',
        data: params
    }, { showSuccess: true, successMessage: sucMsg })
}

export function updateStudentsApi(params = {}) {
    return request('/studentHibernate/update', {
        method: 'POST',
        data: params
    }, { showSuccess: true, successMessage: editMsg })
}

export function removeStudentsApi(params = {}) {
    return request('/studentHibernate/remove', {
        method: 'POST',
        data: params
    }, { showSuccess: true, successMessage: delMsg })
}

export function getStudentDetailApi(params = {}) {
    return request('/studentHibernate/queryById', {
        method: 'POST',
        data: params
    })
}

export function getStudentsCount(data) {
    return request('/studentHibernate/smartQueryCount', {
        method: 'POST',
        data
    })
}

export function getChartDataApi(data) {
    return request('/studentHibernate/smartChart', {
        method: 'POST',
        data
    })
}