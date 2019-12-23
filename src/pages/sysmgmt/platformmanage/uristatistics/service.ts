import request from '@/utils/request'

// 统计
export async function findUriStatisticsApi(params: any, type: 'day' | 'days') {
  const { filterInfo } = params
  const { dateRange = [], size, ...res } = filterInfo
  const extraParams: any = {}
  if (dateRange) {
    [extraParams.fromDate, extraParams.toDate] = dateRange
  }
  let url = '/esDataStatistics/findDateRangeUriStatistics'
  if (type === 'day') {
    url = '/esDataStatistics/findDateTimeRangeUriStatistics'
  }
  return request(url, {
    method: 'POST',
    data: {
      filterInfo: {
        ...res,
        ...extraParams,
        size: `${size}`
      }
    }
  })
}
