import React from 'react';
import ProForm, { DrawerForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Form, message, Spin } from 'antd';
import { connect, useRequest } from 'umi';
import type { ConnectProps, ConnectState } from '@/models/connect';
import type { ResponseError } from '@/utils/request';
import { getRoleMenus } from './service';
import RoleTreeSelect from './RoleTreeSelect';
import type { SysAccountRolesModelState } from './model';

type IConnectState = ConnectState & {
    sysAccountRolesModel: SysAccountRolesModelState;
};

type IUpsertProps = {
    data?: AnyObject;
    refresh: () => void;
    sysAccountRolesModel?: SysAccountRolesModelState;
} & ConnectProps;

const Upsert: React.FC<IUpsertProps> = (props) => {
    const { children, data, refresh } = props;
    const [form] = ProForm.useForm();
    const { run: fetchRoleMenus, loading: fetchingRoles = false } = useRequest(getRoleMenus, {
        manual: true,
        throwOnError: true,
    });
    const submit = (values: AnyObject) => {
        return props
            .dispatch({
                type: 'sysAccountRolesModel/upsert',
                payload: values,
            })
            .then(
                () => {
                    refresh();
                    return true;
                },
                (err: ResponseError) => {
                    err.preventDefault();
                    message.error(err.message);
                },
            );
    };
    const onVisibleChange = (visible: boolean) => {
        if (visible) {
            if (data) {
                fetchRoleMenus(data.role_id).then(
                    (resList: any[]) => {
                        data.res_list = resList.map((item) => item.res_id);
                        form.setFieldsValue(data);
                    },
                    (err) => {
                        message.error(err.message);
                    },
                );
            }
        } else {
            // form.resetFields()
        }
    };
    return (
        <DrawerForm
            trigger={children}
            onFinish={submit}
            title={`${data ? '编辑' : '新增'}角色`}
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
            <Spin spinning={fetchingRoles}>
                <ProFormText hidden name={'role_id'} />
                <ProFormText
                    name={'role_type'}
                    label={'角色编码'}
                    rules={[
                        { required: true },
                        {
                            pattern: /^[a-z]([a-z]|[0-9]|-)+$/i,
                            message: '只能2位以上包含字母数字和-,且第一位不能是数字',
                        },
                    ]}
                    placeholder={'角色编码不能重复，将根据编码识别角色'}
                />
                <ProFormText
                    name={'role_name'}
                    label={'角色名'}
                    rules={[{ required: true }]}
                    placeholder={'请输入角色名称'}
                />
                <Form.Item label={'权限列表'} name={'res_list'} rules={[{ required: true }]}>
                    <RoleTreeSelect />
                </Form.Item>
                <ProFormTextArea name={'description'} label={'描述'} placeholder={'附加描述信息'} />
            </Spin>
        </DrawerForm>
    );
};

const ConnectedUpsert = connect(({ sysAccountRolesModel }: IConnectState) => ({
    sysAccountRolesModel,
}))(Upsert) as typeof Upsert;

export default ConnectedUpsert;
