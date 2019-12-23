import request from '@/utils/request'
import { View } from './interface'

export interface BaseFileProps {
  recTypeId: number, // 关联业务类型id
  recId: number, // 关联业务对象id
  subRecTypeId: number, // 关联子业务类型id
  subRecId: number // 关联子业务对象id
}

interface GetViewProps {
  dataId: string
  dataType: 'CustomView' | 'CompanyView'
}
interface UpdateViewProps extends GetViewProps {
  views: View[]
}


/**
 * 获取视图列表(customView,companyView)
 * @param {object} params 
 */
export async function getViewsApi(params: GetViewProps): Promise<View[]> {
  let url = '/accountUserSelf/getUserData'
  if (params.dataType === 'CompanyView') {
    url = '/companyData/getCompanyData'
  }
  let res = await request(url, {
    method: 'POST',
    data: params
  })
  if(!res){
    return []
  }
  return res.bigData ? JSON.parse(res.bigData) : []
}

/**
 * 更新视图列表(customView,companyView)
 * @param ids 文件id列表 
 * @param showSuccess 是否显示成功提示
 */
export function updateViewsApi(params: UpdateViewProps) {
  const { dataType, dataId, views } = params
  let url = '/accountUserSelf/setUserData'
  if (params.dataType === 'CompanyView') {
    url = '/companyData/setCompanyData'
  }
  return request(url,
    {
      method: 'POST',
      data: {
        dataId,
        dataType,
        bigData: JSON.stringify(views)
      },
    },
    {
      showSuccess: true,
      successMessage: tr('操作成功')
    }
  )
}
