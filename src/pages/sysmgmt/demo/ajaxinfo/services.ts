import request from '@/utils/request';

export const success = request.post.bind(null, '/errorDemo/webReturnDemo', null, { showSuccess: true, successMessage: tr('ajax成功提示') });
export const warn = request.post.bind(null, '/errorDemo/webWarnDemo', null, { showWraning: true });
export const error = request.post.bind(null, '/errorDemo/webErrorDemo', null);
export const syserror = request.post.bind(null, '/errorDemo/sysErrorDemo', null);
export const bizerror = request.post.bind(null, '/errorDemo/bizErrorDemo', null);
export const weberror = request.post.bind(null, '/errorDemo/webErrorDemo', { data: { pageInfo: { beginIndex: 0, pageSize: 50 } } });
