import React from 'react';
import { Card, Tag } from 'antd';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import type { ConnectProps } from '@/models/connect';
import type { Settings as ProSettings } from '@ant-design/pro-layout';
import styles from './index.less';
import type { AppSettings } from '../../../../config/defaultSettings';
import PaymentIcon from '@/components/PaymentIcon';

type PropsType = ConnectProps & {
    settings: ProSettings;
};

const Index: React.FC<PropsType> = ({ dispatch }) => {
    const setT = (st: Partial<AppSettings>) => {
        dispatch({
            type: 'settings/changeSetting',
            payload: st,
        });
    };
    const { umi_plugin_better_themeVar = [] } = window;
    const changeTheme = (theme?: any) => {
        setT({
            theme: theme?.key,
        });
    };
    return (
        <Card bordered={false}>
            <div>
                <Tag color={'#1890ff'} onClick={() => changeTheme()}>
                    默认
                </Tag>
                {umi_plugin_better_themeVar.map((item) => (
                    <Tag
                        key={item.key}
                        color={item.modifyVars?.['@primary-color']}
                        onClick={() => changeTheme(item)}
                    >
                        {item.key}
                    </Tag>
                ))}
            </div>
            <PaymentIcon code={'Alipay'} />
            <div className={'text-primary'}>Text Primary</div>
            <div className={styles.pr}>Primary</div>
        </Card>
    );
};

export default connect(({ settings }: ConnectState) => ({ settings }))(Index);
