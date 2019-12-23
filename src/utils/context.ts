import React from 'react'

export interface Size {
  width: number
  height: number
}

export const SizeContext = React.createContext({} as Size)
