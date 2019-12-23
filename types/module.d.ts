declare module 'umi/locale'

declare module 'react-zmage'

declare module 'expire-cache'

declare function tr(id: string): string


declare const BASE_CONFIG: {

}

declare const LOGIN_CONFIG: {

}

declare const MAIN_CONFIG: {

}

interface Context {
    (key: string): any
    keys: () => Array<string>
}
type requireContext = (a: string, b: boolean, c: any) => Context

interface NodeRequire {
    context: requireContext
}

