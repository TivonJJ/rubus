import React, { useEffect, useImperativeHandle, useState } from 'react';
import { Form as AntForm, Input, Radio, Select, Switch } from 'antd';
import { connect } from 'umi';
import { ConnectProps, ConnectState } from '@/models/connect';
import { IconMap, Types } from '@/constants/menu';
import { SysUserMenusModelState } from './model';
import GlobalLangInput from './GlobalLangInput';

type IConnectState = ConnectState & {
    sysUserMenusModel: SysUserMenusModelState
};

export interface FormProps extends ConnectProps{
    sysUserMenusModel: SysUserMenusModelState,
    wrappedComponentRef?: any,
}

const Form:React.FC<FormProps>=(props)=>{
    const {sysUserMenusModel:{selectedMenu},wrappedComponentRef} = props;
    const [form] = AntForm.useForm();
    const [dirty,setDirty] = useState<boolean>();

    useImperativeHandle(wrappedComponentRef,()=>({
        validate:()=>{
            return form.validateFields();
        },
        syncForm2Store:()=> {
            if(!dirty)return;
            props.dispatch({
                type: 'sysUserMenusModel/updateMenu',
                payload: {
                    target: selectedMenu,
                    values: form.getFieldsValue()
                }
            });
            setDirty(false)
        }
    }));

    useEffect(()=>{
        if(selectedMenu){
            form.resetFields();
            form.setFieldsValue({
                ...selectedMenu,
                status: selectedMenu.status == 1
            });
        }else {
            form.resetFields();
            setDirty(false)
        }
    },[selectedMenu])
    const onValuesChange=()=>{
        setDirty(true);
        props.dispatch({
            type: 'sysUserMenusModel/updateState',
            payload:{
                menuChanged: true
            }
        })
    }
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 }
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 18 }
        }
    };
    return (
        <AntForm
            form={form}
            {...formItemLayout}
            onValuesChange={onValuesChange}
        >
            {selectedMenu&&
                <>
                    <AntForm.Item
                        label="类型"
                        name="type"
                        rules={[{required:true}]}
                        initialValue="Folder"
                    >
                        <Radio.Group>
                            {Object.keys(Types).map(type=>(
                                <Radio key={type} value={type}>
                                    {Types[type]}
                                </Radio>
                            ))}
                        </Radio.Group>
                    </AntForm.Item>
                    <AntForm.Item
                        label="名称"
                        name="name"
                        rules={[{required:true}]}
                    >
                        <GlobalLangInput placeholder="资源名称、菜单标题"/>
                    </AntForm.Item>
                    <AntForm.Item
                        label="资源地址"
                        name="path"
                        rules={[{required:true}]}
                    >
                        <Input placeholder="当前资源的相对地址"/>
                    </AntForm.Item>
                    <AntForm.Item
                        label="图标"
                        name="icon"
                    >
                        <Select
                            placeholder="选择资源的图标，菜单图标会展示在名字上"
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                                option?.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {Object.keys(IconMap).map(name=> {
                                const Icon = IconMap[name];
                                return (
                                    <Select.Option value={name} key={name}>
                                        <Icon/> {name}
                                    </Select.Option>
                                )
                            })}
                        </Select>
                    </AntForm.Item>
                    <AntForm.Item
                        label="备注"
                        name="description"
                    >
                        <Input.TextArea placeholder="自定义备注信息" allowClear/>
                    </AntForm.Item>
                    <AntForm.Item
                        label="启用"
                        name="status"
                        valuePropName="checked"
                    >
                        <Switch/>
                    </AntForm.Item>
                </>
            }
        </AntForm>
    )
}

const ConnectedForm = connect(({sysUserMenusModel}: IConnectState) => ({
    sysUserMenusModel,
}))(Form);

export default React.forwardRef((props, ref) => <ConnectedForm {...props} wrappedComponentRef={ref} />);
