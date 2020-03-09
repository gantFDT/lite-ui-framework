import React, { useState, useEffect } from 'react';
import { Avatar, Row, Col, Form, Icon, Tooltip,Button } from 'antd';
import { connect } from 'dva'
import router from 'umi/router'
import classnames from 'classnames'
import { ProfileCard, Header, Card } from 'gantd'
import Link from 'umi/link'
import { getContentHeight } from '@/utils/utils'
import { ContactButtonGroup } from '@/components/common'
import styles from './index.less'


const Page = (props) => {
  const { match: { params: { id } }, route, employeeId, dispatch, MAIN_CONFIG, employee = {}, organizationInfo, currentUser } = props
  const minHeight = getContentHeight(MAIN_CONFIG, 40 + 3);
  useEffect(() => {
    if (!id) {
      router.replace("/")
    } else {
      dispatch({
        type: 'userpagemodel/getEmployee',
        payload: {
          employeeId: id
        }
      })
    }
  }, [])

  const fields = !_.isEmpty(employee) ? [
    {
      label: tr('姓名'),
      key: 'userName',
      options: {
        initialValue: employee.userName,
      }
    }, {
      label: tr('性别'),
      key: 'gender',
      options: {
        initialValue: employee.genderName,
      }
    }, {
      label: tr('用户类型'),
      key: 'userType',
      options: {
        initialValue: employee.userTypeName,
      }
    }, {
      label: tr('所属组织'),
      key: 'groupCount',
      options: {
        initialValue: employee.orgInfo.fullOrgName,
      }
    }, {
      label: tr('工号'),
      key: 'staffNumber',
      options: {
        initialValue: employee.staffNumber,
      }
    }, {
      label: tr('移动电话'),
      key: 'mobil',
      options: {
        initialValue: employee.mobil,
      }
    }, {
      label: tr('固定电话'),
      key: 'telephone',
      options: {
        initialValue: employee.telephone,
      }
    }, {
      label: tr('传真'),
      key: 'fax',
      options: {
        initialValue: employee.fax,
      }
    }, {
      label: tr('邮箱'),
      key: 'email',
      options: {
        initialValue: employee.email,
      }
    }, {
      label: tr('职务说明'),
      key: 'position',
      options: {
        initialValue: employee.position,
      }
    }
  ] : []
  return (<Card bodyStyle={{ padding: 0, height: minHeight }}>
    <Header
      style={{ borderBottom: '1px solid rgb(0,0,0,0.1)', height: 'auto', marginBottom: '0px' }}
      title={
        <><Icon type="user" /> {tr('用户详情')}</>
      }
      type="none"
      beforeExtra={
        // <Icon
        //   type="left"
        //   style={{
        //     color: '#000', fontSize: '16px', cursor: 'pointer', lineHeight: '36px', margin: '0 5px',
        //   }}
        //   onClick={() => window.history.back()}
        // />
        <Button
          size="small"
          icon='left'
          clsssName='marginh5'
          onClick={() => window.history.back()}
        />
      }
    />
    <Col
      span={8}
      style={{
        justifyContent: 'center',
        paddingTop: '100px',
        display: 'flex',
        borderRight: '1px solid rgb(0,0,0,0.1)',
        height: '100%',
        // background:`url(${background})`,
        backgroundSize: 'cover'
      }}
    >
      <Row style={{ height: '100%', width: '100%' }}>
        {!_.isEmpty(employee) && <Col
          span={24}
          style={{
            height: 'calc(100% - 50px)',
            textAlign: 'center'
          }}
        >
          <Avatar size={120} src={employee.avatarUrl} style={{ border: '5px solid rgba(0,0,0,0.05)', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }} />
          <div style={{
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            marginTop: '20px',
          }}
          >
            {employee.userName}
            {employee.gender == 'MALE' && <Icon style={{ color: '#1890FF', marginLeft: '5px' }} type="man" />}
            {employee.gender == 'FEMALE' && <Icon style={{ color: '#EA4C89', marginLeft: '5px' }} type="woman" />}
          </div>
          <div>{employee.orgInfo.fullOrgName} {employee.orgInfo.position && '|'} {employee.position}</div>
        </Col>}
        {currentUser.id != id && < Col
          span={24}
          style={{
            height: '50px',
            // borderTop: '1px solid rgb(0,0,0,0.1)'
          }}
        >
          <ContactButtonGroup userInfo={employee} />
        </Col>
        }
      </Row>
    </Col>
    <Col span={16} style={{ padding: '30px' }}>
      {employee && <ProfileCard
        avatarAlign="left"
        showAvatar={false}
        data={employee}
        fields={fields}
        clsssName={styles.userpage}
        backgroundImage={false}
        backgroundBlur={false}
        labelAlign='left'
        layout={{
          labelCol: {
            xs: { span: 12 },
            sm: { span: 12 },
          },
          wrapperCol: {
            xs: { span: 12 },
            sm: { span: 12 },
          },
        }}
      />}
    </Col>
  </Card >
  )

}


export default connect(({ user, userpagemodel, settings, loading }) => ({
  currentUser: user.currentUser,
  employee: userpagemodel.employee,
  ...settings
}))(Page)



