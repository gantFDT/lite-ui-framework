export const gStatus = (status: string, data: any) => {
  // state, message, warnDescription, errorDescription
  let result = {}
  switch (status) {
    case 'success':
      result = {
        state: 'success',
      }
      break;
    case 'error':
      result = {
        state: 'error',
        message: '错误'
      }
      break;
    case 'warn':
      result = {
        state: 'warn',
        message: '警告'
      }
      break;
    case 'sys-error':
      result = {
        state: 'sys-error',
        message: '系统错误'
      }
      break;
    default:
      break;
  }
  result['data'] = data
  return result
}