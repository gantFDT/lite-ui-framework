import React, { useState, useCallback, Dispatch } from 'react';
import { connect } from 'dva';
import { Card } from 'gantd';
import { SmartTable, SmartSearch } from '@/components/specific';
import { smartTableSchema, smartSearchSchema } from './schema';
import { Title } from '@/components/common';
import { getTableHeight, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT } from '@/utils/utils';

const pageKey = 'asynctasklist';

function AsyncTaskList(props: any) {
  const {
    MAIN_CONFIG,
    userId,
    route,
    asyncTaskListParams,
    asyncTaskList,
    asyncTaskListTotal,
    listAsyncTasksLoading,
    save,
    getListAsyncTask,
  } = props;

  const [searchFormHei, setSearchFormHei] = useState(0);

  //点击搜索
  const handleSearch = useCallback(({ filterInfo, pageInfo }, init) => {
    if (init && asyncTaskList.length) return;
    getListAsyncTask({ filterInfo: { ...filterInfo, filterModel: true }, pageInfo })
  }, [asyncTaskList, getListAsyncTask])

  //smart高度改变
  const onSearchFormSizeChange = useCallback(({ height, width }) => {
    setSearchFormHei(height)
  }, [setSearchFormHei])

  //点击切换分页
  const onPageChange = useCallback((beginIndex, pageSize) => {
    const newParams = { ...asyncTaskListParams, pageInfo: { beginIndex, pageSize } }
    save({ asyncTaskListParams: newParams })
  }, [asyncTaskListParams])

  const bodyHeight = getTableHeight(MAIN_CONFIG, searchFormHei + TABLE_HEADER_HEIGHT + CARD_BORDER_HEIGHT)

  return (
    <Card className="specialCardHeader" bodyStyle={{ padding: 0 }}>
      <SmartSearch
        searchPanelId={pageKey}
        userId={userId}
        title={<Title route={route} />}
        schema={smartSearchSchema}
        isCompatibilityMode
        headerProps={{ className: 'specialHeader' }}
        onSearch={handleSearch}
        onSizeChange={onSearchFormSizeChange}
        totalCount={asyncTaskListTotal}
        pageInfo={{
          pageSize: asyncTaskListParams.pageInfo.pageSize,
          beginIndex: asyncTaskListParams.pageInfo.beginIndex
        }}
      />
      <SmartTable
        tableKey={`${pageKey}:${userId}`}
        rowKey="id"
        schema={smartTableSchema}
        dataSource={asyncTaskList}
        bodyHeight={bodyHeight}
        loading={listAsyncTasksLoading}
        pageSize={asyncTaskListParams.pageInfo.pageSize}
        pageIndex={asyncTaskListParams.pageInfo.beginIndex}
        totalCount={asyncTaskListTotal}
        onPageChange={onPageChange}
        pageSizeOptions={['50', '100', '150', '200']}
      />
    </Card>
  )
}

export default connect(
  ({ user, settings, asyncTaskManage, loading }: any) => ({
    ...asyncTaskManage,
    userId: user.currentUser.id,
    MAIN_CONFIG: settings.MAIN_CONFIG,
    listAsyncTasksLoading: loading.effects['asyncTaskManage/getAsyncTaskList']
  }),
  (dispatch: Dispatch<any>) => ({
    getListAsyncTask: (payload: any) => dispatch({ type: 'asyncTaskManage/getAsyncTaskList', payload }),
    save: (payload: any) => dispatch({ type: 'asyncTaskManage/save', payload })
  })
)(AsyncTaskList);
