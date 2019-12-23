import React, { useEffect, useMemo, useCallback, useState } from 'react'
import { connect } from 'dva'
import { Modal, Table, Icon, Button, Divider } from 'antd'
import { get } from 'lodash'
import { ModalProps } from 'antd/es/modal'
import { Loading, Dispatch, AnyAction } from '@/models/connect'

interface AbilityManage {
    uriList: Array<{ name: string }>
}
interface DispatchProps {
    finduri: (p: any) => void
}

interface URIFormProps extends ModalProps, AbilityManage, DispatchProps {
    nodeId: string,
    loading: boolean,
}

const URIForm = (props: URIFormProps) => {
    const { visible, nodeId, finduri, uriList = [], loading, ...prop } = props
    const fakeChildren = useCallback(
        (list) => {
            return list.map(item => {
                const { children, ...prop } = item;
                if (get(children, 'length')) {
                    return {
                        ...prop,
                        children: fakeChildren(children),
                    }
                }
                return prop
            })
        },
        [],
    )
    const dataSource = useMemo(() => fakeChildren(uriList), [uriList])
    const [expandedRowKeys, setexpandedRowKeys] = useState([])

    const expandIcon = useCallback(
        (props) => {
            let type = ''
            if (!props.expandable) {
                type = 'file';
            } else if (props.expanded) {
                type = 'folder-open';
            } else {
                type = 'folder';
            }
            return <Icon type={type} theme="filled" />
        },
        [],
    )

    useEffect(() => {
        if (nodeId && visible) {
            finduri(nodeId)
        }
    }, [nodeId, visible])

    const onOpen = useCallback(
        (open) => {
            if (open) {
                setexpandedRowKeys(dataSource.map((item: { id: string }) => item.id))
            } else {
                setexpandedRowKeys([])
            }
        },
        [dataSource],
    )

    const onExpandedRowsChange = useCallback(
        (rows) => {
            setexpandedRowKeys(rows)
        },
        [dataSource],
    )
    return (
        <Modal title={tr('功能点与URI对应信息')} visible={visible} footer={null} destroyOnClose {...prop}>
            <div>
                <Button size='small' onClick={() => onOpen(true)}>{tr('全部展开')}</Button>
                <Button size='small' onClick={() => onOpen(false)} style={{ marginLeft: 8 }}>{tr('全部关闭')}</Button>
            </div>
            <Divider></Divider>
            <Table columns={[{ dataIndex: 'name' }]} expandedRowKeys={expandedRowKeys} onExpandedRowsChange={onExpandedRowsChange} size='small' rowKey='id' showHeader={false} pagination={false} dataSource={dataSource} loading={loading} />
        </Modal>
    )
}

export default connect(
    ({ abilityManage, loading }: { abilityManage: AbilityManage, loading: Loading }) => ({
        uriList: abilityManage.uriList,
        loading: loading.effects['abilityManage/finduri'],
    }),
    (dispatch: Dispatch<AnyAction>) => {
        const dispatchProps: DispatchProps = {
            finduri: payload => {
                dispatch({
                    type: 'abilityManage/finduri',
                    payload,
                })
            }
        }
        return dispatchProps
    }
)(URIForm)
