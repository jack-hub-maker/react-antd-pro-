/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: xingyingjie
 * @Date: 2021-10-03 22:53:02
 * @LastEditors: xingyingjie
 * @LastEditTime: 2021-10-03 23:14:28
 */
import React from 'react'
import { Card } from 'antd';
import ProCard from '@ant-design/pro-card';

const index = () => {
    return (
        <div>
            <ProCard split="vertical">
                <ProCard title="左侧详情" colSpan="30%">
                    小杰测试1
                </ProCard>
                <ProCard title="左侧详情2" colSpan="70%">
                    小杰测试2
                </ProCard>
            </ProCard>
        </div>
    )
}

export default index
