import React from 'react';
import { Redirect, connect } from 'umi';

class AuthorizedRoute extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch, currentUser } = this.props;

    if (dispatch) {
      if (!currentUser) {
        dispatch({
          type: 'user/fetchCurrent',
        });
      }
    }
  }

  render() {
    const { children, currentUser } = this.props; // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）

    const userRole = currentUser?.role;

    if (!this.props.route.authority.includes(userRole)) {
      return <Redirect to={`/`} />;
    }

    return children;
  }
}

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(AuthorizedRoute);
