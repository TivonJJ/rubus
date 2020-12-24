import type { Settings as ProSettings } from '@ant-design/pro-layout';
import React from 'react';
import type { ConnectProps} from 'umi';
import { connect, SelectLang } from 'umi';
import type { ConnectState } from '@/models/connect';
import Avatar from './Avatar';
import styles from './index.less';

export type GlobalHeaderRightProps = {
    theme?: ProSettings['navTheme'] | 'realDark';
} & Partial<ConnectProps> & Partial<ProSettings>;

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
