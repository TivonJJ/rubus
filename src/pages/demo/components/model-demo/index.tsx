import React from 'react';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import type { DemoModelState } from './model';
import { Card } from 'antd';

export type TPageModelDemoConnectState = {
    demoModel: DemoModelState;
} & ConnectState;

export type TPageModelDemoProps = {
    demoModel: DemoModelState;
};

const Index: React.FC<TPageModelDemoProps> = (props) => {
    const { demoModel } = props;
    return (
        <Card>
            {demoModel.name}
            {demoModel.desc}
        </Card>
    );
};

export default connect(({ demoModel }: TPageModelDemoConnectState) => ({
    demoModel,
}))(Index);
