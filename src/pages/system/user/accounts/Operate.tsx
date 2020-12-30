import React from 'react';
import { message, Popconfirm, Spin } from 'antd';
import { useRequest,useIntl } from 'umi';
import { resetAccountPassword, updateAccount, delAccount } from './service';

type OperateProps = {
    data: AnyObject;
    refresh: () => void;
};

export const ResetPassword: React.FC<OperateProps> = (props) => {
    const { formatMessage } = useIntl();
    const { data, refresh } = props;
    const { loading, run } = useRequest(resetAccountPassword, { manual: true, throwOnError: true });
    const reset = () => {
        if (loading) return;
        run(data.user_id).then(
            () => {
                message.success(formatMessage({id:'common.operateSuccess'}));
                refresh();
            },
            (err) => {
                message.error(err.message);
            },
        );
    };
    return (
        <Popconfirm
            title={
                formatMessage(
                    { id:'page.system.accounts.operate.resetPwd.confirm'},
                    {name: data.real_name}
                )
            }
            onConfirm={reset}
        >
            <a>
                {loading ?
                    <Spin size={'small'} />
                    :
                    formatMessage({ id: 'page.system.accounts.operate.resetPwd' })
                }
            </a>
        </Popconfirm>
    );
};

export const ChangeStatus: React.FC<OperateProps> = (props) => {
    const { formatMessage } = useIntl();
    const { data, refresh } = props;
    const toStatusText = formatMessage({id:`page.system.accounts.operate.${data.status == 1 ? 'disable' : 'enable'}`});
    const { loading, run } = useRequest(updateAccount, { manual: true, throwOnError: true });
    const change = () => {
        if (loading) return;
        run({
            user_id: data.user_id,
            status: data.status == 1 ? 2 : 1,
        }).then(
            () => {
                message.success(formatMessage({id:'common.operateSuccess'}));
                refresh();
            },
            (err) => {
                message.error(err.message);
            },
        );
    };
    return (
        <Popconfirm
            title={formatMessage(
                { id: 'page.system.accounts.operate.toggleConfirm' },
                { status: toStatusText,name: data.real_name },
            )}
            onConfirm={change}
        >
            <a>{loading ? <Spin size={'small'} /> : toStatusText}</a>
        </Popconfirm>
    );
};

export const Remove: React.FC<OperateProps> = (props) => {
    const {formatMessage} = useIntl();
    const { data, refresh } = props;
    const { loading, run } = useRequest(delAccount, { manual: true, throwOnError: true });
    const remove = () => {
        if (loading) return;
        run(data.user_id).then(
            () => {
                message.success(formatMessage({id:'common.operateSuccess'}));
                refresh();
            },
            (err) => {
                message.error(err.message);
            },
        );
    };
    return (
        <Popconfirm
            title={formatMessage(
                { id: 'page.system.accounts.operate.delete.confirm' },
                { name: data.real_name },
            )}
            onConfirm={remove}
        >
            <a>
                {loading ?
                    <Spin size={'small'} />
                    :
                    formatMessage({id:'page.system.accounts.operate.delete'})
                }
            </a>
        </Popconfirm>
    );
};
