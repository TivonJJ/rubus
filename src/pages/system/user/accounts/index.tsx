import React, { useRef } from 'react';
import { Radio, Button } from 'antd';
import RuTable, { RuColumns } from '@/components/RuTable';
import { Status } from '@/constants/account';
import { getAccounts } from '@/services/system';
import { PlusOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';

const Accounts:React.FC = ()=>{
    const columns:RuColumns[] = [
        {
            title: '状态',
            dataIndex: 'status',
            valueEnum: Status,
            initialValue: '',

            filters: true,
            renderFormItem:(_, { type, defaultRender, ...rest })=>{
                return (
                    <Radio.Group {...rest} className="button-radios">
                        <Radio value="">全部</Radio>
                        {Object.keys(Status).map(key=>(
                            <Radio key={key} value={key}>{Status[key].text}</Radio>
                        ))}
                    </Radio.Group>
                )
            }
        },
        {
            title: '登录账号',
            dataIndex: 'username',
            search: false,
            render:(dom,col)=>{
                return <a onClick={()=>console.log(col)}>{dom}</a>
            }
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
            render:()=>{
                return (
                    <a>111</a>
                )
            }
        },
    ]
    const formActionRef = useRef<FormInstance>()
    return (
        <div className="card-group">
            <RuTable
                headerTitle="账号列表"
                formRef={formActionRef}
                columns={columns}
                request={getAccounts}
                rowKey="user_id"
                toolBarRender={() => [
                    <Button key="3" icon={<PlusOutlined />} type="primary">
                        新建
                    </Button>,
                ]}
                options={{
                    search: { allowClear:true },
                }}
                form={{
                    onValuesChange: () => {
                        formActionRef.current?.submit();
                    },
                }}
                search={{
                    collapsed: false,
                    collapseRender: () => false,
                    optionRender: false,
                }}
            />
        </div>
    )
}

export default Accounts
