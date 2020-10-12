import React, { useEffect } from 'react';
import { Card, Col, Row } from 'antd';
import { ConnectProps, ConnectState } from '@/models/connect';
import { connect } from 'umi';
import MenuTree from './tree';
import MenuForm from './form';

type PropsType = ConnectProps & {
    fetching?: boolean
}

const Menus:React.FC<PropsType> = (props)=>{
    const {
        fetching = false,
        dispatch
    } = props;
    useEffect(()=>{
        dispatch({
            type: 'sysUserMenusModel/fetchMenus'
        });
        return ()=>{
            dispatch({
                type: 'sysUserMenusModel/reset'
            })
        }
    },[]);
    return (
        <Card loading={fetching} bordered={false}>
            <Row gutter={12}>
                <Col md={12} sm={24}>
                    <MenuTree />
                </Col>
                <Col md={12} sm={24}>
                    <MenuForm />
                </Col>
            </Row>
        </Card>
    )
}

export default connect(({loading}:ConnectState)=>({
    fetching: loading.effects['sysUserMenusModel/fetchMenus']
}))(Menus);
