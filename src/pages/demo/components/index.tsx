import React  from 'react';
import { Button, Card, Form } from 'antd';
import RichTextEditor from '@/components/RichText/RichTextEditor';
import JSONEditor  from '@/components/JSONEditor';

const Index = () => {
    const [form] = Form.useForm();
    const test = ()=>{
        const values = form.getFieldsValue();
        console.log(values);
    }
    return (
        <Card bordered={false}>
            <Form form={form}>
                <Form.Item label={'富文本输入'} name={'richText'}>
                    <RichTextEditor />
                </Form.Item>
                <Form.Item label={'JSON'} name={'json'} initialValue={{json:'ccc'}}>
                    <JSONEditor />
                </Form.Item>
            </Form>
            <Button onClick={test}>Test</Button>
            <Button onClick={()=>{
                form.setFieldsValue({json:{date:Date.now()}})
            }}>Set</Button>
            <Button onClick={()=>{
                form.setFieldsValue({json:{date2:Date.now()}})
            }}>Set2</Button>
        </Card>
    );
};

export default Index
