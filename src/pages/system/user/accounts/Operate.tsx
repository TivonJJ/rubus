import React from 'react';
import { message, Popconfirm, Spin } from 'antd';
import { useRequest } from 'umi';
import { resetAccountPassword, updateAccount, delAccount } from './service';

interface OperateProps {
    data: AnyObject;
    refresh: () => void;
}

export const ResetPassword: React.FC<OperateProps> = (props) => {
    const { data, refresh } = props;
    const { loading, run } = useRequest(resetAccountPassword, { manual: true, throwOnError: true });
    const reset = () => {
        if (loading) return;
        run(data.user_id).then(
            () => {
                message.success('操作成功');
                refresh();
            },
            (err) => {
                message.error(err.message);
            },
        );
    };
    return (
        <Popconfirm title={`确定重置“${data.real_name}”的密码？`} onConfirm={reset}>
            <a>{loading ? <Spin size={'small'} /> : '重置密码'}</a>
        </Popconfirm>
    );
};

export const ChangeStatus: React.FC<OperateProps> = (props) => {
    const { data, refresh } = props;
    const toStatusText = data.status == 1 ? '停用' : '启用';
    const { loading, run } = useRequest(updateAccount, { manual: true, throwOnError: true });
    const change = () => {
        if (loading) return;
        run({
            user_id: data.user_id,
            status: data.status == 1 ? 2 : 1,
        }).then(
            () => {
                message.success('操作成功');
                refresh();
            },
            (err) => {
                message.error(err.message);
            },
        );
    };
    return (
        <Popconfirm title={`确定${toStatusText}“${data.real_name}”？`} onConfirm={change}>
            <a>{loading ? <Spin size={'small'} /> : toStatusText}</a>
        </Popconfirm>
    );
};

export const Remove: React.FC<OperateProps> = (props) => {
    const { data, refresh } = props;
    const { loading, run } = useRequest(delAccount, { manual: true, throwOnError: true });
    const remove = () => {
        if (loading) return;
        run(data.user_id).then(
            () => {
                message.success('操作成功');
                refresh();
            },
            (err) => {
                message.error(err.message);
            },
        );
    };
    return (
        <Popconfirm title={`删除用户“${data.real_name}”？`} onConfirm={remove}>
            <a>{loading ? <Spin size={'small'} /> : '删除'}</a>
        </Popconfirm>
    );
};
