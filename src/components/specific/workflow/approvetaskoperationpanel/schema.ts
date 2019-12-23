
const tableSchema = [
  {
    title: tr('任务名称'),
    dataIndex: 'stepName',
    width: 150
  },
  {
    title: tr('操作候选人'),
    dataIndex: 'displayUserName',
  },
  {
    title: tr('参与审批过程'),
    dataIndex: 'execute',
    width: 100,
    align: 'center'
  }
]

export default tableSchema
