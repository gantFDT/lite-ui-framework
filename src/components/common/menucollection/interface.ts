export interface MenuItem {
    name: string,
    seqNum: number,
    path: string,
    id: string,
    children: Array<MenuItem>
}

export interface HistoryItem {
    pathname: string,
    key: string,
    name: string,
}