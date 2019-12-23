import request from '@/utils/request'

export const findUnregisteredEndpointAPI = request.post.bind(null, '/integration/findUnregisteredEndpoint')
export const findNotSetHandleAPI = request.post.bind(null, '/integration/findNotSetHandle')
export const findByTypeAPI = request.post.bind(null, '/codeList/findByType')


