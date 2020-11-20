import React, { useEffect, useRef } from 'react';
import { Card, Col, Row, Spin } from 'antd';
import { connect } from 'umi';
import { ConnectProps, ConnectState } from '@/models/connect';
import { removeEmptyProperties } from '@/utils/utils';
import Search, { SearchRef } from './Search';
import { SysAccountRolesModelState } from './model';
import RoleItem from './RoleItem';
import styles from './style.less';

type IConnectState = ConnectState & {
    sysAccountRolesModel: SysAccountRolesModelState;
};

type PropsType = ConnectProps & {
    sysAccountRolesModel: SysAccountRolesModelState;
    fetching?: boolean;
    saving?: boolean;
};

const Roles: React.FC<PropsType> = (props) => {
    const {
        dispatch,
        sysAccountRolesModel: { roles },
        fetching,
    } = props;
    const searchRef = useRef<SearchRef>();
    const fetch = (params?: AnyObject) => {
        dispatch({
            type: 'sysAccountRolesModel/fetch',
            payload: removeEmptyProperties(params || {}),
        });
    };
    useEffect(() => {
        fetch();
    }, []);
    const refresh = () => {
        fetch(searchRef.current?.getValues());
    };
    return (
        <Card bordered={false}>
            <Spin spinning={fetching}>
                <Search onSearch={fetch} ref={searchRef} />
                <div className={styles.total}>共 {roles.length} 条记录</div>
                <Row gutter={16}>
                    <Col span={8}>
                        <RoleItem refresh={refresh} />
                    </Col>
                    {roles.map((role) => (
                        <Col span={8} key={role.role_id}>
                            <RoleItem role={role} refresh={refresh} />
                        </Col>
                    ))}
                </Row>
            </Spin>
        </Card>
    );
};

export default connect(({ loading, sysAccountRolesModel }: IConnectState) => ({
    fetching: loading.effects['sysAccountRolesModel/fetch'],
    sysAccountRolesModel,
}))(Roles);
