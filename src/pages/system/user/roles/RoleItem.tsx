import { Card, Col, message, Modal, Row, Switch } from 'antd';
import React from 'react';
import { UserSwitchOutlined, PlusOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { delRole, setRoleStatus } from '@/services/systemAccounts';
import { RoleType } from './model';
import styles from './style.less';
import Upsert from './Upsert';
import AssignAccounts from './AssignAccounts';

interface RoleItemPropTypes {
    role?: RoleType;
    refresh: () => void;
}

const RoleItem: React.FC<RoleItemPropTypes> = (props) => {
    const { role, refresh } = props;
    const del = () => {
        const currentRole = role as RoleType;
        Modal.confirm({
            title: '确定删除？',
            onOk: () => {
                return delRole(currentRole.role_id as string).then(
                    () => {
                        message.success('操作成功');
                        refresh();
                    },
                    (err) => {
                        message.error(err.message);
                    },
                );
            },
        });
    };
    const changeStatus = () => {
        const currentRole = role as RoleType;
        Modal.confirm({
            title: `确定${currentRole.status == 1 ? '关闭' : '打开'}角色：${currentRole.role_name}`,
            onOk: () => {
                return setRoleStatus({
                    role_id: currentRole.role_id,
                    status: currentRole.status == 1 ? 2 : 1,
                }).then(
                    () => {
                        message.success('操作成功');
                        refresh();
                    },
                    (err) => {
                        message.error(err.message);
                    },
                );
            },
        });
    };
    return role ? (
        <Card
            className={styles.roleItem}
            title={role.role_name}
            extra={
                <div className={'text-muted'}>
                    {role.role_user_count}
                    <AssignAccounts role={role} onSuccess={refresh}>
                        <UserSwitchOutlined className={styles.userIcon} />
                    </AssignAccounts>
                </div>
            }
        >
            <div>{role.description}</div>
            <Row className={styles.footer}>
                <Col span={8}>
                    <Switch size={'small'} checked={role.status == 1} onChange={changeStatus} />
                </Col>
                <Col span={16} className={'text-right link-group'}>
                    <a>
                        <Upsert data={role} refresh={refresh}>
                            <span>编辑</span>
                        </Upsert>
                    </a>
                    <a onClick={del}>删除</a>
                </Col>
            </Row>
        </Card>
    ) : (
        <Upsert refresh={refresh}>
            <Card className={classNames(styles.roleItem, styles.addItem)}>
                <PlusOutlined className={styles.addIcon} />
            </Card>
        </Upsert>
    );
};

export default RoleItem;
