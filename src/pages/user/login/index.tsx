import React, { useEffect, useState } from 'react';
import { Form, Input, Card, Alert, Checkbox, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import type { ConnectProps, ConnectState } from '@/models/connect';
import type { UserModel } from '@/models/user';
import { connect, history, useIntl } from 'umi';
import logo from '@/assets/login-logo.png';
import { getMenuById } from '@/utils/menu';
import styles from './style.less';

export type LoginFormProps = {
    currentUser?: UserModel;
    logging?: boolean;
} & ConnectProps;

const LoginForm: React.FC<LoginFormProps> = (props) => {
    const [form] = Form.useForm();
    const [error, setError] = useState<string>();
    const [isCacheUserAcc, setIsCacheUserAcc] = useState<boolean>(false);
    const { formatMessage } = useIntl();

    useEffect(() => {
        let lastUser = localStorage.getItem('last-login-user');
        if (lastUser) {
            lastUser = JSON.parse(lastUser);
            form.setFieldsValue(lastUser);
            setIsCacheUserAcc(true);
        }
    }, []);

    const login = (values: any) => {
        props
            .dispatch({
                type: 'user/login',
                payload: values,
            })
            .then(
                (user: UserModel) => {
                    if (isCacheUserAcc) {
                        localStorage.setItem(
                            'last-login-user',
                            JSON.stringify({
                                username: values.username,
                                password: values.password,
                            }),
                        );
                    } else {
                        localStorage.removeItem('last-login-user');
                    }
                    const target = user.defaultRouteMenuId
                        ? getMenuById(user.menu || [], user.defaultRouteMenuId)
                        : null;
                    const to = target?.path || '/';
                    history.replace(to);
                },
                (err: ErrorEvent) => {
                    err.preventDefault();
                    setError(err.message);
                },
            );
    };

    return (
        <Card bordered={false} className={styles.container}>
            <img className={styles.logo} src={logo} alt={'logo'} />
            <Form form={form} onFinish={login} className={styles.loginForm} size={'large'}>
                {error ? (
                    <Alert message={error} type={'error'} className={styles.error} showIcon />
                ) : null}
                <Form.Item
                    name={'username'}
                    label={formatMessage({ id: 'page.user.login.username' })}
                    rules={[{ required: true }]}
                >
                    <Input
                        placeholder={formatMessage({ id: 'page.user.login.username' })}
                        prefix={<UserOutlined />}
                    />
                </Form.Item>
                <Form.Item
                    name={'password'}
                    label={formatMessage({ id: 'page.user.login.password' })}
                    rules={[{ required: true }]}
                >
                    <Input
                        type={'password'}
                        placeholder={formatMessage({ id: 'page.user.login.password' })}
                        prefix={<LockOutlined />}
                    />
                </Form.Item>
                <div className={'margin-sm_bottom'}>
                    <Checkbox
                        checked={isCacheUserAcc}
                        onChange={(e) => {
                            setIsCacheUserAcc(e.target.checked);
                        }}
                    >
                        {formatMessage({ id: 'page.user.login.rememberPassword' })}
                    </Checkbox>
                </div>
                <Form.Item>
                    <Button type={'primary'} loading={props.logging} block htmlType={'submit'}>
                        {formatMessage({ id: 'page.user.login.sign' })}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default connect(({ user, loading }: ConnectState) => ({
    currentUser: user.currentUser,
    logging: loading.effects['user/login'],
}))(LoginForm);
