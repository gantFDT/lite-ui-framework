import React from 'react'
import Menumange from '../menumanage'

export default (props) => {
    const {route} = props
    return <Menumange type="context" route={route}/>
}