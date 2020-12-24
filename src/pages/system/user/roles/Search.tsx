import React, { useImperativeHandle } from 'react';
import { Form, Radio } from 'antd';
import { RoleStatus } from '@/constants/account';

export type FormValues = {
    status?: number | string
};

type SearchProps = {
    onSearch: (values: FormValues) => void,
    ref?: any
};

export type SearchRef = {
    getValues: () => FormValues
};

const Search: React.FC<SearchProps> = React.forwardRef((props,ref)=>{
    const [form] = Form.useForm();
    const onValuesChange = (changed: FormValues,values: FormValues)=>{
        props.onSearch(values);
    };
    useImperativeHandle(ref,()=>({
        getValues(){
            return form.getFieldsValue();
        }
    } as SearchRef));
    return (
        <Form<FormValues> form={form} onValuesChange={onValuesChange}>
            <Form.Item label={"状态"} name={"status"} initialValue={""}>
                <Radio.Group className={"button-radios"}>
                    <Radio value={""}>全部</Radio>
                    {Object.keys(RoleStatus).map(key=>(
                        <Radio key={key} value={key}>{RoleStatus[key]}</Radio>
                    ))}
                </Radio.Group>
            </Form.Item>
        </Form>
    );
});

export default Search;
