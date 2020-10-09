import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect, connect, ConnectProps } from 'umi';
import { stringify } from 'querystring';
import { ConnectState } from '@/models/connect';
import { UserModel }  from '@/models/user';

interface SecurityLayoutProps extends ConnectProps {
    currentUser?: UserModel;
}

interface SecurityLayoutState {
    isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
    state: SecurityLayoutState = {
        isReady: false,
    };

    componentDidMount() {
        this.setState({
            isReady: true,
        });
    }

    render() {
        const { isReady } = this.state;
        const { children, currentUser } = this.props;
        const isLogin = !!currentUser;
        console.log(isLogin);
        const queryString = stringify({
            redirect: window.location.href,
        });
        if (!isLogin || !isReady) {
            return <PageLoading />;
        }
        if (!isLogin && window.location.pathname !== '/user/login') {
            return <Redirect to={`/user/login?${queryString}`} />;
        }
        return children;
    }
}

export default connect(({ user }: ConnectState) => ({
    currentUser: user.currentUser,
}))(SecurityLayout as React.ComponentClass<any>);
