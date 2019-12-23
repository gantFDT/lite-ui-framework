import React from 'react'


export default class Layout extends React.Component {

  state = {

  }

  render() {
    const { children } = this.props
    return (
      <>
        {children}
      </>
    )
  }

}
