import React, { useState, useRef } from 'react';
import { Form, Input, Card, Alert, Checkbox } from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import { ConnectProps, ConnectState } from '@/models/connect';
import {UserModel} from "@/models/user";
import {connect, history} from "umi";
import logo from '@/assets/login-logo.png';
import { getVerifyImage, validateVerifyImage } from '@/services/user';
import Slide2Verify from '@/components/Slide2Verify';
import styles from './style.less';

export interface LoginFormProps extends ConnectProps{
    currentUser?: UserModel
    logging?: boolean
}

const LoginForm: React.FC<LoginFormProps> = (props) => {
    const [form] = Form.useForm();
    const [error, setError] = useState<String>();
    const [catchUsername, setCatchUsername] = useState<boolean>();
    const verifySliderRef = useRef<any>();

    const login = (verifyData: any) => {
        form.validateFields().then(values=>{
            props.dispatch({
                type: 'user/login',
                payload: {
                    ...verifyData,
                    ...values,
                }
            }).then((user:UserModel) => {
                history.replace('/')
            }, (err: ErrorEvent) => {
                err.preventDefault();
                setError(err.message);
            })
        },(err:ErrorEvent)=>{
            setError(err.message)
            verifySliderRef.current.reset();
        })
    };

    const fetchVerifyImage = ()=>{
        return getVerifyImage().then(data=>{
            return {
                bg: `data:image/png;base64,${data.bg_image}`,
                slider: `data:image/png;base64,${data.slider_image}`,
                y:data.y,
                key:data.key
            };
        });
    }

    return (
        <Card bordered={false} className={styles.container}>
            <img className={styles.logo} src={logo} alt='logo'/>
            <Form form={form} className={styles.loginForm} size="large">
                {error ?
                    <Alert message={error} type="error" className={styles.error} />
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
                <div className="gutter-bottom">
                    <Checkbox checked={catchUsername} onChange={e=>{
                        setCatchUsername(e.target.checked)
                    }}>
                        记住密码
                    </Checkbox>
                </div>
                <Form.Item>
                    <Slide2Verify
                        ref={verifySliderRef}
                        prefetch={false}
                        onFetch={fetchVerifyImage}
                        onSuccess={login}
                        onCheck={validateVerifyImage}
                    />
                </Form.Item>
            </Form>
        </Card>
    );
};

export default connect(({user, loading}: ConnectState) => ({
    currentUser: user.currentUser,
    logging: loading.effects['user/login']
}))(LoginForm as React.FC);
