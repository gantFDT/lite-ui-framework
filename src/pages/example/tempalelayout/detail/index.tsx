import React, { useRef, useCallback, useMemo } from 'react';
import FormSchema from '@/components/form/schema';
import { Button } from 'antd';
import { BlockHeader } from 'gantd';
import { Title } from '@/components/common';

const DetailContent = (props: any): React.ReactElement => {
    const {
        values,
        schema,
        loading,
        onSubmit,
        uiSchema
    } = props;

    const formRef: any = useRef(null);
    const handleSubmit = useCallback(async () => {
        if (!formRef.current) return;
        const { errors, values: formValues } = await formRef.current.validateForm();
        if (errors) return;
        onSubmit && onSubmit({ ...values, ...formValues })
    }, [values, onSubmit])

    return <>
        <BlockHeader
        
            title={<Title title={tr(values.categoryName)} showShortLine={true} showSplitLine={true} />}
            extra={<>
                <Button
                    type='primary'
                    size='small'
                    style={{ borderRadius: 16, paddingLeft: 40, paddingRight: 40 }}
                    className="marginh5"
                    loading={loading}
                    onClick={handleSubmit}
                >{tr('保存')}</Button>
            </>}
        />
        <FormSchema
            key={values.id || 'schema'}
            wrappedComponentRef={formRef}
            data={values}
            schema={schema}
            uiSchema={uiSchema}
        />
    </>
}
export default DetailContent