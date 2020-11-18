import request from '@/utils/request';

// 获取系统账号
export async function getAccounts(params?: any) {
    return request.post('basis/user/list', params);
}
// 修改系统账号
export async function updateAccount(params: any) {
    return request.post('basis/user/update', params);
}
// 新增系统账号
export async function createAccount(params: any) {
    return request.post('basis/user/create', params);
}
// 重置账号密码
export async function resetAccountPassword(user_id: string | number) {
    return request.post('basis/user/resetPassword', { user_id });
}
// 删除账号
export async function delAccount(user_id: string | number) {
    return request.post('basis/user/del', { user_id });
}
// 获取角色列表
export async function getRoles(params?: any) {
    return request.post('role/list', params);
}
