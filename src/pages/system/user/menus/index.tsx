import React, { useEffect, useRef } from 'react';
import { Card, Col, message, Row, Spin } from 'antd';
import { ConnectProps, ConnectState } from '@/models/connect';
import { connect } from 'umi';
import { MenuItem } from '@/utils/menu';
import MenuTree from './Tree';
import MenuForm from './Form';
import Toolbar from './Toolbar';

type PropsType = ConnectProps & {
    fetching?: boolean
    saving?: boolean
}

const Menus:React.FC<PropsType> = (props)=>{
    const {
        fetching = false,
        saving = false,
        dispatch
    } = props;
    const formRef = useRef<any>();
    const fetchMenus=()=>{
        dispatch({
            type: 'sysUserMenusModel/fetchMenus'
        });
    }
    useEffect(()=>{
        fetchMenus();
        return ()=>{
            dispatch({
                type: 'sysUserMenusModel/reset'
            })
        }
    },[]);
    const onTreeSelect=(menu:MenuItem)=>{
        formRef.current.validate().then(()=>{
            formRef.current.syncForm2Store();
            props.dispatch({
                type: 'sysUserMenusModel/selectMenu',
                payload: menu
            })
        },()=>{
            message.error('表单数据有误')
        })
    }
    const onSave=()=>{
        formRef.current.validate().then(()=>{
            formRef.current.syncForm2Store();
            props.dispatch({
                type: 'sysUserMenusModel/save',
            }).then(()=>{
                fetchMenus();
            })
        },()=>{
            message.error('表单数据有误')
        })
    }
    return (
        <Card bordered={false}>
            <Spin spinning={fetching || saving}>
                <Toolbar onSave={onSave} />
                <Row gutter={12}>
                    <Col md={12} sm={24}>
                        <MenuTree onSelect={onTreeSelect} />
                    </Col>
                    <Col md={12} sm={24}>
                        <MenuForm ref={formRef} />
                    </Col>
                </Row>
            </Spin>
        </Card>
    )
}

export default connect(({loading}:ConnectState)=>({
    fetching: loading.effects['sysUserMenusModel/fetchMenus'],
    saving: loading.effects['sysUserMenusModel/save'],
}))(Menus);
