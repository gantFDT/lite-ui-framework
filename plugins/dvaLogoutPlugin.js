

module.exports = {
    onAction: ({ getState, dispatch }) => next => action => {
        if (action.type === 'login/logout') {
            const keys = Object.getOwnPropertyNames(getState())
            keys.forEach(namespace => {
                dispatch({
                    type: `${namespace}/resetState`
                })
            })
        }
        return next(action)
    }
}