import request from '@/utils/request';

//获取所有消息列表（分页）
export async function getNotificationListApi(params) {
    return request('/notification/find', {
        method: 'POST',
        data: params
    });
}

//获取最新20条消息
export async function getLatest20newsApi() {
    return request('/notification/findTop20');
}


//获取未读消息总数
export async function getUnreadCountApi() {
    return request('/notification/getUnreadCount');
}

//设置已读状态
export async function setNoticesReadedApi(params, showMsg = false) {
    return request('/notification/markRead', {
        method: 'POST',
        data: params
    }, { showSuccess: showMsg, successMessage: tr('标记已读操作成功') });
}

// 创建公告通知
export async function createAnnouncementApi(params) {
    return request('/notification/createBulletin', {
        method: 'POST',
        data: params
    });
}
// 编辑公告通知
export async function editAnnouncementApi(params) {
    return request('/notification/modifyBulletin', {
        method: 'POST',
        data: params
    });
}

//删除已读消息
export async function removeNoticesApi(params) {
    return request('/notification/remove', {
        method: 'POST',
        data: params
    });
}

//发送普通实时消息
export async function sendNotificationApi(params) {
    return request('/testNotification/sendNotification', {
        method: 'POST',
        data: params
    });
}

//发送带link的实时消息
export async function sendLinkNotificationApi(params) {
    return request('/testNotification/sendLinkNotification', {
        method: 'POST',
        data: params
    });
}

//发送持续20s的消息通知
export async function send20SecondsNotificationApi() {
    return request('/testNotification/process20s', {
        method: 'POST',
        data: {}
    }, { showProcessStatus: true });
}