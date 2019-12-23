import React, { useCallback, useEffect } from 'react';
import { Dashboard } from '@/components/specific'
import { connect } from 'dva'
import { router } from 'umi'

const Page = (props: any) => {
  const {
    match,
    dashboards,
  } = props;
  let { params: { id } } = match;

  const checkId = useCallback(() => {
    if (!_.find(dashboards, item => item.id === id)) {
      router.push('/dashboard/default')
    }
  }, [id,dashboards])

  useEffect(() => {
    checkId()
  }, [id]);

  return (
    <Dashboard
      id={id}
      type='user'
    />
  )
}
export default connect(({ menu }: { menu: object }) => ({
  dashboards: menu['dashboards']
}))(Page)


