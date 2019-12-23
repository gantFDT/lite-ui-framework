import React, { ComponentClass, ClassAttributes, Component } from 'react'
import Prompt from 'umi/prompt'
import { compose, withState, withHandlers } from 'recompose';
import { HandlerWithType } from 'gantd'
// import { tr } from '@/components/common';

function noop() { return true }

export interface WithChangeProps {
  setChanged: HandlerWithType<boolean>,
  changed: boolean,
  [prop: string]: any
}

const mesaage = `${tr('您有可能有未保存的修改')},${tr('是否离开')}?`

const withChange = compose(
  withState('changed', 'setChanged', false),
  withHandlers({
    setChanged: ({ setChanged: originSetChanged, changed }: WithChangeProps) => (change: boolean) => {
      if (change !== changed) {
        if (changed) {
          window.onbeforeunload = noop
        } else {
          window.onbeforeunload = null
        }
        originSetChanged(change)
      }
    },
  }),
  (BaseComponent: ComponentClass) => (props: WithChangeProps) => {
    const { changed } = props
    const Factory = React.createFactory(BaseComponent)
    interface T extends ClassAttributes<Component<{}, any, any>>, WithChangeProps { }
    const prop: T = props
    return (
      <>
        <Prompt message={mesaage} when={changed} />
        {Factory(prop)}
      </>
    )
  },
)

export default withChange
