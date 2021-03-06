import React, { useEffect, useRef } from 'react';
import { Card, Col, Row, Spin } from 'antd';
import { connect, useIntl } from 'umi';
import type { ConnectProps, ConnectState } from '@/models/connect';
import { removeEmptyProperties } from '@/utils/utils';
import type { SearchRef } from './Search';
import Search from './Search';
import type { RoleType, SysAccountRolesModelState } from './model';
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
    const { formatMessage } = useIntl();
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
        <Spin spinning={fetching}>
            <div className={'card-group'}>
                <Card>
                    <Search onSearch={fetch} ref={searchRef} />
                </Card>
                <Card bordered={false}>
                    <div className={styles.total}>
                        {formatMessage(
                            { id: 'page.system.user.role.table.title' },
                            { total: roles.length },
                        )}
                    </div>
                    <Row gutter={16}>
                        <Col span={8}>
                            <RoleItem refresh={refresh} />
                        </Col>
                        {roles.map((role: RoleType) => (
                            <Col span={8} key={role.role_id}>
                                <RoleItem role={role} refresh={refresh} />
                            </Col>
                        ))}
                    </Row>
                </Card>
            </div>
        </Spin>
    );
};

export default connect(({ loading, sysAccountRolesModel }: IConnectState) => ({
    fetching: loading.effects['sysAccountRolesModel/fetch'],
    sysAccountRolesModel,
}))(Roles);
