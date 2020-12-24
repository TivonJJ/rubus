import React, { useRef } from 'react';
import { Radio, Button } from 'antd';
import type { RuColumns, RuActionType } from '@/components/RuTable';
import RuTable from '@/components/RuTable';
import { Status } from '@/constants/account';
import { PlusOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd/lib/form';
import { getAccounts } from './service';
import Upsert from './Upsert';
import { ResetPassword, ChangeStatus, Remove } from './Operate';

const Accounts: React.FC = () => {
    const formRef = useRef<FormInstance>();
    const actionRef = useRef<RuActionType>();
    const refresh = () => {
        actionRef.current?.reload();
    };
    const columns: RuColumns[] = [
        {
            title: '状态',
            dataIndex: 'status',
            width: 100,
            valueEnum: Status,
            initialValue: '',
            renderFormItem: (_, { type, defaultRender, ...rest }) => {
                return (
                    <Radio.Group {...rest} className={'button-radios'}>
                        <Radio value={''}>全部</Radio>
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
            title: '登录账号',
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
            title: '姓名',
            dataIndex: 'real_name',
            search: false,
        },
        {
            title: '平台角色',
            dataIndex: 'role_name',
            search: false,
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            search: false,
        },
        {
            title: '操作',
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
                headerTitle={'账号列表'}
                formRef={formRef}
                actionRef={actionRef}
                columns={columns}
                request={getAccounts}
                rowKey={'user_id'}
                toolBarRender={() => [
                    <Upsert key={'new'} refresh={refresh}>
                        <Button key={'3'} icon={<PlusOutlined />} type={'primary'}>
                            新建
                        </Button>
                    </Upsert>,
                ]}
                options={{
                    search: { allowClear: true, placeholder: '关键词查找' },
                }}
                form={{
                    onValuesChange: () => {
                        formRef.current?.submit();
                    },
                }}
            />
        </div>
    );
};

export default Accounts;
