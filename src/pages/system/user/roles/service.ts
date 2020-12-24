import request from '@/utils/request';
import { objectPropsMapping } from '@/utils/utils';
import type { MenuList} from '@/utils/menu';
import { planToTree, MenuResPropsMap } from '@/utils/menu';

// 获取系统所有菜单资源树
export async function getMenus(params?: any): Promise<MenuList> {
    return request.post('basis/resource/list', params).then((res) => {
        const { data } = res;
        const resList = objectPropsMapping(data, MenuResPropsMap) as MenuList;
        return planToTree(resList);
    });
}
// 获取角色列表
export async function getRoles(params?: any) {
    return request.post('role/list', params);
}
// 删除角色
export async function delRole(role_id: string | number) {
    return request.post('basis/role/delete', { role_id });
}
// 设置启用角色状态
export async function setRoleStatus(params: any) {
    return request.post('basis/role/updateStatus', params);
}
// 创建角色
export async function createRole(params: any) {
    return request.post('basis/role/add', params);
}
// 编辑角色
export async function updateRole(params: any) {
    return request.post('basis/role/update', params);
}
// 获取角色的权限列表
export async function getRoleMenus(role_id: string | number) {
    return request.post('basis/role/detail', { role_id });
}
// 获取角色下的账户
export async function getRoleAccounts(role_id: string | number) {
    return request.post('basis/role/roleUserList', { role_id }).then((res) => res.data[0]);
}
// 设置角色下的账户
export async function setRoleAccounts(params: {
    already_alloc_userlist: { user_id: string | number }[];
    role_id: number | string;
}) {
    return request.post('basis/role/allocRole', params);
}
