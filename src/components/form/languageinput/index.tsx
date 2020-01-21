import React, { useState, useMemo, useCallback, useRef } from 'react';
import { InputLang, EditStatus } from 'gantd'
import { get } from 'lodash'
import { getLocale } from 'umi/locale'
import { getLanguage } from '@/utils/plantformLanguage'
import { useCheckBlur } from '@/utils/hooks'
// const map = {
//     'zh_CN': <img alt={tr("旗中华人民共和国的")} src="https://flagpedia.asia/data/flags/mini/cn.png" width="30" height="20" />,
//     'en': <img alt={tr("旗美国")} src="https://flagpedia.asia/data/flags/mini/us.png" width="30" height="20" />,
//     default: tr('未知区域'),
// }

const locale = getLocale()
const localeMap = {
    'zh-CN': 'zh_CN',
    'en-US': 'en',
}
const systemLocale = localeMap[locale]

export interface LocaleItem {
    locale: string,
    label: React.ReactNode | string,
    value: string
}

type Locale = Array<LocaleItem>;

interface InputLangProps {
    value: string,
    onChange?: (v: string) => void,
    onBlur: Function,
    [propsname: string]: any
}

const LanguageInput = React.forwardRef((props: InputLangProps, ref) => {
    const { value = '', onBlur, ...prop } = props
    const [currentLocale, setcurrentLocale] = useState(systemLocale)
    const thisRef = useRef(null)
    const [localeList, setlocaleList] = useState([] as Locale)
    const localeMap = useMemo(() => {
        try {
            return JSON.parse(value)
        }
        catch{
            return {}
        }
    }, [value])

    const convertValue = useMemo(() => {
        return {
            locale: currentLocale,
            value: localeMap[currentLocale]
        }
    }, [localeMap, currentLocale])

    const onChange = useCallback(
        ({ value, locale }) => {
            setcurrentLocale(locale)
            const newMap = { ...localeMap, [locale]: value }
            if (props.onChange) {
                props.onChange(JSON.stringify(newMap))
            }
        },
        [props.onChange, localeMap],
    )

    useState(() => {
        getLanguage().then(list => { setlocaleList(list.map(item => ({ ...item, label: item.name, value: localeMap[item.locale] }))) })
    })
    useCheckBlur(thisRef, onBlur)
    return (<div ref={thisRef}>
        <InputLang {...prop} value={convertValue} onChange={onChange} localeList={localeList} edit={EditStatus.EDIT} />
    </div>
    )
})

export default LanguageInput;
