import React from 'react';
import { Selector, EditStatus, withEdit } from 'gantd';
import { TreeSelect } from 'antd';
import withLoupe from './withLoupe';
import { compose } from 'recompose';
import { getType } from '@/utils/utils';

export interface BaseSelectProps {
    componentType?: string | React.ReactNode,
    onLoupeClick?: () => void,
    [propsname: string]: any
}

const mapComponents = (props: BaseSelectProps) => {
    const { componentType, labelProp, valueProp, ...restProps } = props;
    if (componentType && getType(componentType) !== 'String') {
        return componentType;
    }
    switch (componentType) {
        case 'TreeSelect':
            return <TreeSelect
                allowClear
                style={{ width: '100%' }}
                {...restProps}
            />
        default:
            return <Selector
                allowClear
                edit={EditStatus.EDIT}
                labelProp={labelProp}
                valueProp={valueProp}
                {...restProps} />
    }
}

const BaseSelect = (props: BaseSelectProps) => <>{mapComponents(props)}</>;

const ehance = compose(
    withEdit(({ renderReadElement, ...restProps }: any) => {
        if (renderReadElement) {
            return renderReadElement(restProps)
        }
        return restProps.value
    }),
    withLoupe(),
)

export default ehance(BaseSelect)

