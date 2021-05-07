import React from 'react';
import ProForm, { DrawerForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { message } from 'antd';
import type { RoleType } from '@/pages/system/user/roles/model';
import { createAccount, getRoles, updateAccount } from './service';

export type UpsertProps = {
    data?: AnyObject;
    refresh: () => void;
};

const Upsert: React.FC<UpsertProps> = (props) => {
    const { children, data, refresh } = props;
    const [form] = ProForm.useForm();
    const onVisibleChange = (visible: boolean) => {
        if (visible && data) {
            form.setFieldsValue(data);
        }
    };
    const onFinish = (values: AnyObject) => {
        const action = values.user_id ? updateAccount : createAccount;
        return action(values).then(
            () => {
                refresh();
                return true;
            },
            (err) => {
                message.error(err.message);
            },
        );
    };
    return (
        <DrawerForm
            title={`${data ? '修改' : '新增'}用户`}
            onFinish={onFinish}
            trigger={children as JSX.Element}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            form={form}
            onVisibleChange={onVisibleChange}
            drawerProps={{
                getContainer: document.body,
                width: 500,
                destroyOnClose: true,
            }}
        >
            <ProFormText hidden name={'user_id'} />
            <ProFormText
                name={'username'}
                label={'登录账号'}
                rules={[{ required: true }]}
                placeholder={'请输入手机号作为登录账号'}
            />
            <ProFormText
                name={'real_name'}
                label={'姓名'}
                rules={[{ required: true }]}
                placeholder={'用户姓名'}
            />
            <ProFormSelect
                name={'role_id'}
                label={'角色'}
                rules={[{ required: true }]}
                placeholder={'请选择'}
                request={() =>
                    getRoles().then((res) =>
                        res.data.map((item: RoleType) => ({
                            label: item.role_name,
                            value: item.role_id,
                        })),
                    )
                }
            />
            <ProFormText name={'email'} label={'邮箱'} placeholder={'用户电子邮箱地址'} />
        </DrawerForm>
    );
};

export default Upsert;
