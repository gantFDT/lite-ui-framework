import React from 'react';

export const getModalState = (state, id) => state.modals[id] || state.initialModalState;

const clamp = (min, max, value) => Math.max(min, Math.min(max, value));

const mapObject = (obj, fn) => Object.assign({}, ...Object.keys(obj).map(key => ({ [key]: fn(obj[key]) })))

const getNextZIndex = (state, id) => {
    const { modals, maxZIndex } = state;
    if (modals.length === 1) return maxZIndex;
    let modalState = getModalState(state, id);
    return modalState.zIndex === maxZIndex ? maxZIndex : maxZIndex + 1;
}

const clampDrag = (windowWidth, windowHeight, x, y, width, height) => {
    const maxX = windowWidth - width;
    const maxY = windowHeight - height;
    const clampedX = clamp(0, maxX, x)
    const clampedY = clamp(0, maxY, y)
    return { x: clampedX, y: clampedY }
}

const clampResize = (minWidth, minHeight, windowWidth, windowHeight, x, y, width, height) => {
    const maxWidth = windowWidth - x;
    const maxHeight = windowHeight - y;
    const clampedWidth = clamp(minWidth, maxWidth, width)
    const clampedHeight = clamp(minHeight, maxHeight, height)
    return { width: clampedWidth, height: clampedHeight }
}

export const resizableReducer = (state, action) => {
    const { minWidth, minHeight, initialModalState } = state;
    const needIncrease = Object.keys(state.modals).length != 1;
    switch (action.type) {
        case 'mount':
            let combineState = _.assign(initialModalState, action.itemState || {});
            let inital = { width: combineState.width, height: combineState.height };
            return {
                ...state,
                maxZIndex: state.maxZIndex + 1,
                modals: {
                    ...state.modals,
                    [action.id]: {
                        inital,
                        ...combineState,
                        x: (state.windowSize.width - combineState.width) / 2,
                        y: (state.windowSize.height - combineState.height) / 2,
                        zIndex: state.maxZIndex + 1,
                    },
                },
            }
        case 'unmount':
            const modalsClone = { ...state.modals }
            delete modalsClone[action.id]
            return {
                ...state,
                modals: modalsClone,
            }
        case 'focus':
            const modalState = state.modals[action.id]
            const maxZIndex = needIncrease ? state.maxZIndex + 1 : state.maxZIndex
            return {
                ...state,
                maxZIndex,
                modals: {
                    ...state.modals,
                    [action.id]: {
                        ...modalState,
                        zIndex: maxZIndex,
                    },
                },
            }
        case 'show': {
            const modalState = state.modals[action.id]
            const maximized = modalState.maximized;
            const maxZIndex = needIncrease ? state.maxZIndex + 1 : state.maxZIndex
            const centerX = (state.windowSize.width - modalState.width) / 2
            const centerY = (state.windowSize.height - modalState.height) / 2
            const position = maximized ? { x: 0, y: 0 } : clampDrag(
                state.windowSize.width,
                state.windowSize.height,
                centerX,
                centerY,
                modalState.width,
                modalState.height,
            )
            const size = maximized ?
                { width: state.windowSize.width, height: state.windowSize.height }
                : clampResize(
                    minWidth,
                    minHeight,
                    state.windowSize.width,
                    state.windowSize.height,
                    position.x,
                    position.y,
                    modalState.width,
                    modalState.height,
                )
            return {
                ...state,
                maxZIndex,
                modals: {
                    ...state.modals,
                    [action.id]: {
                        ...modalState,
                        ...position,
                        ...size,
                        maximize: maximized,
                        zIndex: maxZIndex,
                        visible: true,
                    },
                },
            }
        }
        case 'hide': {
            const modalState = state.modals[action.id]
            return {
                ...state,
                modals: {
                    ...state.modals,
                    [action.id]: {
                        ...modalState,
                        width: modalState.inital.width,
                        height: modalState.inital.height,
                        maximize: false,
                        visible: false,
                    },
                },
            }
        }
        case 'max': {
            const modalState = state.modals[action.id]
            return {
                ...state,
                modals: {
                    ...state.modals,
                    [action.id]: {
                        ...modalState,
                        x: 0,
                        y: 0,
                        height: window.innerHeight,
                        width: window.innerWidth,
                        maximize: true
                    }
                }
            }
        }
        case 'reset': {
            const modalState = state.modals[action.id]
            const inital = modalState.inital;
            const centerX = (state.windowSize.width - inital.width) / 2
            const centerY = (state.windowSize.height - inital.height) / 2
            const position = clampDrag(
                state.windowSize.width,
                state.windowSize.height,
                centerX,
                centerY,
                inital.width,
                inital.height,
            )
            const size = clampResize(
                minWidth,
                minHeight,
                state.windowSize.width,
                state.windowSize.height,
                position.x,
                position.y,
                inital.width,
                inital.height,
            )
            return {
                ...state,
                modals: {
                    ...state.modals,
                    [action.id]: {
                        ...modalState,
                        ...position,
                        ...size,
                        maximize: false,
                    },
                },
            }
        }
        case 'resize':
            const size = clampResize(
                minWidth,
                minHeight,
                state.windowSize.width,
                state.windowSize.height,
                action.x,
                action.y,
                action.width,
                action.height,
            )
            return {
                ...state,
                maxZIndex: getNextZIndex(state, action.id),
                modals: {
                    ...state.modals,
                    [action.id]: {
                        ...state.modals[action.id],
                        ...size,
                        zIndex: getNextZIndex(state, action.id),
                    },
                },
            }
        case 'drag':
            return {
                ...state,
                maxZIndex: getNextZIndex(state, action.id),
                modals: {
                    ...state.modals,
                    [action.id]: {
                        ...state.modals[action.id],
                        ...clampDrag(
                            state.windowSize.width,
                            state.windowSize.height,
                            action.x,
                            action.y,
                            state.modals[action.id].width,
                            state.modals[action.id].height,
                        ),
                        zIndex: getNextZIndex(state, action.id),
                    },
                },
            }
        case 'windowResize':
            return {
                ...state,
                windowSize: action.size,
                modals: mapObject(state.modals, (modalState) => {
                    if (!modalState.visible) {
                        return modalState
                    }
                    const position = modalState.maximize ? { x: 0, y: 0 } : clampDrag(
                        action.size.width,
                        action.size.height,
                        modalState.x,
                        modalState.y,
                        modalState.width,
                        modalState.height,
                    )
                    const size = modalState.maximize ?
                        { width: action.size.width, height: action.size.height }
                        : clampResize(
                            minWidth,
                            minHeight,
                            action.size.width,
                            action.size.height,
                            position.x,
                            position.y,
                            modalState.width,
                            modalState.height,
                        )
                    return {
                        ...modalState,
                        ...position,
                        ...size,
                    }
                }),
            }
        default:
            throw new Error()
    }
}