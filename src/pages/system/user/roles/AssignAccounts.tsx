import React, { useEffect, useState } from 'react';
import { Alert, message, Modal, Spin, Transfer } from 'antd';
import { useRequest } from 'umi';
import { TransferItem } from 'antd/lib/transfer';
import { getRoleAccounts, setRoleAccounts } from './service';
import { RoleType } from './model';

interface AssignAccountsProps {
    role: RoleType;
    onSuccess?: () => void;
}

const AssignAccounts: React.FC<AssignAccountsProps> = (props) => {
    const { children, role, onSuccess } = props;
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [targetKeys, setTargetKeys] = useState<string[]>([]);
    const [dataSource, setDataSource] = useState<TransferItem[]>([]);
    const { run: fetchAccounts, loading: loadingAccounts, error } = useRequest(getRoleAccounts, {
        manual: true,
        formatResult: (res) => res,
    });
    const { run: setAccounts, loading: settingAccounts } = useRequest(setRoleAccounts, {
        manual: true,
        throwOnError: true,
    });
    const trigger = React.cloneElement(children as any, {
        onClick: () => setModalVisible(true),
    });
    useEffect(() => {
        if (!modalVisible) {
            return;
        }
        fetchAccounts(role.role_id as number).then((users) => {
            const source: TransferItem[] = [];
            const target: string[] = [];
            users.able_alloc_userlist.forEach((item: any) => {
                source.push({
                    key: String(item.user_id),
                    name: item.real_name,
                    account: item.username,
                });
            });
            users.already_alloc_userlist.forEach((item: any) => {
                source.push({
                    key: String(item.user_id),
                    name: item.real_name,
                    account: item.username,
                });
                target.push(String(item.user_id));
            });
            setDataSource(source);
            setTargetKeys(target);
        });
    }, [modalVisible]);
    const onChange = (nextTargetKeys: string[]) => {
        setTargetKeys(nextTargetKeys);
    };
    const onOk = () => {
        setAccounts({
            already_alloc_userlist: targetKeys.map((item) => ({ user_id: item })),
            role_id: role.role_id as string,
        }).then(
            () => {
                message.success('操作成功');
                setModalVisible(false);
                if (onSuccess) onSuccess();
            },
            (err) => {
                message.error(err.message);
            },
        );
    };
    return (
        <>
            {trigger}
            <Modal
                title={'给角色分配用户'}
                width={600}
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                destroyOnClose
                onOk={onOk}
                confirmLoading={settingAccounts}
            >
                <Spin spinning={loadingAccounts}>
                    {error ? (
                        <Alert message={error.message} type={'error'} showIcon />
                    ) : (
                        <Transfer
                            dataSource={dataSource}
                            targetKeys={targetKeys}
                            titles={['未分配', '已分配']}
                            onChange={onChange}
                            render={(item) => (
                                <div>
                                    <span>{item.name} </span>
                                    {item.account && (
                                        <span className={'text-muted'}>({item.account})</span>
                                    )}
                                </div>
                            )}
                            showSearch
                            listStyle={{
                                width: 260,
                                height: 300,
                            }}
                        />
                    )}
                </Spin>
            </Modal>
        </>
    );
};

export default AssignAccounts;
