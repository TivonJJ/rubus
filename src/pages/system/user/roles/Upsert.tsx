import React from 'react';
import ProForm, { DrawerForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Form, message, Spin } from 'antd';
import { connect, useRequest } from 'umi';
import type { ConnectProps, ConnectState } from '@/models/connect';
import type { ResponseError } from '@/utils/request';
import { getRoleMenus } from './service';
import RoleTreeSelect from './RoleTreeSelect';
import type { SysAccountRolesModelState } from './model';
import { useIntl } from 'umi';

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
    const {formatMessage} = useIntl();
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
            title={formatMessage(
                { id: 'page.system.user.role.form.title' },
                { action: formatMessage({ id: `common.${data ? 'edit' : 'add'}` }) },
            )}
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
                    label={formatMessage({id:'page.system.user.role.form.roleCode'})}
                    rules={[
                        { required: true },
                        {
                            pattern: /^[a-z]([a-z]|[0-9]|-)+$/i,
                            message: formatMessage({id:'page.system.user.role.form.roleCode.matchMsg'}),
                        },
                    ]}
                    placeholder={formatMessage({id:'page.system.user.role.form.roleCode.placeholder'})}
                />
                <ProFormText
                    name={'role_name'}
                    label={formatMessage({id:'page.system.user.role.form.roleName'})}
                    rules={[{ required: true }]}
                />
                <Form.Item
                    label={formatMessage({id:'page.system.user.role.form.permissions'})}
                    name={'res_list'}
                    rules={[{ required: true }]}
                >
                    <RoleTreeSelect />
                </Form.Item>
                <ProFormTextArea
                    name={'description'}
                    label={formatMessage({id:'page.system.user.role.form.description'})}
                    placeholder={formatMessage({id:'page.system.user.role.form.description.placeholder'})}
                />
            </Spin>
        </DrawerForm>
    );
};

const ConnectedUpsert = connect(({ sysAccountRolesModel }: IConnectState) => ({
    sysAccountRolesModel,
}))(Upsert) as typeof Upsert;

export default ConnectedUpsert;
