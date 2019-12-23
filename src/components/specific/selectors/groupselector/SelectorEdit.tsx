import React, { useCallback, useEffect } from 'react';
import GroupSelector from './SelectorFormItem';
import { nameKeys } from './static';
const { selectorEleKey, modalEleKey, dropDownEleKey, popoverEleKey } = nameKeys;

function SelectorEdit(props: any, ref: any) {
    const { onBlur, ...restProps } = props;
    const onEventClick = useCallback((event) => {
        const targetEle = event.target;
        const ele = document.getElementById(selectorEleKey);
        const modalEle = document.getElementsByClassName(modalEleKey)[0];
        const dropdownEle = document.getElementsByClassName(dropDownEleKey)[0];
        const popoverEle = document.getElementsByClassName(popoverEleKey)[0];
        if ((ele && ele.contains(targetEle))
            || (modalEle && modalEle.contains(targetEle))
            || dropdownEle && dropdownEle.contains(targetEle)
            || popoverEle && popoverEle.contains(targetEle)
        ) return;
        onBlur && onBlur();
    }, [onBlur])

    useEffect(() => {
        window.addEventListener("mousedown", onEventClick);
        return () => window.removeEventListener("mousedown", onEventClick);
    }, [onEventClick])

    return <div id={selectorEleKey} ref={ref}><GroupSelector  {...restProps} /></div>
}
export default React.forwardRef(SelectorEdit)
