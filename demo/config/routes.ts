/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: xingyingjie
 * @Date: 2021-10-03 22:44:26
 * @LastEditors: xingyingjie
 * @LastEditTime: 2021-10-03 23:36:53
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    name: 'xyj',
    icon: 'table',
    path: '/xyj',
    component: './xyj',
  },
    //个人中心
    {
      path: '/account',
      name: 'account',
      icon: 'UserOutlined',
      component: './account',
      // routes: [
      //   {
      //     // 个人信息
      //     path: '/account/personalInfo',
      //     name: 'personalInfo',
      //     component: '@/pages/Account/PersonalInfo/PersonalInfo.tsx',
      //   },
      // ],
    },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
