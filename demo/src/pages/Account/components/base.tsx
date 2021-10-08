/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: xingyingjie
 * @Date: 2021-10-08 10:12:35
 * @LastEditors: xingyingjie
 * @LastEditTime: 2021-10-08 10:34:31
 */
import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Upload, message } from 'antd';
import ProForm, {
    ProFormDependency,
    ProFormFieldSet,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-form';
import { useRequest } from 'umi';
// import { apiQueryCity, apiQueryCounty, apiQueryProvince } from './api';

import styles from './BaseView.less';
//电话验证
const validatorPhone = (rule: any, value: string, callback: (message?: string) => void) => {
    const values = value.split('-');
    if (!values[0]) {
        callback('Please input your area code!');
    }
    if (!values[1]) {
        callback('Please input your phone number!');
    }
    callback();
};
// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }: { avatar: string }) => (
    <>
        <div className={styles.avatar_title}>头像</div>
        <div className={styles.avatar}>
            <img src={avatar} alt="avatar" />
        </div>
        <Upload showUploadList={false}>
            <div className={styles.button_view}>
                <Button>
                    <UploadOutlined />
                    更换头像
                </Button>
            </div>
        </Upload>
    </>
);

const BaseView: React.FC = () => {
    const { data: currentUser, loading } = useRequest(() => {
        return queryCurrent();
    });
    //获取头像地址
    const getAvatarURL = () => {
        if (currentUser) {
            if (currentUser.avatar) {
                return currentUser.avatar;
            }
            const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
            return url;
        }
        return 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    };

    const handleFinish = async (values) => {
        console.log(values);
        message.success('更新基本信息成功');
    };
    return (
        <div className={styles.baseView}>
            {loading ? null : (
                <>
                    <div className={styles.left}>
                        <ProForm
                            layout="vertical"
                            onFinish={(values) => {
                                handleFinish(values);
                            }}
                            submitter={{
                                resetButtonProps: {
                                    style: {
                                        display: 'none',
                                    },
                                },
                                submitButtonProps: {
                                    children: '更新基本信息',
                                },
                            }}
                            initialValues={{
                                ...currentUser,
                                phone: currentUser?.phone.split('-'),
                            }}
                        >
                            <ProFormText width="md" name="username" label="用户名" />
                            <ProFormText
                                width="md"
                                name="name"
                                label="姓名"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入您的昵称!',
                                    },
                                ]}
                            />
                            <ProFormSelect
                                width="sm"
                                name="roles"
                                label="角色管理"
                                options={[
                                    {
                                        label: '管理员',
                                        value: 'manager',
                                    },
                                    {
                                        label: '超级管理员',
                                        value: 'superManager',
                                    },
                                ]}
                            />


                            <ProForm.Group title="所在省市" size={8}>
                                <ProFormSelect
                                    width="sm"
                                    fieldProps={{
                                        labelInValue: true,
                                    }}
                                    name="province"
                                    className={styles.item}
                                    request={async () => {
                                        const { data } = await apiQueryProvince();
                                        return data.map((item) => {
                                            return {
                                                label: item.provinceName,
                                                value: item.provinceCode,
                                            };
                                        });
                                    }}
                                />
                                <ProFormDependency name={['province']}>
                                    {({ province }) => {
                                        return (
                                            <ProFormSelect
                                                params={{
                                                    key: province?.value,
                                                }}
                                                name="city"
                                                fieldProps={{
                                                    labelInValue: true,
                                                }}
                                                width="sm"
                                                disabled={!province}
                                                className={styles.item}
                                                request={async () => {
                                                    if (!province?.key) {
                                                        return [];
                                                    }
                                                    const { data } = await apiQueryCity(province.key);
                                                    return data
                                                        .filter((item) => item.provinceCode === province.key)
                                                        .map((item) => {
                                                            return {
                                                                label: item.cityName,
                                                                value: item.cityCode,
                                                            };
                                                        });
                                                }}
                                            />
                                        );
                                    }}
                                </ProFormDependency>
                                <ProFormDependency name={['city']}>
                                    {({ city }) => {
                                        return (
                                            <ProFormSelect
                                                params={{
                                                    key: city?.value,
                                                }}
                                                name="district"
                                                width="sm"
                                                disabled={!city}
                                                className={styles.item}
                                                request={async () => {
                                                    if (!city?.key) {
                                                        return [];
                                                    }
                                                    const { data } = await apiQueryCounty();
                                                    return data
                                                        .filter((item) => item.cityCode === city.key)
                                                        .map((item) => {
                                                            return {
                                                                label: item.countyName,
                                                                value: item.countyCode,
                                                            };
                                                        });
                                                }}
                                            />
                                        );
                                    }}
                                </ProFormDependency>
                            </ProForm.Group>
                            <ProFormText width="md" name="address" label="详细地址" />
                            <ProFormFieldSet
                                name="phone"
                                label="联系电话"
                                rules={[{ validator: validatorPhone }]}
                            >
                                <Input className={styles.area_code} />
                                <Input className={styles.phone_number} />
                            </ProFormFieldSet>
                        </ProForm>
                    </div>
                    <div className={styles.right}>
                        <AvatarView avatar={getAvatarURL()} />
                    </div>
                </>
            )}
        </div>
    );
};

export default BaseView;

