import { LogoutOutlined } from '@ant-design/icons';
import { Avatar, Menu } from 'antd';
import React from 'react';
import type { ConnectProps} from 'umi';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import type { UserModel } from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export type GlobalHeaderRightProps = {
    currentUser?: UserModel;
} & Partial<ConnectProps>;

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
    onMenuClick = (event: {
        key: React.Key;
        keyPath: React.Key[];
        item: React.ReactInstance;
        domEvent: React.MouseEvent<HTMLElement>;
    }) => {
        const { key } = event;
        if (key === 'logout') {
            const { dispatch } = this.props;
            if (dispatch) {
                dispatch({
                    type: 'user/logout',
                });
            }
        }
    };

    render(): React.ReactNode {
        const {
            currentUser = {
                avatar: '',
                name: '',
            },
        } = this.props;
        const menuHeaderDropdown = (
            <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
                <Menu.Item key={"logout"}>
                    <LogoutOutlined />
                    退出登录
                </Menu.Item>
            </Menu>
        );
        return (
            <HeaderDropdown overlay={menuHeaderDropdown}>
                <div className={`${styles.action} ${styles.account}`}>
                    <Avatar size={"small"} className={styles.avatar} src={currentUser.avatar} alt={"avatar"} />
                    <span className={`${styles.name} anticon`}>{currentUser.name}</span>
                </div>
            </HeaderDropdown>
        );
    }
}

export default connect(({ user }: ConnectState) => ({
    currentUser: user.currentUser,
}))(AvatarDropdown as React.ComponentClass);
