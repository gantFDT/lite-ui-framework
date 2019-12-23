import request from '@/utils/request';

// 上下文菜单
export async function getContextMenuAPI(payload) {
    return request('/security/getContextMenu', {
        method: 'POST',
        data: { contextCategory: payload }
    })
}
