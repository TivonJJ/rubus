import React from 'react';
import { Button, Card } from 'antd';
import AssociativeSelect from '@/components/AssociativeSelect';
import { getAccounts } from '@/pages/system/user/accounts/service';
import RichTextEditor  from '@/components/RichText/RichTextEditor';

export default () => {
    return (
        <Card bordered={false}>
            <AssociativeSelect
                request={getAccounts}
                style={{ width: 200 }}
                labelKey={'real_name'}
                valueKey={'user_id'}
            />
            <RichTextEditor placeholder={'请输入'}  />
            <Button>C</Button>
        </Card>
    );
};
