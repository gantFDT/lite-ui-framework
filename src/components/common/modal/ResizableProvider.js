import react, { useEffect, useReducer } from 'react';
import { ModalContext } from './Context';
import { resizableReducer } from './Reducer';

const getWindowSize = () => ({
    width: window.innerWidth || 0,
    height: window.innerHeight || 0,
})

const initialModalState = {
    x: 0,
    y: 0,
    width: 520,
    height: 520,
    zIndex: 0,
    visible: false,
    maximized: false,
}

export const ResizableProvider = ({ initalState = {}, maxZIndex = 0, minWidth = 200, minHeight = 200, children }) => {

    const initialModalsState = {
        modals: {},
        maxZIndex,
        minWidth,
        minHeight,
        windowSize: getWindowSize(),
        initialModalState: _.assign({ ...initialModalState }, initalState)
    };

    const [state, dispatch] = useReducer(resizableReducer, initialModalsState)

    useEffect(() => {
        if (typeof window !== 'object') return;
        const onResize = () => dispatch({ type: 'windowResize', size: getWindowSize() })
        window.addEventListener('resize', onResize)
        onResize()
        return () => window.removeEventListener('resize', onResize)
    }, [])

    return (
        <ModalContext.Provider value={{ state, dispatch }}>
            {children}
        </ModalContext.Provider>
    )
}
