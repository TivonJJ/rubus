import React, { useImperativeHandle } from 'react';
import { Form, Radio } from 'antd';
import { RoleStatus } from '@/constants/account';
import { useIntl } from 'umi';

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
    const {formatMessage} = useIntl();
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
            <Form.Item
                label={formatMessage({id:'page.system.user.role.search.status'})}
                name={"status"}
                initialValue={""}
            >
                <Radio.Group className={"button-radios"}>
                    <Radio value={""}>
                        {formatMessage({id:'page.system.user.role.search.status.all'})}
                    </Radio>
                    {Object.keys(RoleStatus).map(key=>(
                        <Radio key={key} value={key}>{RoleStatus[key]}</Radio>
                    ))}
                </Radio.Group>
            </Form.Item>
        </Form>
    );
});

export default Search;
