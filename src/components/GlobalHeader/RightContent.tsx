import { Settings as ProSettings } from '@ant-design/pro-layout';
import React from 'react';
import { connect, ConnectProps, SelectLang } from 'umi';
import { ConnectState } from '@/models/connect';
import Avatar from './AvatarDropdown';
import styles from './index.less';

export interface GlobalHeaderRightProps extends Partial<ConnectProps>, Partial<ProSettings> {
    theme?: ProSettings['navTheme'] | 'realDark';
}

const GlobalHeaderRight: React.FC<GlobalHeaderRightProps> = (props) => {
    const { theme, layout } = props;
    let className = styles.right;

    if (theme === 'dark' && layout === 'top') {
        className = `${styles.right}  ${styles.dark}`;
    }

    return (
        <div className={className}>
            <Avatar />
            <SelectLang className={styles.action} />
        </div>
    );
};

export default connect(({ settings }: ConnectState) => ({
    theme: settings.navTheme,
    layout: settings.layout,
}))(GlobalHeaderRight);
