import React from 'react';
import { Card } from 'antd';
import AssociativeSelect from '@/components/AssociativeSelect';
import { getAccounts } from '@/pages/system/user/accounts/service';

export default () => {
    return (
        <Card bordered={false}>
            <AssociativeSelect
                request={getAccounts}
                style={{ width: 200 }}
                labelKey={'real_name'}
                valueKey={'user_id'}
            />
        </Card>
    );
};
