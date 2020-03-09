import React, { useEffect, useCallback, useState, useRef, useMemo, useLayoutEffect } from 'react'
import { Spin, Pagination } from 'antd'
import { Header } from 'gantd'
import styles from './styles.less'

// 分页相关
const getPageFromIndex = (pageIndex: number | undefined, pageSize: number | undefined): number => {
  if (!pageIndex || !pageSize) return 1;
  return (pageIndex / pageSize) + 1;
}

interface CardListProps {
  itemRender: Function,
  dataSource: any[],
  rowKey: string,
  selectedType?: 'single' | 'multi',
  selectedRowKeys?: string[],
  onSelectChange?: Function,
  title?: string,
  headerProps?: any,
  headerLeft?: any,
  headerRight?: any,
  bodyHeight?: string | number,
  bodyStyle?: object,
  loading?: boolean,
  pageSize?: number,
  triggerDistance?: number,
  waterfallsFlow?: boolean,
  pageIndex?: number,
  onPageChange?: Function,
  onLoadMore?: Function,
  loadType?: 'click' | 'scroll' | 'default',
  totalCount?: number,
  pageSizeOptions?: string[],
  columnNumber?: number,
  columnGutter?: number,
}
function CardList(props: CardListProps) {
  const {
    title,
    bodyHeight = '100%',
    bodyStyle = {},
    rowKey = 'id',
    selectedType = 'multi',
    selectedRowKeys,
    onSelectChange,
    columnNumber = 1,
    columnGutter = 10,
    loading = false,
    waterfallsFlow = false,
    itemRender,
    dataSource,
    headerProps,
    headerLeft,
    headerRight,
    loadType = 'default',
    triggerDistance = 50,
    pageSize,
    pageIndex,
    onPageChange,
    onLoadMore,
    totalCount = 0,
    pageSizeOptions = ['50', '100', '150', '200'],
  } = props;

  const [fakeDataSource, setFakeDataSource] = useState<any[]>([]);
  const scrollEl = useRef();

  const loadDone = useMemo(() => pageIndex && pageSize && pageIndex + pageSize >= totalCount,[pageIndex, pageSize, totalCount]);

  const fakeBodyHeight = useMemo(() => {
    if (loadType !== 'click') return bodyHeight;
    if (!loadDone) return bodyHeight;
    if (typeof bodyHeight === 'number') {
      return bodyHeight + 32;
    } else if (bodyHeight.includes('calc')) {
      return bodyHeight.replace(')', ' + 32px)');
    } else {
      return `calc(${bodyHeight} + 32px)`;
    }
  },[bodyHeight, loadDone]);

  const handlerLoadMore = useCallback(() => {
    if(loadType !== 'default' && onLoadMore && pageIndex !== undefined && pageSize && !loadDone){
      onLoadMore(pageIndex + pageSize, pageSize);
    }
  },[onLoadMore, pageIndex, pageSize, loadDone])

  useLayoutEffect(() => {
    const dom: any = scrollEl.current;
    const srollFn = _.debounce((ev: any) => {
      if (loadType !== 'scroll') return false;
      const { srcElement } = ev;
      const { scrollHeight, scrollTop, clientHeight } = srcElement;
      if (scrollHeight - scrollTop - clientHeight <= triggerDistance) {
        handlerLoadMore()
      }
    }, 250)

    const loadFn = (mutationsList: any[]) => {
      if(!waterfallsFlow) return false;
      mutationsList.forEach(mutation => {
        if (mutation.type === 'childList') {
          const heights: number[] = [];
          mutation.target.childNodes.forEach((V: any, I: number) => {
            if (!V.style) return;
            if (I < columnNumber) {
              V.style.top = `${columnGutter / 2}px`;
              V.style.left = I ? `calc(${100 * I / columnNumber}% - ${columnGutter * I / columnNumber}px + ${columnGutter / 2}px)` : `${columnGutter / 2}px`;

              heights.push(V.clientHeight + columnGutter / 2);
            } else {
              const minHeight = Math.min(...heights);
              let minHeightIdx = heights.findIndex(V => V === minHeight);

              V.style.top = `${heights[minHeightIdx]}px`;
              V.style.left = minHeightIdx ? `calc(${100 * minHeightIdx / columnNumber}% - ${columnGutter * minHeightIdx / columnNumber}px + ${columnGutter / 2}px)` : `${columnGutter / 2}px`;

              heights[minHeightIdx]+=V.clientHeight;
            }
          })
        }
      });
    }

    const observer = new MutationObserver(loadFn);

    if (dom) {
      observer.observe(dom, { childList: true, subtree: true });
      dom.addEventListener('scroll', srollFn);
      return () => {
        observer.disconnect();
        dom.removeEventListener('scroll', srollFn);
      }
    }
  }, [scrollEl, handlerLoadMore])

  useEffect(() => {
    setFakeDataSource(dataSource.map(D => ({ ...D, selected: selectedRowKeys && selectedRowKeys.some(K => K === D[rowKey])}) ));
  }, [selectedRowKeys, dataSource]);

  const handlerRowClick = useCallback((rows, I) => {
    selectedType === 'single' && rows.forEach((V: any) => V.selected = false);
    rows[I].selected = !rows[I].selected;
    const selectedRows = rows.filter((V: any) => V.selected);
    const selectedKeys = selectedRows.map((V: any) => V[rowKey]);
    setFakeDataSource([...rows]);
    onSelectChange && onSelectChange(selectedKeys, selectedRows);
  }, [selectedType])

  const handlerPageChange = useCallback((page: number = 1, pageSize: number = 50): void => {
    if (!onPageChange) return;

    let fakePageIndex = (page - 1) * pageSize;
    onPageChange(fakePageIndex, pageSize);
  }, [onPageChange])

  return <div>
    {
      (title || headerLeft || headerRight) && <Header
        title={title}
        {...headerProps}
        beforeExtra={headerLeft}
        extra={[headerRight]}
      />
    }
    <Spin spinning={loading} delay={100}>
      <div
        className={styles.scrollBox}
        style={{
          padding: `${columnGutter / 2}px`,
          height: fakeBodyHeight,
          ...bodyStyle
        }}
        ref={scrollEl}
      >
        {
          fakeDataSource.map((V, I) => (
            <div
              onClick={() => handlerRowClick(fakeDataSource, I)}
              style={{
                position: waterfallsFlow ? 'absolute' : undefined,
                width: waterfallsFlow ? `calc(${100 / columnNumber}% - ${columnGutter / columnNumber}px)` : `${100 / columnNumber}%`,
                padding: columnGutter / 2
              }}
            >
              {itemRender(V, I)}
            </div>
          ))
        }
      </div>
    </Spin>
    {
      loadType === 'click' ? !loadDone && <footer
        onClick={handlerLoadMore}
        className={styles.footer}
        style={{justifyContent: 'center', cursor: 'pointer'}}
      >{tr('点击加载更多')}</footer> :
      onPageChange && <footer
        className={styles.footer}
        style={{flexDirection: 'row-reverse'}}
      >
        <Pagination
          showSizeChanger
          total={totalCount}
          onChange={handlerPageChange}
          onShowSizeChange={handlerPageChange}
          size="small"
          showTotal={(total, range) => `${tr('第')}${range[0]}-${range[1]}${tr('条，共')}${total}${tr('条')}`}
          pageSize={pageSize}
          current={getPageFromIndex(pageIndex, pageSize)}
          pageSizeOptions={pageSizeOptions}
        />
      </footer>
    }
  </div>
}

export default CardList;