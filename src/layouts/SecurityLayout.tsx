import React from 'react';
import { Redirect, connect, ConnectProps } from 'umi';
import { stringify } from 'querystring';
import { ConnectState } from '@/models/connect';
import { UserModel }  from '@/models/user';

interface SecurityLayoutProps extends ConnectProps {
    currentUser?: UserModel;
}

class SecurityLayout extends React.Component<SecurityLayoutProps> {

    render() {
        const { children, currentUser } = this.props;
        const isLogin = !!currentUser;
        const queryString = stringify({
            redirect: window.location.href,
        });
        if (!isLogin) {
            return <Redirect to={`/user/login?${queryString}`} />;
        }
        return children;
    }
}

export default connect(({ user }: ConnectState) => ({
    currentUser: user.currentUser,
}))(SecurityLayout as React.ComponentClass<any>);
