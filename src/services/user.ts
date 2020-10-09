import request from '@/utils/request';
import { UserModel } from '@/models/user';
import { objectPropsMapping } from '@/utils/utils';
import { planToTree, MenuList } from '@/utils/menu';

export async function login(params:any): Promise<UserModel> {
    return request.post('basis/user/login', params).then((res)=>{
        const data = res.data[0];
        const user:UserModel = {
            id: data.user_id,
            username: data.username,
            name: data.real_name,
            defaultRouteMenuId: data.login_res_id,
            status: data.status,
            roleId: data.role_id,
        };
        const resList = objectPropsMapping(data.user_res_list,
            {
                'icon_url':'icon',
                'res_name': 'name',
                'res_type': 'type',
                'res_url': 'path',
                'dna': 'dnaStr',
            }) as MenuList;
        user.menu = planToTree(resList);
        return user;
    });
}
export async function getVerifyImage() {
    return request.post('basis/validate/getimage').then(res=>res.data[0])
}
export async function validateVerifyImage(params:any) {
    return request.post('basis/validate/check',params).then(res=>res.data[0])
}
