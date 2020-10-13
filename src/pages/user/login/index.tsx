import React, { useEffect, useState } from 'react';
import { Form, Input, Card, Alert, Checkbox, Button } from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import { ConnectProps, ConnectState } from '@/models/connect';
import {UserModel} from "@/models/user";
import {connect, history} from "umi";
import logo from '@/assets/login-logo.png';
import { getFirstAccessibleMenu } from '@/utils/menu';
import styles from './style.less';

export interface LoginFormProps extends ConnectProps{
    currentUser?: UserModel
    logging?: boolean
}

const LoginForm: React.FC<LoginFormProps> = (props) => {
    const [form] = Form.useForm();
    const [error, setError] = useState<string>();
    const [isCatchUserAcc, setIsCatchUserAcc] = useState<boolean>();

    useEffect(()=>{
        let lastUser = localStorage.getItem('last-login-user');
        if(lastUser){
            lastUser = JSON.parse(lastUser);
            form.setFieldsValue(lastUser);
            setIsCatchUserAcc(true);
        }
    },[])

    const login = (values:any) => {
        props.dispatch({
            type: 'user/login',
            payload: values,
        }).then((user: UserModel) => {
            if(isCatchUserAcc){
                localStorage.setItem('last-login-user',JSON.stringify({
                    username: values.username,
                    password: values.password,
                }))
            }else {
                localStorage.removeItem('last-login-user')
            }
            const target = getFirstAccessibleMenu(user.menu||[],user.defaultRouteMenuId);
            const to = target ? target.path : '/';
            history.replace(to);
        }, (err: ErrorEvent) => {
            err.preventDefault();
            setError(err.message);
        });
    };

    return (
        <Card bordered={false} className={styles.container}>
            <img className={styles.logo} src={logo} alt='logo'/>
            <Form form={form} onFinish={login} className={styles.loginForm} size="large">
                {error ?
                    <Alert message={error} type="error" className={styles.error} showIcon />
                    :
                    null
                }
                <Form.Item
                    name="username"
                    rules={[{required: true, message: '请输入账号'}]}
                >
                    <Input placeholder="登录名" prefix={<UserOutlined />} />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{required: true, message: '请输入密码'}]}
                >
                    <Input type="password" placeholder="密码" prefix={<LockOutlined />} />
                </Form.Item>
                <div className="margin-sm_bottom">
                    <Checkbox
                        checked={isCatchUserAcc}
                        onChange={e=>{setIsCatchUserAcc(e.target.checked)}}
                    >
                        记住密码
                    </Checkbox>
                </div>
                <Form.Item>
                    <Button type="primary" loading={props.logging} block htmlType="submit">登录</Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default connect(({user, loading}: ConnectState) => ({
    currentUser: user.currentUser,
    logging: loading.effects['user/login']
}))(LoginForm as React.FC);
