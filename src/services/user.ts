import request from '@/utils/request';
import { UserModel } from '@/models/user';

export async function login(params:any): Promise<UserModel> {
    return request.post('basis/user/login', params);
}
export async function getVerifyImage() {
    return request.post('basis/validate/getimage').then(res=>res.data[0])
}
export async function validateVerifyImage(params:any) {
    return request.post('basis/validate/check',params).then(res=>res.data[0])
}
