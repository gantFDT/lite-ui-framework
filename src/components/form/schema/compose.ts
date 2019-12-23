import { fromJS } from 'immutable'
import { WrappedFormUtils } from 'antd/es/form/Form'
import { get, isEqual } from 'lodash'
import moment from 'moment'

import { compose, withHandlers, withProps, withPropsOnChange, withState } from 'recompose'
import { Props, Schema, Types } from './interface'


export type Inner = Props & {
    setSchema: (newSchema: Schema) => { schema: Schema },
    mapSubSchema: (key: string, newSchema: Schema) => void,
    schemaState: Schema
}

const objectToPath = (obj: object): Array<string> => {
    const paths: Array<string> = []
    const inner = (obj: object, parentKey = ''): void => {
        Object.keys(obj).forEach(k => {
            const combineKey = parentKey ? parentKey + '.' + k : k
            const value = obj[k]
            if (typeof value === 'object' && !Array.isArray(value) && !moment.isMoment(value)) {
                inner(value, combineKey)
            } else {
                paths.push(combineKey)
            }
        })
    }
    inner(obj)
    return paths
}

/**
 * 查找依赖项
 * @param field 改变的key
 * @param value 改变的值
 * @param parentKey 父级key
 * @param schema 当前schema
 * @param form 
 */
export const findDependencies = (
    // field: string,
    // value: string,
    changedValueObject: object,
    parentKey: string,
    { ...schema }: Schema,
    mapSubSchema: (key: string, newSchema: Schema) => void,
    form: WrappedFormUtils
): Schema => {
    const qsString = objectToPath(changedValueObject) //qs.stringify(changedValueObject, { allowDots: true })
    // 改变的key
    // object.product
    const changeKey = qsString[0]// qsString.replace(/^(.*)=.*/, '$1').split('.').slice(-1)[0]
    // 改变的value
    const changeValue = get(changedValueObject, changeKey) // qsString.replace(/^.*=(.*)/, '$1')
    const { dependencies = [], onDependenciesChange, type, ...restSchema } = schema
    if (type !== Types.object) {
        if (get(dependencies, 'length') && dependencies.includes(changeKey) && onDependenciesChange) {
            const dependenciesValues = dependencies.map(deKey => {
                if (deKey === changeKey) return changeValue
                return form.getFieldValue(deKey) // 这里有问题，对于嵌套类型的object
            })
            const mergeSchema = onDependenciesChange(dependenciesValues, restSchema, form)
            if (mergeSchema) {
                // 异步走这里，需要通过mapSubSchema将subSchema更新到主schema
                if (mergeSchema.then && typeof mergeSchema.then === 'function') {
                    mergeSchema.then((mSchema: Schema) => { mapSubSchema(parentKey, { ...schema, ...mSchema }) })
                } else {
                    // 同步走这里，直接改变schema，FormSchema更新的时候自动获取最新的schema
                    // schema.props = { ...props, ...mergeProps }
                    return { ...schema, ...mergeSchema }
                }
            }
        }
    } else if (schema.propertyType) {
        schema.propertyType = { ...schema.propertyType }
        for (const [schemaKey, schemaValue] of Object.entries(schema.propertyType)) {
            const { dependencies = [], onDependenciesChange, type } = schemaValue
            if (
                // 找到了依赖项或者是object，进入递归
                (get(dependencies, 'length') && dependencies.includes(changeKey) && onDependenciesChange) ||
                type === Types.object
            ) {
                schema.propertyType[schemaKey] = findDependencies(changedValueObject, `${parentKey}.${schemaKey}`, schemaValue, mapSubSchema, form)
            }

        }
    }
    return schema
}

// 将subSchema更新到主schema，并返回
const deepMergeSchema = (oschema: Schema, keysString: string, subSchema: Schema): Schema => {
    const schema = fromJS(oschema)
    // 需要去掉第一个空
    const keysArray = keysString.split('.').filter(Boolean).reduce(
        (res, k: string) => {
            res.push('propertyType')
            res.push(k)
            return res
        }, [] as Array<string>
    )
    const newSchema = schema.setIn(keysArray, subSchema)
    return newSchema.toJS()
}

export default compose(
    withState('schemaState', 'setSchema', ({ schema }: Props) => schema),
    withHandlers({
        // 依赖项props改变
        mapSubSchema: ({ schemaState, setSchema, onSchemaChange }: Inner) => (key: string, subSchema: Schema) => {
            const newSchema = deepMergeSchema(schemaState, key, subSchema)
            if (!isEqual(schemaState, newSchema)) {
                if (onSchemaChange) {
                    onSchemaChange(newSchema)
                }
                setSchema(newSchema)
            }
        }
    }),
    withPropsOnChange(['schema'], ({ schema, setSchema }: Inner) => {
        setSchema(schema)
    }),
    withProps(({ schemaState }: { schemaState: Schema }) => ({ schema: schemaState })),
)