import React from 'react';


/// <reference path='types.d.ts' />

export const ModalContext = React.createContext({} as {
    state: ModalsState,
    dispatch: React.Dispatch<Action>
});
