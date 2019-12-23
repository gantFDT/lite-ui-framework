import withChange from './withChange'
import withEdit from './withEdit'
import { compose } from 'recompose'

/**
 * 通过这个高阶组件可以得到如下属性和方法:
 * @ edit, changed,
 * @ setEdit, toggleEdit,
 * @ setChanged
 */
const formCompose = compose(
  withEdit,
  withChange,
)

export default formCompose
