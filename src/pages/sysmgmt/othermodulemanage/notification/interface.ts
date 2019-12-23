import { Dispatch, AnyAction } from 'redux';
export interface FilterInfo {
    filterModel: boolean,
    title?: string,
    content?: string,
}
export interface QueryParamsProps {
    filterInfo: FilterInfo,
    pageInfo: PageInfo
}
export interface AnnouncementParams {
    content: string,
    id?: string,
    validPeriod: string,
}
export interface DispatchProps {
    save: (p: any) => void,
    getListData: (p: QueryParamsProps) => void,
    createAnnouncement: (p: AnnouncementParams, cb: Function) => void,
    editAnnouncement: (p: AnnouncementParams, cb: Function) => void,
    removeNotices: (p: { ids: Array<string> }, cb: Function) => void,
    markReaded: (p: { ids: Array<string> }, cb: Function) => void,
}
export interface UserListProps {
    content: string,
    id: string,
    linkName?: string,
    linUri?: string,
    recipientCode: string,
    recipientType: 'user' | 'obsvr' | 'all' | 'conn',
    senderName: string,
    senderTime: string,
    status: '00' | '01',
    title: string,
}
export { Dispatch, AnyAction }