import { RouteComponentProps } from 'react-router-dom';
import { SetStateAction, Dispatch as ReactDispatch } from 'react';
import { RouterTypes } from 'umi';
import { AnyAction, Dispatch, ReducersMapObject } from 'redux';
import { Model as DvaModel, EffectType, ReducersMapObjectWithEnhancer, SubscriptionsMapObject } from 'dva';


import { GlobalModelState } from './global'
import { LocaleState } from './locale'
import { LoginState } from './login'
import { MenuState } from './menu'
import { NotificationState } from './notification'
import { OrganizationState } from './organization'
import { SelectorsState } from './selectors'
import { ServermgtState } from './servermgt'
import { UserState } from './user'
import { SettingsState } from './setting'

export interface Store {
    global: GlobalModelState,
    locale: LocaleState,
    login: LoginState,
    menu: MenuState,
    notification: NotificationState,
    organization: OrganizationState,
    selectors: SelectorsState,
    servermgt: ServermgtState,
    user: UserState,
    settings: SettingsState,
}

export type Loading = {
    effects: {
        [prop: string]: boolean
    }
}

export type LoadingIF = {
    effects: {
        [prop: string]: boolean
    }
}

export type Effect = (
    action: AnyAction,
    effects: {
        put: <A extends AnyAction>(action: A) => any,
        call: Function,
        select: <T>(func: (store: Store) => T) => T,
        take: Function,
        cancel: Function,
        [key: string]: any,
    }
) => void;

export type EffectWithType = [Effect, { type: EffectType }];

export interface Model {
    namespace: string,
    state?: any,
    effects?: {
        [key: string]: Effect | EffectWithType
    }
    reducers?: ReducersMapObjectWithEnhancer[0] | ReducersMapObjectWithEnhancer,
    subscriptions?: SubscriptionsMapObject,
}


export { RouterTypes, Dispatch, AnyAction, SetStateAction, ReactDispatch, RouteComponentProps }