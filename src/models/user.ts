import {Effect,Reducer} from 'umi';
import {login} from "@/services/user";
import { md5 } from '@/utils/utils';
import { MenuList, convertResourceMenu, extendMenuMapping } from '@/utils/menu';
import CookieStore from '@/utils/CookieStore';

export interface UserModel {
    id: string | number
    username: string
    name: string
    menu?: MenuList
    defaultRouteMenuId?: number | string,
    roleId?: number | string,
    status?: number | string,
    avatar?: string
}
export interface UserModelState {
    currentUser?: UserModel | null;
}
export interface UserModelType {
    namespace: 'user';
    state: UserModelState;
    effects: {
        login: Effect;
    };
    reducers: {
        updateCurrentUser: Reducer<UserModelState>;
    };
}

export const signPassword = (username:string, password:string):string=>{
    return md5(username + password).toUpperCase();
};

const userCookieStore = new CookieStore('sys');

const UserModel: UserModelType = {
    namespace: 'user',

    state: {
        currentUser: (()=>{
            const user = userCookieStore.get();
            if(!user)return null;
            extendMenuMapping(user.menu || []);
            return user;
        })(),
    },

    effects: {
        * login({payload}, {call,put}) {
            const user:UserModel = yield call(login, {
                ...payload,
                password: signPassword(payload.username,payload.password)
            });
            convertResourceMenu(user.menu || []);
            extendMenuMapping(user.menu || []);
            yield put({
                type: 'updateCurrentUser',
                payload:user
            })
            return user;
        },
    },

    reducers: {
        updateCurrentUser(state, {payload}) {
            userCookieStore.set(payload);
            return {
                ...state,
                currentUser: payload
            }
        }
    },
};

export default UserModel;
