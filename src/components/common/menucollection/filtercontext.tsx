import { createContext } from 'react'
type context = {
    filter: string,
    onClose: () => void,
}
export default createContext({} as context)