import { getIntl } from 'umi';

const {formatMessage} = getIntl();

// 账号状态
export const Status = {
    1: { text: formatMessage({id:'constants.account.status.enabled'}), status: 'success' },
    2: { text: formatMessage({id:'constants.account.status.disabled'}), status: 'default' },
};
// 角色权限状态
export const RoleStatus = {
    1: formatMessage({id:'constants.account.status.enabled'}),
    2: formatMessage({id:'constants.account.status.disabled'})
};
