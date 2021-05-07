import React, { useState } from 'react';
import { Form, Input, Modal } from 'antd';
import { getAllLocales, getLocale, useIntl } from 'umi';

export type IGlobalLangInputProps = {
    value?: any;
    placeholder?: string;
    onChange?: (values: any) => void;
    required?: boolean;
    disabled?: boolean;
};

/**
 * 国际化多语言输入框
 * 自动根据当前配置的语言生成多个输入框，返回JSON格式
 * @param props
 * @constructor
 */
const GlobalLangInput: React.FC<IGlobalLangInputProps> = (props) => {
    const { value, onChange, placeholder, required, disabled } = props;
    const supportLocals = getAllLocales();
    const { formatMessage } = useIntl();
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState<boolean>();
    const localValue = value ? value[getLocale()] : '';
    const showModal = () => {
        setModalVisible(true);
        if (value) form.setFieldsValue(value);
    };
    const hideModal = () => {
        setModalVisible(false);
        form.resetFields();
    };
    const handleOk = () => {
        form.validateFields().then((values) => {
            if (onChange) onChange(values);
            hideModal();
        });
    };
    return (
        <>
            <Input
                readOnly
                disabled={disabled}
                value={localValue}
                placeholder={placeholder}
                onClick={showModal}
            />
            <Modal
                title={formatMessage({ id: 'components.globalLangInput.title' })}
                visible={modalVisible}
                onCancel={hideModal}
                onOk={handleOk}
                maskClosable={false}
            >
                <Form form={form}>
                    {supportLocals.map((lang) => (
                        <Form.Item key={lang} label={lang} name={lang} rules={[{ required }]}>
                            <Input />
                        </Form.Item>
                    ))}
                </Form>
            </Modal>
        </>
    );
};

export default GlobalLangInput;
