interface PageInfo {
    beginIndex: number,
    pageSize: number,
}

interface UserIdentity {
    userToken: string,
    userLoginName: string,
    userLanguage: string
}

interface Location {
    key: string,
    name: string,
    pathname: string,
}

interface Window {
    ga: (a: string, b: string, c: string) => string
}
