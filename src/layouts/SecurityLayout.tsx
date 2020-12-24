import React from 'react';
import type { ConnectProps } from 'umi';
import { Redirect, connect } from 'umi';
import { stringify } from 'querystring';
import type { ConnectState } from '@/models/connect';
import type { UserModel } from '@/models/user';

type SecurityLayoutProps = {
    currentUser?: UserModel;
} & ConnectProps;

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
}))(SecurityLayout);
