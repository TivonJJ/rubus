import React from 'react';
import { Card } from 'antd';
import AssociativeSelect from '@/components/AssociativeSelect';
import { getAccounts } from '@/services/systemAccounts';

export default () => {
    return (
        <Card bordered={false}>
            <AssociativeSelect request={getAccounts} style={{ width: 200 }} />
        </Card>
    );
};
