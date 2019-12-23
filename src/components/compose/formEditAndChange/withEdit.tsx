import { compose, withState, withHandlers } from 'recompose'
import { EditStatus, SwitchStatus } from 'gantd'
import { HandlerWithType } from '@/global'

const withEdit = compose(
  withState('edit', "setEdit", EditStatus.CANCEL),
  withHandlers({
    toggleEdit: ({ setEdit }: { setEdit: HandlerWithType<EditStatus> }) => () => {
      setEdit(SwitchStatus)
    },
  }),
)

export default withEdit
