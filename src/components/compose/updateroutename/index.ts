import { compose, withHandlers, lifecycle, withStateHandlers } from 'recompose'
import { connect } from 'dva'
import { HandlerWithType } from '@/global'
import { Dispatch, AnyAction } from 'redux';
import { get } from 'lodash'

interface PropsType {
  routename: string,
  getRouteName: GetRouteNameType,
  updateRouteName: HandlerWithType<string>,
  update: HandlerWithType<string>
}
type GetRouteNameType = (props: PropsType) => string

export default (getRouteName: GetRouteNameType) => compose(
  connect(),
  withHandlers({
    updateRouteName: ({ dispatch, match }: { dispatch: Dispatch<AnyAction>, match: object }) => (name: string) => dispatch({
      type: 'menu/updateRouteName',
      payload: {
        pathname: get(match, 'url'),
        name,
        // or nameEN
      },
    }),
  }),
  withStateHandlers(
    { routename: '' },
    {
      update: ({ routename }, { updateRouteName }: { updateRouteName: HandlerWithType<string> }) => (name: string) => {
        if (name !== routename) {
          updateRouteName(name)
          return {
            routename: name,
          }
        }
        return { routename }
      }
    },
  ),
  lifecycle<PropsType, void>({
    componentDidMount() {
      const { update } = this.props
      const name = getRouteName(this.props)
      update(name)
    },
    componentDidUpdate(prev) {
      const { update, routename } = this.props
      const name = getRouteName(this.props)
      if (routename !== name) {
        update(name)
      }
    },
    componentWillUnmount() {
      const { updateRouteName } = this.props
      updateRouteName('')
    }
  })
)