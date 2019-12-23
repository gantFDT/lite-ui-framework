import lodash from 'lodash'
import { any } from 'prop-types';
declare interface Window {
  tr: Function;
}

declare global { // 全局变量设置
  const _: typeof lodash;
  const ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: string;
}

export type HanderMapper<T> = (param: T) => T

export type HandlerType = <T>(param: T | HanderMapper<T>) => void

export type HandlerWithType<T> = (param: T | HanderMapper<T>) => void