import request from '@/utils/request'

export const findMailTemplateAPI = request.post.bind(null , '/mailTemplate/findMailTemplate')

export const sendMailAPI = request.post.bind(null , '/mailTemplate/sendMail')

export const publishMailTemplateAPI = request.post.bind(null , '/mailTemplate/publishMailTemplate')

export const modifierMailTemplateAPI = request.post.bind(null , '/mailTemplate/modifierMailTemplate')

export const removeMailTemplateAPI = request.post.bind(null , '/mailTemplate/removeMailTemplate')


