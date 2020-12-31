import React, { useImperativeHandle, useMemo, useState } from 'react';
import { Form as AntForm, Input, Radio, Select, Switch } from 'antd';
import { connect, useIntl } from 'umi';
import type { ConnectProps, ConnectState } from '@/models/connect';
import { Types } from '@/constants/menu';
import FormItemInterceptor from '@/components/FormItemInterceptor';
import type { SysUserMenusModelState } from './model';
import GlobalLangInput from './GlobalLangInput';
import { IconMap } from '@/utils/menu';

type IConnectState = ConnectState & {
    sysUserMenusModel: SysUserMenusModelState;
};

export type IFormProps = {
    sysUserMenusModel: SysUserMenusModelState;
    wrappedComponentRef?: any;
} & ConnectProps;

export type IImperativeHandle = {
    validate: () => Promise<AnyObject>;
    syncForm2Store: () => void;
};

const Form: React.FC<IFormProps> = (props) => {
    const {
        sysUserMenusModel: { selectedMenu },
        wrappedComponentRef,
    } = props;
    const [form] = AntForm.useForm();
    const [dirty, setDirty] = useState<boolean>(false);
    const { formatMessage } = useIntl();
    const isSplitMenu = true;

    useImperativeHandle<any, IImperativeHandle>(wrappedComponentRef, () => ({
        validate: () => {
            return form.validateFields();
        },
        syncForm2Store: () => {
            if (!dirty) return;
            props.dispatch({
                type: 'sysUserMenusModel/updateMenu',
                payload: {
                    target: selectedMenu,
                    values: form.getFieldsValue(),
                },
            });
            setDirty(false);
        },
    }));

    useMemo(() => {
        if (selectedMenu) {
            form.resetFields();
            form.setFieldsValue(selectedMenu);
        } else {
            form.resetFields();
            setDirty(false);
        }
    }, [selectedMenu]);
    const onValuesChange = () => {
        setDirty(true);
        props.dispatch({
            type: 'sysUserMenusModel/updateState',
            payload: {
                menuChanged: true,
            },
        });
    };
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 18 },
        },
    };
    const currentLevel = selectedMenu?.dna.length;
    const requireIcon =
        form.getFieldValue('type') === 'StatusBar' || currentLevel === (isSplitMenu ? 2 : 1);
    return (
        <AntForm form={form} {...formItemLayout} onValuesChange={onValuesChange}>
            {selectedMenu && (
                <>
                    <AntForm.Item
                        label={formatMessage({ id: 'page.system.user.menu.form.type' })}
                        name={'type'}
                        rules={[{ required: true }]}
                        initialValue={'Folder'}
                    >
                        <Radio.Group>
                            {Object.keys(Types).map((type) => (
                                <Radio key={type} value={type}>
                                    {Types[type]}
                                </Radio>
                            ))}
                        </Radio.Group>
                    </AntForm.Item>
                    <AntForm.Item
                        label={formatMessage({ id: 'page.system.user.menu.form.name' })}
                        name={'name'}
                        rules={[{ required: true }]}
                    >
                        <GlobalLangInput
                            placeholder={formatMessage({
                                id: 'page.system.user.menu.form.name.placeholder',
                            })}
                        />
                    </AntForm.Item>
                    <AntForm.Item
                        label={formatMessage({ id: 'page.system.user.menu.form.path' })}
                        name={'path'}
                        rules={[{ required: true }]}
                    >
                        <Input
                            placeholder={formatMessage({
                                id: 'page.system.user.menu.form.path.placeholder',
                            })}
                        />
                    </AntForm.Item>
                    <AntForm.Item
                        label={formatMessage({ id: 'page.system.user.menu.form.icon' })}
                        name={'icon'}
                        rules={[{ required: requireIcon }]}
                    >
                        <Select
                            placeholder={formatMessage({
                                id: 'page.system.user.menu.form.icon.placeholder',
                            })}
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                                option?.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {Object.keys(IconMap).map((name) => {
                                const Icon = IconMap[name];
                                return (
                                    <Select.Option value={name} key={name}>
                                        <Icon /> {name}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </AntForm.Item>
                    <AntForm.Item
                        label={formatMessage({ id: 'page.system.user.menu.form.remark' })}
                        name={'description'}
                    >
                        <Input.TextArea
                            placeholder={formatMessage({
                                id: 'page.system.user.menu.form.remark.placeholder',
                            })}
                            allowClear
                        />
                    </AntForm.Item>
                    <AntForm.Item
                        label={formatMessage({ id: 'page.system.user.menu.form.status' })}
                        name={'status'}
                        valuePropName={'checked'}
                    >
                        <FormItemInterceptor pipes={FormItemInterceptor.Pipes.Bool2Number(1, 2)}>
                            <Switch />
                        </FormItemInterceptor>
                    </AntForm.Item>
                </>
            )}
        </AntForm>
    );
};

const ConnectedForm = connect(({ sysUserMenusModel }: IConnectState) => ({
    sysUserMenusModel,
}))(Form);

export default React.forwardRef((props, ref) => (
    <ConnectedForm {...props} wrappedComponentRef={ref} />
));
