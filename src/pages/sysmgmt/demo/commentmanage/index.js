import { connect } from 'dva'
import Comment from '@/components/specific/comment'
function Page(props) {
    const { user } = props;
    return <Comment objId="222222" user={user} loadType='click' />
}
export default connect(({ user }) => ({ user: user.currentUser }))(Page)