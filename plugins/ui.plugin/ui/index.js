
import React from 'react'
import { APIContext } from './context'
import Layout from './components/basiclayout'


export default async (api) => {

  api.addPanel({
    title: 'gant模板',
    path: '/ui-plugin',
    component: () => {
      return (
        <APIContext.Provider value={{ api }}>
          <Layout />
        </APIContext.Provider>
      )
    },
    icon: 'home',
  })
}