import cache from './cache';
import request from './request';

const { language } = cache

export const getLanguage: () => Promise<Array<any>> = () => {
    let list = language.get('list')
    if (!list) {
        list = request.post('/gantPlatform/getPlatformLanguages', {})
        language.set('list', list)
    }
    return list
}
