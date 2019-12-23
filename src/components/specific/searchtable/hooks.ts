import { useMemo, useState, useEffect, useCallback } from 'react'
import { get } from 'lodash'
import { PaginationConfig } from 'antd/lib/pagination'
import { TableRowSelection } from 'antd/lib/table'

// localStorage相关
export const useLocalStorage = (storageKey:string | undefined,defaultValue?:any) => {
  if(!storageKey) return []

  const [value, setValue] = useState<any>(defaultValue)

  useEffect(() => {
    const storageStr = localStorage.getItem(storageKey)
    if(storageStr)
      setValue(JSON.parse(storageStr))
  }, [storageKey])

  const setStorageValue = useCallback((data:any) => {
    localStorage.setItem(storageKey,JSON.stringify(data))
    setValue(data)
  },[storageKey])

  return [value,setStorageValue]
}

// 分页相关
const getPageFromIndex = (pageIndex: number, pageSize: number):number => {
  if(!pageIndex) return 1;
  return (pageIndex/pageSize) + 1;
}
interface usePaginationProps {
  pagination?: PaginationConfig | false;
  pageIndex?:number;
  pageSize?:number;
  onPageChange?:(pageIndex: number, pageSize?: number) => void;
  totalCount?:number;
  pageSizeOptions?:string[];
  tableKey?:string;
}
export const usePagination = (props:usePaginationProps):PaginationConfig | undefined | boolean => {
  const {
    pagination,
    pageIndex = 1,
    pageSize = 50,
    onPageChange,
    totalCount = 0,
    pageSizeOptions = ['50', '100', '150', '200'],
    tableKey
  } = props;
  const [ tableParams, setTableParams ] = useLocalStorage(tableKey,{});
  useEffect(() => {
    if(pagination!==undefined || !onPageChange) return;

    if(tableParams&&tableParams.pageSize&&tableParams.pageSize!==pageSize){
      onPageChange(pageIndex,tableParams.pageSize)
    }
  }, [tableParams,pageSize,pagination,onPageChange,pageIndex])
  const handlerPageChange = useCallback((page:number = 1,pageSize:number = 50):void => {
    console.log('pagination',pagination)
    if(pagination!==undefined || !onPageChange) return;

    let fakePageIndex = (page - 1) * pageSize;
    onPageChange(fakePageIndex,pageSize)
    setTableParams && setTableParams({...tableParams,pageSize})
  },[onPageChange,pagination])
  return useMemo(() => {
    if(pagination!==undefined) return pagination;
    if(!onPageChange) return undefined;
    return {
      total: totalCount,
      current: getPageFromIndex(pageIndex,pageSize),
      pageSize: pageSize,
      onChange: handlerPageChange,
      onShowSizeChange: handlerPageChange,
      pageSizeOptions
    }
  },[pagination,pageIndex,pageSize,onPageChange,totalCount,handlerPageChange])
}

const defaultSelectionWidth: number = 35;

const getFlatRecords = (list?:any[],childrenColumnName='children') => {
  if(!list) return [];
  return list.reduce(
    (records:any[], record:any) => {
      records.push(record)
      if (record[childrenColumnName] && record[childrenColumnName].length) {
        records.push.apply(records, getFlatRecords(record[childrenColumnName]))
      }
      return records
    },
    []
  )
}

interface useRowSelectionProps<T> {
  rowSelection?: TableRowSelection<T>;
  onUpdate?: (values: any, keys?: any, rows?: any) => void;
  onSelect?: (keys: any, rows: any) => void;
  onRemove?: (keys: any, rows: any, callback?:()=>void) => void;
  selectMode?: 'single' | 'multi';
  dataSource?: T[];
  rowKey: string | ((record: T, index: number) => string);
  childrenColumnName?: string;
}
export const useRowSelection = ({rowSelection,dataSource,rowKey,onSelect,onUpdate,onRemove,selectMode,childrenColumnName}:useRowSelectionProps<any>):any => {
  if(!onUpdate&&!onSelect&&!onRemove) return [
    [],
    [],
    undefined,
    rowSelection
  ]
  
  const getRecordKey = useCallback((record: any, index: number) => {
    const recordKey =
      typeof rowKey === 'function' ? rowKey(record, index) : (record as any)[rowKey!];
    return recordKey === undefined ? index : recordKey;
  },[rowKey])

  const flatRecords = useMemo(() => getFlatRecords(dataSource,childrenColumnName),[dataSource,childrenColumnName])
  
	// 用户传递的key
  const originSelectedKeys: string[] | number[] = useMemo(() => get(rowSelection, 'selectedRowKeys', []), [rowSelection])

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[] | string[]>(originSelectedKeys)

  const fakeRowSelection = useMemo(() => ({
    columnWidth: defaultSelectionWidth,
    clickable: true,
    type: selectMode === 'single' ? 'radio' : 'checkbox',
    selectedRowKeys,
    onChange: (keys: any) => {
      setSelectedRowKeys(keys)
    },
    ...rowSelection
  }), [selectedRowKeys, rowSelection])

	// 计算选中行
  const selectedRows = useMemo(() => flatRecords.filter((record:any, index:number) => selectedRowKeys.includes(getRecordKey(record, index))),[selectedRowKeys,flatRecords])
	useEffect(
		() => {
			if (rowSelection && rowSelection.onChange && typeof get(rowSelection, 'onChange') === 'function') {
				rowSelection.onChange(selectedRowKeys, selectedRows)
      }
      if(onSelect && typeof onSelect === 'function'){
        onSelect(selectedRowKeys, selectedRows)
      }
		},
		[selectedRowKeys]
  )
  
	return [
    selectedRowKeys,
    selectedRows,
    setSelectedRowKeys,
    fakeRowSelection
  ]
}