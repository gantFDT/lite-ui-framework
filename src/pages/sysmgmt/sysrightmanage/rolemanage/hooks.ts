import { useState, useMemo } from "react"
import { useImmer } from 'use-immer'
import { Draft } from "immer";

const initialPageData = {
    total: 0,
    pageSize: 20,
    current: 1
}

export type PageInfotype = typeof initialPageData

export type QueryPagetype = PageInfotype & { beginIndex: number }

export type SetPageInfoType = (f: (draft: Draft<PageInfotype>) => void | PageInfotype) => void

export const usePageData: () => [PageInfotype, QueryPagetype, SetPageInfoType, () => void] = () => {
    const [pageInfo, setpageInfo] = useImmer(initialPageData)
    const queryPage = useMemo(() => ({ beginIndex: (pageInfo.current - 1) * pageInfo.pageSize, ...pageInfo }), [pageInfo])
    return [pageInfo, queryPage, setpageInfo, () => setpageInfo((draft: Draft<PageInfotype>) => initialPageData)]
}
