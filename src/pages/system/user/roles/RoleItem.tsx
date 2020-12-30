import { Card, Col, message, Modal, Row, Switch } from 'antd';
import React from 'react';
import { useIntl } from 'umi';
import { UserSwitchOutlined, PlusOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import Ellipsis from '@/components/Ellipsis';
import { delRole, setRoleStatus } from './service';
import type { RoleType } from './model';
import styles from './style.less';
import Upsert from './Upsert';
import AssignAccounts from './AssignAccounts';
import { RoleStatus } from '@/constants/account';

type RoleItemPropTypes = {
    role?: RoleType;
    refresh: () => void;
};

const RoleItem: React.FC<RoleItemPropTypes> = (props) => {
    const { role, refresh } = props;
    const {formatMessage} = useIntl();
    const del = () => {
        const currentRole = role as RoleType;
        Modal.confirm({
            title: formatMessage({id:'page.system.user.role.action.delete.confirm'}),
            onOk: () => {
                return delRole(currentRole.role_id as string).then(
                    () => {
                        message.success(formatMessage({id:'common.operateSuccess'}));
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
            title: formatMessage(
                { id: 'page.system.user.role.action.statusChangeConfirm' },
                { status: currentRole.status == 1 ? RoleStatus[2] : RoleStatus[1], name: currentRole.role_name },
            ),
            onOk: () => {
                return setRoleStatus({
                    role_id: currentRole.role_id,
                    status: currentRole.status == 1 ? 2 : 1,
                }).then(
                    () => {
                        message.success(formatMessage({id:'common.operateSuccess'}));
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
            <Ellipsis line={2}>{role.description}</Ellipsis>
            <Row className={styles.footer}>
                <Col span={8}>
                    <Switch size={'small'} checked={role.status == 1} onChange={changeStatus} />
                </Col>
                <Col span={16} className={'text-right link-group'}>
                    <a>
                        <Upsert data={role} refresh={refresh}>
                            <span>{formatMessage({id:'page.system.user.role.action.edit'})}</span>
                        </Upsert>
                    </a>
                    <a onClick={del}>
                        {formatMessage({id:'page.system.user.role.action.delete'})}
                    </a>
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
