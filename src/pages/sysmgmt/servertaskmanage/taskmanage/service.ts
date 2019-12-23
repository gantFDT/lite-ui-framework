import request, { sucMessage } from '@/utils/request';
const { createMes, modifyMes, removeMes } = sucMessage;

// 获取列表
export async function getTaskListAPI(params: object) {
    return request('/task/find', {
        method: 'POST',
        data: params
    });
}
// 新增
export async function createTaskAPI(params: object) {
    return request('/task/create', {
        method: 'POST',
        data: params
    }, { showSuccess: true, successMessage: createMes });
}

// 删除
export async function removeTaskAPI(params: object) {
    return request('/task/remove', {
        method: 'POST',
        data: params
    }, { showSuccess: true, successMessage: removeMes });
}

// 测试
export async function testTaskAPI(params: object) {
    return request('/task/testTimingTask', {
        method: 'POST',
        data: params
    }, { showSuccess: true, successMessage: tr('异步测试定时任务请求已提交') });
}

// 查看日志
export async function readLogTaskAPI(params: object) {
    return request('/task/findTimingTaskLog', {
        method: 'POST',
        data: params
    });
}

// 编辑
export async function updateTaskAPI(params: object) {
    return request('/task/update', {
        method: 'POST',
        data: params
    }, { showSuccess: true, successMessage: modifyMes });
}

//获取定时任务执行服务
export const findTimingTaskAPI = request.post.bind(null, '/task/findTimingTaskHandles')

