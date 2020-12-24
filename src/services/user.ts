import request from '@/utils/request';
import type { UserModel } from '@/models/user';
import { objectPropsMapping } from '@/utils/utils';
import type { MenuList} from '@/utils/menu';
import { planToTree, MenuResPropsMap } from '@/utils/menu';

export async function login(params: any): Promise<UserModel> {
    return request.post('basis/user/login', params).then((res)=>{
        const data = res.data[0];
        const user: UserModel = {
            id: data.user_id,
            username: data.username,
            name: data.real_name,
            defaultRouteMenuId: data.login_res_id,
            status: data.status,
            roleId: data.role_id,
        };
        const resList = objectPropsMapping(data.user_res_list,MenuResPropsMap) as MenuList;
        user.menu = planToTree(resList);
        return user;
    });
}
