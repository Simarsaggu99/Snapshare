// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import { FaUsers } from 'react-icons/fa';
// import component from '@/locales/en-US/component';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'en-US',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          path: '/',
          redirect: '/user/login',
        },
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
        {
          name: 'signup',
          path: '/user/signup',
          component: './user/signup',
        },
        {
          name: 'inviteUser',
          path: '/user/forgotpassword',
          component: './user/ForgotPassword',
        },
        {
          name: 'resetPassword',
          path: '/user/resetPassword',
          component: './user/ResetPassword',
        },
        {
          name: 'inviteUser',
          path: '/user/invitation',
          component: './user/acceptInvitation',
        },
      ],
    },
    {
      path: '/privacy-policy',
      name: 'privacyPolicy',
      component: './Policy',
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              path: '/',
              redirect: '/dashboard',
            },
            {
              path: '/dashboard',
              name: 'Dashboard',
              icon: 'DashboardOutlined',
              component: './NewDashboard',
            },

            {
              path: '/users',
              name: 'Manage Users',
              icon: 'UserOutlined',
              routes: [
                {
                  path: '/users',
                  redirect: '/users/all',
                },
                {
                  path: '/users/all',
                  name: 'Manage user',
                  component: './ManageUser',
                  hideInMenu: true,
                },
                {
                  path: '/users/profile/:id',
                  name: 'user profile',
                  component: './ManageUser/UserProfile',
                  hideInMenu: true,
                },
              ],
            },

            {
              name: 'Manage Transactions',
              path: '/manage-transactions',
              // component: './ManageTransactions',
              icon: 'TransactionOutlined',
              routes: [
                {
                  path: '/manage-transactions',
                  redirect: '/manage-transactions/all',
                },
                {
                  path: '/manage-transactions/all',
                  name: 'Manage Transactions',
                  component: './ManageTransactions',
                  hideInMenu: true,
                },
                // {
                //   path: '/users/profile/:id',
                //   name: 'user profile',
                //   component: './ManageUser/UserProfile',
                //   hideInMenu: true,
                // },
              ],
            },

            {
              name: 'Manage Reports',
              icon: 'ExclamationOutlined',
              path: '/reports',
              routes: [
                { path: '/reports', redirect: '/reports/new' },
                {
                  path: '/reports/new',
                  name: 'manage-reports',
                  hideInMenu: true,
                  component: './ManageReports',
                },
                {
                  path: '/reports/:id',
                  name: 'open-report',
                  hideInMenu: true,
                  component: './ManageReports/ReportedPost',
                },
              ],
            },

            {
              name: 'Manage Bounty',
              path: '/manage-bounties',
              component: './CreateBounty',
              icon: 'UserSwitchOutlined',
            },

            {
              path: '/manage-bounties/creating-bounty-program',
              component: './SingleBounty',
            },

            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  // theme: {
  //   // ...darkTheme,
  //   'primary-color': defaultSettings.primaryColor,
  //   'link-color': defaultSettings.linkColor,
  // },
  // // @ts-ignore
  // title: false,
  // ignoreMomentLocale: true,
  // proxy: proxy[REACT_APP_ENV || 'dev'],
  // manifest: {
  //   basePath: '/',
  // },
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
