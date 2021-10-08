import React, { useState, useCallback } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Form, Input, Menu, message, Modal, Space, Spin } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { outLogin } from '@/services/ant-design-pro/api';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { EditOutlined } from '@ant-design/icons/lib';
import { FormInstance } from 'antd/lib/form';
import { useRef } from 'react';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  await outLogin();
  const { query = {}, pathname } = history.location;
  const { redirect } = query;
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname,
      }),
    });
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [ isModalVisible, setIsModalVisible ] = useState(false);
  const formRef = useRef<FormInstance>();
  // 修改密码表单提交
  const onFinish = async (values: any) => {
    if (values.surePassword != values.newPassword) {
      message.warn('两次密码输入不一致，请重新输入');
      return;
    }
    if (values.oldPassword == values.newPassword) {
      message.warn('新密码不能和原密码一样');
      return;
    }
    const response = await editePassword(values);
    if (response && response.code === 200) {
      if (response.data.result === true) {
        message.success('密码修改成功,系统将退出重新登录！');
        setIsModalVisible(true)
        const { dispatch } = props;

        if (dispatch) {
          dispatch({
            type: 'login/logout',
          });
        }
      } else {
        message.warn(response.data.message);
      }
    }
  };
  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
        loginOut();
        return;
      }
      if (key === 'editPsw') {
        console.log('editPsw');
        setIsModalVisible(true)
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {(
        <Menu.Item key="personalInfo">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {/* {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )} */}
      {(
        <Menu.Item key="editPsw">
          <EditOutlined />
          修改密码
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}

      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
          <span className={`${styles.name} anticon`}>{currentUser.name}</span>
        </span>
      </HeaderDropdown>
      <Modal
        title="修改密码"
        visible={isModalVisible}
        footer={[]}
        onCancel={() => {
          setIsModalVisible(false)
        }}
        destroyOnClose={true}
      >
        <Form {...layout} ref={formRef} name="control-hooks" onFinish={onFinish}>
          <Form.Item
            name="oldPassword"
            label="原密码"
            rules={[{ required: true, message: '请输入原密码' }]}
          >
            <Input.Password placeholder="请输入原密码" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { pattern: /^[0-9a-zA-Z_@]{6,15}$/, message: '只支持6~15位数字、字母、符号_@组合' },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            name="surePassword"
            label="确认新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { pattern: /^[0-9a-zA-Z_@]{6,15}$/, message: '只支持6~15位数字、字母、符号_@组合' },
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Space>
              <Button type="primary" htmlType="submit">
                {' '}
                确认修改{' '}
              </Button>
              <Button
                htmlType="button"
                onClick={() => {
                  setIsModalVisible(true)
                }}
              >
                取消{' '}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

    </>
  );
};

export default AvatarDropdown;
