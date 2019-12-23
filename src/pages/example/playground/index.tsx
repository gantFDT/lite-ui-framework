import React, { useRef } from 'react'
import { Button } from 'antd'
import { Card } from 'gantd'
import { connect } from 'dva'
import { addWidget } from '@/components/specific/dashboard/utils'
import { getUserField } from '@/utils/user';
import Link from 'umi/link';
import moment from 'moment';
import { getChartParams } from '@/components/specific/smartchart/utils'

const format = 'YYYY-MM-DD'

const gradeObj = {
  A: '一年级',
  B: '二年级',
  C: '三年级',
}

const classObj = {
  1: '一班',
  2: '二班',
  3: '三班',
}


const Demo = (props: any) => {
  const { dispatch } = props;

  return (<Card title="演练场"  >
    <div className='watermark' style={{ height: 400 }} >

    </div>

  </Card>)
}

export default connect(({
  settings
}: { settings: object }) => ({
  settings
}))(Demo)

