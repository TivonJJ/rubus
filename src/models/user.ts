import {Effect,Reducer} from 'umi';
import {login} from "@/services/user";
import Cookies from 'js-cookie';
import pathToRegexp from 'path-to-regexp';
import { md5 } from '@/utils/utils';

export interface UserMenus {
    id?: string | number
    parentId?: string | number
    name?: string
    url?: string
    children?: UserMenus[]
}

export interface UserModel {
    id: string | number
    username: string
    realName: string
    menu?: UserMenus[]
    defaultRouteMenuId?: number
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
        updateState: Reducer<UserModelState>;
    };
}

function extUserAuthMap(user:any) {
    const routeMap = {};
        const dnaMap = {};
    const menus = user.menus || [];
    walkMenu(menus);

    function walkMenu(menus:any){
        menus.map((menu:any)=>{
            routeMap[menu.route] = menu;
            dnaMap[menu.dna] = menu;
            if(menu.route){
                menu.pathRegexp=pathToRegexp(menu.route);
            }
            if(menu.children){
                walkMenu(menu.children);
            }
        })
    }
    user.routeMap = routeMap;
    user.dnaMap = dnaMap;
    user.avatar = createAvatar(user.real_name || '');
    return user;
}

// 用户存储cookie区域， 用户实际信息存储在localStorage内，在cookie内保存一个key来对应storage里面的内容
class UserCookieStore{
    storePrefix='';

    userMarkPrefix='@user_';

    Storage=localStorage;

    cookieKey='user-key';

    constructor(storePrefix:string){
        this.storePrefix = storePrefix;
    }

    set(data: { [key:string]:any }){
        this.clear();
        if(!data)return;
        const storeKey = this.getRealKey() + Date.now();
        this.Storage.setItem(storeKey, window.JSON.stringify(data));
        Cookies.set(this.cookieKey,storeKey,{path:'/'});
    }

    get(){
        const storeKey = Cookies.get(this.cookieKey);
        if(!storeKey)return null;
        const user = this.Storage.getItem(storeKey);
        if (!user)return null;
        return window.JSON.parse(user);
    }

    getRealKey(){
        return this.storePrefix + this.userMarkPrefix;
    }

    clear(){
        const regx = new RegExp(`^(${this.getRealKey()})`);
        for(let i=0;i<this.Storage.length;i++){
            const key:string = this.Storage.key(i) || '';
            if(regx.test(key)){
                this.Storage.removeItem(key);
            }
        }
    }
}
const userCookieStore = new UserCookieStore('sys');

function getUserFromStore() {
    const user = userCookieStore.get();
    if(!user)return null;
    return extUserAuthMap(user);
}
const localUser = getUserFromStore();

const UserModel: UserModelType = {
    namespace: 'user',

    state: {
        currentUser: localUser,
    },

    effects: {
        * login({payload}, {call}) {
            const user = yield call(login,payload);
            console.log(user);
            return user;
        },
    },

    reducers: {
        updateState(state, {payload}) {
            return {
                ...state,
                ...payload
            }
        }
    },
};

export const SignPassword = (username:string, password:string)=>{
    return md5(username + password).toUpperCase();
};

export default UserModel;
