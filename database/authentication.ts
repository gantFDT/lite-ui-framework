import {gStatus} from './utils'

export default {
  '/authentication/login': async (params: any) => {
    const { userLoginName, password } = params
    const res = {
      token:'48u2rPo9tRjvufVfiNb6Ea1/os9Pk63uaN6gKZu5WPw9KAq2zJCzESj4vmreUIiXreymiqdpBqNpQURix5xoOQ=='
    }
    const data = gStatus('success',res)
    return data
  },
}