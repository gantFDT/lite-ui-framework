import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import _ from 'lodash'
import { connect } from 'dva'
import { Icon, Steps, Tooltip, Button } from 'antd'
import { EditStatus, BlockHeader } from 'gantd'
import { Anchor } from '@/components/common'
import { SmartTable } from '@/components/specific'
import FormSchema from '@/components/form/schema'
import { formSchema, tableSchema, anchorList } from './schema'
import styles from './styles.less';
import { isEmpty } from 'lodash'
const { Step } = Steps;

const ids = Object.keys(formSchema.propertyType);

const tableKeys = _.map(tableSchema, 'fieldName');
const tableData = _.map(new Array(12), (item, key) => {
  let result = { id: key, week: key + 1 };
  tableKeys.map((item) => {
    if (item == 'week') return;
    result[item] = Math.floor(Math.random() * 41) + 60
  })
  return result;
})
const uiSchema = {
  'ui:backgroundColor': '#fff',
  "ui:col": {
    span: 24,
    sm: 12,
    xl: 8,
    xxl: 6,
  },
  "ui:labelCol": {
    // span: 24,
    // sm: 6
  },
  "ui:wrapperCol": {
    // span: 24,
    // sm: 18
  }
};

function BaseInfo(props) {
  const {
    studentDetail,
    userId,
    dispatch,
    update,
    fixedHeader
  } = props;
  const formRef = useRef(null)
  const detailRef = useRef(null)

  useEffect(() => {
    detailRef.current = studentDetail
  }, [studentDetail]);

  // const [edit, setEdit] = useState({
  //   base: EditStatus.CANCEL,
  //   contact: EditStatus.CANCEL,
  //   school: EditStatus.CANCEL,
  //   teacher: EditStatus.CANCEL,
  // });

  // const setItemEdit = (id, itemEdit) => {
  //   setEdit(oldEdit => ({
  //     ...oldEdit,
  //     [id]: itemEdit
  //   }))
  // }
  
  const onSave = useCallback((values, cb) => {
    update({
      ...values,
      id: detailRef.current.id
    }, cb)
  }, [])

  function onItemSave(id, value, cb) {
    let itemObj = {};
    itemObj[id.split('.')[1]] = value;
    onSave(itemObj, cb)
  }

  async function onSaveForm(id) {
    const { errors, values } = await formRef.current.validateForm([id])
    if (errors) return
    // onSave(values, setItemEdit(id, EditStatus.SAVE))
    onSave(values[id])
  }

  const titleConfig = useMemo(() => {
    let titleConfig = {
      "title:type": "num",
    }
    ids.map((itemId, itemIndex) => {
      // const itemEdit = edit[itemId]
      titleConfig[itemId] = {
        "title:id": itemId,
        "title:num": itemIndex + 1,
        "title:extra": <div>
          {/* <Tooltip title={itemEdit == EditStatus.EDIT ? tr("取消编辑") : tr("编辑")}>
            <Button size="small" className="marginh5" style={{ padding: '0 8px' }} onClick={() => setItemEdit(itemId, itemEdit == EditStatus.EDIT ? EditStatus.CANCEL : EditStatus.EDIT)}>
              <Icon type={itemEdit != EditStatus.EDIT ? "edit" : "minus-circle"} />
            </Button>
          </Tooltip> */}
          <Tooltip title={tr("保存")}>
            <Button size="small" icon="save"
              // disabled={itemEdit != EditStatus.EDIT}
              className="marginh5"
              onClick={() => onSaveForm(itemId)}
            />
          </Tooltip>
        </div>
      }
    })
    return titleConfig
    // }, [edit])
  }, [])
  const data = useMemo(() => {
    if (_.isEmpty(studentDetail)) return;
    let valueData = {};
    ids.map((itemId) => {
      valueData[itemId] = {};
      Object.keys(formSchema.propertyType[itemId].propertyType).map(itemName => {
        valueData[itemId][itemName] = studentDetail[itemName]
      })
    })
    return valueData;
  }, [studentDetail])
  const currentAnchorList = useMemo(() => {
    if(!data||!anchorList.length) return;
		let anchorIds = []; //值为空和不需判断的id
    let anchorNeedIds = [];
		anchorList.map((item) => {
			if (item.type == 'form') {
				Object.keys(data[item.id]).map(itemName => {
					if(item.required&&item.required.length){
						const commonId = item.required.find((val) => val == itemName)
						if (commonId && !data[item.id][itemName]) { anchorIds.push(item.id); }
					}else{
						anchorIds.push(item.id);
					}
				})
				let newAnchorIds = _.uniq(anchorIds) //值为空和不需判断的id去重后数组
					anchorNeedIds = _.difference(ids, newAnchorIds) //筛选出已完成的模块id
				item.complete = anchorNeedIds.find((val) => val == item.id) ? true : false
			} else if (item.type == 'table') {
				item.complete = item.required&&eval(item.dataSourceName).length?true:false
			}
		})
		return anchorList;
	}, [data, tableData, anchorList])
  return <div className={styles.baseWrapper}>
    <Anchor
      anchorKey='demoUserManageDetailBase'
      userId={userId}
      headerHeight={40}
      fixedHeader={fixedHeader}
      anchorList={currentAnchorList}
      onClick={(e)=>{e.preventDefault()}}
      cardContent={
        <>
          <div className={styles.stepsWrap}>
            <Steps className={styles.stepsContent} current={2} size='small' labelPlacement='vertical'>
              <Step title={tr('注册')} />
              <Step title={tr('收到账号密码邮件')} description={`(${tr('可登录')})`} />
              <Step title={tr('完善资料')} />
              <Step title={tr('审核')} />
              <Step title={tr('潜在供应商')} />
              <Step title={tr('注册成功')} description={`(${tr('可报价')})`} />
              <Step title={tr('中标')} />
              <Step title={tr('完善资料')} />
              <Step title={tr('审核')} />
              <Step title={tr('正式供应商')} description={`(${tr('可签订合同')})`} />
              <Step title={tr('完成')} />
            </Steps>
          </div>
          <FormSchema
            wrappedComponentRef={formRef}
            // edit={edit}
            data={data}
            schema={formSchema}
            uiSchema={uiSchema}
            titleConfig={titleConfig}
            onSave={onItemSave}
          />
          <div style={{ padding: '10px 15px 10px' }}>
            <BlockHeader
              id='statisticalScores'
              title={tr('成绩统计')}
              type='num'
              num={ids.length + 1}
            />
            <SmartTable
              tableKey={`demoUserManageDetailBase:${userId}`}
              rowKey="id"
              schema={tableSchema}
              dataSource={tableData}
              bodyHeight={'600'}
            />
          </div>
        </>
      }
    />
  </div>
}
const mapDispatchToProps = dispatch => {
  const mapProps = { dispatch };
  ['update'].forEach(method => {
    mapProps[method] = (payload, cb, final) => {
      dispatch({
        type: `demoUserManageDetail/${method}`,
        payload,
        cb,
        final
      })
    }
  })
  return mapProps
}

export default connect(
  ({ demoUserManageDetail, user, settings }) => ({
    userId: user.currentUser.id,
    fixedHeader: settings.MAIN_CONFIG.fixedHeader,
    ...demoUserManageDetail,
  }), mapDispatchToProps)(BaseInfo)