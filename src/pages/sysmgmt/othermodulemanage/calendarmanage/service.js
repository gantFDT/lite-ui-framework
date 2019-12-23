import request from '@/utils/request'

export const findMarkDateApi = request.post.bind(null , '/workingCalendar/findMarkDate')

export const setMarkDateApi = request.post.bind(null , '/workingCalendar/setMarkDate')

export const unsetMarkDateApi = request.post.bind(null , '/workingCalendar/unsetMarkDate')

export const calculateDaysApi = request.post.bind(null , '/workingCalendar/calculateDays')
