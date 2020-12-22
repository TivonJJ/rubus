import React, { useRef } from 'react';
import { Button, Card, Form } from 'antd';
import Uploader from '@/components/Uploader';
import MoneyFormatter from '@/components/Formatter/MoneyFormatter';

const Index = () => {
    const [form] = Form.useForm();
    const ref = useRef();
    const test = () => {
        const values = form.getFieldsValue();
        console.log(values);
    };
    return (
        <Card bordered={false}>
            <Form form={form}>
                <Form.Item label={'上传'} name={'file'}>
                    <Uploader.ImageUploader ref={ref} multiple maxQuantity={3} />
                </Form.Item>
                <Uploader>
                    <Button>非受控上传</Button>
                </Uploader>
            </Form>
            <Button onClick={test}>GET</Button>
            <MoneyFormatter value={1234121.32718891} />
            <Button
                onClick={() => {
                    form.setFieldsValue({ file: ['a', 'b'] });
                }}
            >
                SET
            </Button>
        </Card>
    );
};

export default Index;
