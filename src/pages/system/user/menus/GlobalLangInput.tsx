import React, { useState } from 'react';
import { Form, Input, Modal } from 'antd';
import { getLocale, useIntl } from 'umi';

const SupportedLangs = ['en-US', 'zh-CN'];

export type IGlobalLangInputProps = {
    value?: any;
    placeholder?: string;
    onChange?: (values: any) => void;
};

const GlobalLangInput: React.FC<IGlobalLangInputProps> = (props) => {
    const { value, onChange, placeholder } = props;
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
            <Input readOnly value={localValue} placeholder={placeholder} onClick={showModal} />
            <Modal
                title={formatMessage({ id: 'page.system.user.menu.form.name.prompt' })}
                visible={modalVisible}
                onCancel={hideModal}
                onOk={handleOk}
                maskClosable={false}
            >
                <Form form={form}>
                    {SupportedLangs.map((lang) => (
                        <Form.Item key={lang} label={lang} name={lang} rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    ))}
                </Form>
            </Modal>
        </>
    );
};

export default GlobalLangInput;
