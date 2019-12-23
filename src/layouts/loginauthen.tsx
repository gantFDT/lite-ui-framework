import React, { useEffect } from 'react'
import { RouterTypes } from 'umi';
import router from 'umi/router'
import { RouteComponentProps } from 'dva/router';
import { connect } from 'dva';



interface LoginAuthenProps extends RouterTypes, RouteComponentProps {
    userToken: string,
    render: (p: object) => React.ReactNode
}

const LoginAuthen = (props: LoginAuthenProps) => {
    useEffect(() => {
        if (!props.userToken) {
            router.replace('/login')
        }
    }, [props.userToken])

    return props.render(props)
}

export default connect(({ login }: { login: { userToken: string } }) => ({
    ...login
}))(LoginAuthen)