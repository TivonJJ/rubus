import React from 'react';
import { Button, Card } from 'antd';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import type { ConnectProps } from '@/models/connect';
import type { Settings as ProSettings } from '@ant-design/pro-layout';
import { SettingDrawer } from '@ant-design/pro-layout';
import styles from './index.less';

type PropsType = ConnectProps & {
    settings: ProSettings;
};

const Index: React.FC<PropsType> = ({ settings, dispatch }) => {
    const onSettingChange = (ns: ProSettings) => {
        console.log(ns);
        dispatch({
            type: 'settings/changeSetting',
            payload: ns,
        });
    };
    const setT = () => {
        dispatch({
            type: 'settings/changeSetting',
            payload: {
                primaryColor: 'dust',
            },
        });
    };
    return (
        <Card bordered={false}>
            <div className={'text-primary'}>Text Primary</div>
            <div className={styles.pr}>Primary</div>
            <Button type={'primary'} onClick={setT}>
                更换配置
            </Button>
            <SettingDrawer settings={settings} onSettingChange={onSettingChange} />
        </Card>
    );
};

export default connect(({ settings }: ConnectState) => ({ settings }))(Index);
