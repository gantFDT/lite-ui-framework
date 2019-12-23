interface Config {
  showSuccess?: boolean,
  successMessage?: string,
  showWraning?: boolean,
}

export enum MessageTypes {
  create = "create",
  remove = "remove",
  modify = "modify",
  operate = "operate",
  sort = "sort",
  save = 'save'
}

type requestmethod = (url: string, options: any, config?: Config) => Promise<any>

declare const request: {
  (url: string, options: any, config?: Config): Promise<any>,
  post: requestmethod,
  get: requestmethod,
  put: requestmethod,
  delete: requestmethod,
}

export const sucMessage: {
  createMes: string,
  removeMes: string,
  modifyMes: string,
  operateMes: string,
  sortMes: string,
  saveMes: string,
  deployMes: string
}
export const getSucMessage: (type: MessageTypes, custom: string) => string

export default request
