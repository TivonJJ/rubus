import React, { useRef } from 'react';
import { Radio, Button } from 'antd';
import { useIntl } from 'umi';
import type { RuColumns, RuActionType } from '@/components/RuTable';
import RuTable from '@/components/RuTable';
import { Status } from '@/constants/account';
import { PlusOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd/lib/form';
import { getAccounts } from './service';
import Upsert from './Upsert';
import { ResetPassword, ChangeStatus, Remove } from './Operate';

const Accounts: React.FC = () => {
    const { formatMessage } = useIntl();
    const formRef = useRef<FormInstance>();
    const actionRef = useRef<RuActionType>();
    const refresh = () => {
        actionRef.current?.reload();
    };
    const columns: RuColumns[] = [
        {
            title: formatMessage({ id: 'page.system.accounts.table.column.status' }),
            dataIndex: 'status',
            width: 100,
            valueEnum: Status,
            initialValue: '',
            renderFormItem: (_, { type, defaultRender, ...rest }) => {
                return (
                    <Radio.Group {...rest}>
                        <Radio value={''}>
                            {formatMessage({ id: 'page.system.accounts.search.status.all' })}
                        </Radio>
                        {Object.keys(Status).map((key) => (
                            <Radio key={key} value={key}>
                                {Status[key].text}
                            </Radio>
                        ))}
                    </Radio.Group>
                );
            },
        },
        {
            title: formatMessage({ id: 'page.system.accounts.table.column.account' }),
            dataIndex: 'username',
            search: false,
            render: (dom, col) => {
                return (
                    <Upsert data={col} refresh={refresh}>
                        <a>{dom}</a>
                    </Upsert>
                );
            },
        },
        {
            title: formatMessage({ id: 'page.system.accounts.table.column.name' }),
            dataIndex: 'real_name',
            search: false,
        },
        {
            title: formatMessage({ id: 'page.system.accounts.table.column.role' }),
            dataIndex: 'role_name',
            search: false,
        },
        {
            title: formatMessage({ id: 'page.system.accounts.table.column.email' }),
            dataIndex: 'email',
            search: false,
        },
        {
            title: formatMessage({ id: 'page.system.accounts.table.column.operate' }),
            key: 'option',
            valueType: 'option',
            render: (value, col) => {
                return (
                    <div className={'link-group'}>
                        <ResetPassword data={col} refresh={refresh} />
                        <ChangeStatus data={col} refresh={refresh} />
                        <Remove data={col} refresh={refresh} />
                    </div>
                );
            },
        },
    ];
    return (
        <div className={'card-group'}>
            <RuTable
                headerTitle={formatMessage({ id: 'page.system.accounts.table.title' })}
                formRef={formRef}
                actionRef={actionRef}
                columns={columns}
                request={getAccounts}
                rowKey={'user_id'}
                toolBarRender={() => [
                    <Upsert key={'new'} refresh={refresh}>
                        <Button key={'3'} icon={<PlusOutlined />} type={'primary'}>
                            {formatMessage({ id: 'page.system.accounts.table.toolbar.new' })}
                        </Button>
                    </Upsert>,
                ]}
                options={{
                    search: {
                        allowClear: true,
                        placeholder: formatMessage({
                            id: 'page.system.accounts.table.search.placeholder',
                        }),
                    },
                }}
                form={{
                    onValuesChange: () => {
                        formRef.current?.submit();
                    },
                }}
                search={{
                    optionRender: false,
                }}
            />
        </div>
    );
};

export default Accounts;
