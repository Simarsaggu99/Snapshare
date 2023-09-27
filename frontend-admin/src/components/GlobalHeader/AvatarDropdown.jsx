// /* eslint-disable consistent-return */
// import { getIntials } from '@/utils/utils';
// import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
// import { Avatar, Divider, Menu, Spin, Tag } from 'antd';
// import React from 'react';
// import { connect, history } from 'umi';
// import HeaderDropdown from '../HeaderDropdown';
// import styles from './index.less';

// class AvatarDropdown extends React.Component {
//   onMenuClick = (event) => {
//     const { key } = event;

//     if (key === 'logout') {
//       const { dispatch } = this.props;

//       if (dispatch) {
//         dispatch({
//           type: 'login/logout',
//         });
//       }
//       return false;
//     }
//     history.push(`/${key}`);
//   };
//   // eslint-disable-next-line lines-between-class-members
//   getColorForRole = (role) => {
//     switch (role) {
//       case 'admin':
//         return 'magenta';

//       case 'manager':
//         return 'red';

//       case 'employee':
//         return 'orange';

//       default:
//         break;
//     }
//   };

//   render() {
//     const {
//       currentUser = {
//         avatar: '',
//         name: '',
//       },
//     } = this.props;
//     const menuHeaderDropdown = (
//       <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
//         <div className="p-2 px-4">
//           <div className="flex justify-center">
//             <Avatar size={80} className="text-center uppercase" style={{ background: '#126E32' }}>
//               {/* {currentUser?.name && getIntials(currentUser?.name)} */} Hello
//             </Avatar>
//           </div>
//           <div className="mt-2 text-center">
//             <div className="font-medium text-blue-900 text-lg capitalize">{currentUser?.name}</div>
//             {/* <div className="text-xs text-gray-700">{currentUser?.email}</div> */}
//            <div className="text-xs text-gray-700">currentUser</div>
//           </div>
//         </div>
//         <div className="mb-2 flex justify-center">
//           <Tag color={this.getColorForRole(currentUser?.role?.name)} className="capitalize">
//             {currentUser?.role?.name}
//           </Tag>
//         </div>
//         <Menu.Divider />
//         <div className="px-4 py-2">
//           <div className="uppercase text-xs font-semibold text-gray-500">Your Account</div>
//         </div>
//         <Menu.Item key="user-profile">
//           <div className="ml-2">
//             <UserOutlined />
//             My profile
//           </div>
//         </Menu.Item>

//         <Divider />
//         <Menu.Item key="logout">
//           <div className="ml-2">
//             <LogoutOutlined />
//             Logout
//           </div>
//         </Menu.Item>
//       </Menu>
//     );

//     return currentUser && currentUser?.user?.name ? (
//       <HeaderDropdown trigger="click" overlay={menuHeaderDropdown}>
//         <div className="flex items-center cursor-pointer uppercase">
//           <Avatar style={{ background: '#126E32' }}>
//             {currentUser?.name && getIntials(currentUser?.name)}
//           </Avatar>
//           <div className="ml-2">
//             <div className="font-medium text-blue-900 text-base capitalize">
//               {currentUser?.name} <DownOutlined />
//             </div>
//           </div>
//         </div>
//       </HeaderDropdown>
//     ) : (
//       <span className={`${styles.action} ${styles.account}`}>
//         ddd
//       </span>
//     );
//   }
// }

// export default connect(({ user }) => ({
//   currentUser: user.currentUser,
// }))(AvatarDropdown);

/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
import { getIntials } from '@/utils/utils';
import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Divider, Menu, Spin, Tag } from 'antd';
import React from 'react';
import { connect, history } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

class AvatarDropdown extends React.Component {
  onMenuClick = (event) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }
      return false;
    }
    history.push(`/${key}`);
  };
  // eslint-disable-next-line lines-between-class-members
  getColorForRole = (role) => {
    switch (role) {
      case 'admin':
        return 'magenta';

      case 'manager':
        return 'red';

      case 'employee':
        return 'orange';

      default:
        break;
    }
  };

  render() {
    const {
      currentUser = {
        avatar: '',
        name: '',
      },
    } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <div className="p-2 px-4">
          <div className="flex justify-center">
            <Avatar size={40} className="text-center uppercase" style={{ background: '#126E32' }}>
              {/* {currentUser?.displayName && getIntials(currentUser?.displayName)} */} R
            </Avatar>
          </div>
          <div className="mt-2 text-center">
            <div className="font-medium text-blue-900 text-lg capitalize">
              {currentUser?.info?.name}
            </div>
            <div className="text-xs text-gray-700">{currentUser?.info?.email}</div>
          </div>
        </div>
        <div className="mb-2 flex justify-center">
          <Tag color={this.getColorForRole(currentUser?.role)} className="capitalize">
            {currentUser?.info?.role}
          </Tag>
        </div>
        <Menu.Divider />
        <div className="px-4 py-2">
          <div className="uppercase text-xs font-semibold text-gray-500">Your Account</div>
        </div>
        <Menu.Item
          key="user-profile"
          // onClick={() => {
          //   history.push('/user/user-profile');
          // }}
        >
          <div className="ml-2">
            <UserOutlined />
            My profile
          </div>
        </Menu.Item>

        <Divider />
        <Menu.Item key="logout">
          <div className="ml-2">
            <LogoutOutlined />
            Logout
          </div>
        </Menu.Item>
      </Menu>
    );

    return currentUser && currentUser?._id ? (
      <HeaderDropdown trigger="click" overlay={menuHeaderDropdown}>
        <div className="flex items-center cursor-pointer uppercase">
          <Avatar style={{ background: '#126E32' }}>
            {/* {currentUser?.displayName && getIntials(currentUser?.displayName)} */}M
          </Avatar>
          <div className="ml-2">
            <div className="font-medium text-blue-900 text-base capitalize">
              grr {currentUser?.displayName} <DownOutlined />
            </div>
          </div>
        </div>
      </HeaderDropdown>
    ) : (
      <HeaderDropdown trigger="click" overlay={menuHeaderDropdown}>
        <div className="flex items-center cursor-pointer uppercase">
          <Avatar style={{ background: '#126E32' }}>
            {/* {'Guest' && getIntials(currentUser?.info?.name)} */}M
          </Avatar>
          <div className="ml-2">
            <div className="font-medium text-white text-base capitalize">
              {currentUser?.info?.name} <DownOutlined />
            </div>
          </div>
        </div>
      </HeaderDropdown>
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
