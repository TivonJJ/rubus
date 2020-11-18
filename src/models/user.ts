import { Effect, Reducer, history } from 'umi';
import { login } from '@/services/user';
import { md5 } from '@/utils/utils';
import { MenuList, convertResourceMenu } from '@/utils/menu';
import CookieStore from '@/utils/CookieStore';

export interface UserModel {
    id: string | number;
    username: string;
    name: string;
    menu?: MenuList;
    defaultRouteMenuId?: number | string;
    roleId?: number | string;
    status?: number | string;
    avatar?: string;
}
export interface UserModelState {
    currentUser?: UserModel;
}
export interface UserStoreModelType {
    namespace: 'user';
    state: UserModelState;
    effects: {
        login: Effect;
        logout: Effect;
    };
    reducers: {
        updateCurrentUser: Reducer<UserModelState>;
    };
}

export const signPassword = (username: string, password: string): string => {
    return md5(username + password).toUpperCase();
};

const userCookieStore = new CookieStore('sys');

const UserStoreModel: UserStoreModelType = {
    namespace: 'user',

    state: {
        currentUser: (() => {
            const user = userCookieStore.get();
            if (!user) return null;
            convertResourceMenu(user.menu || []);
            return user;
        })(),
    },

    effects: {
        *login({ payload }, { call, put }) {
            const user: UserModel = yield call(login, {
                ...payload,
                password: signPassword(payload.username, payload.password),
            });
            userCookieStore.set(user);
            convertResourceMenu(user.menu || []);
            yield put({
                type: 'updateCurrentUser',
                payload: user,
            });
            return user;
        },
        *logout(_, { put }) {
            yield put({
                type: 'updateCurrentUser',
                payload: null,
            });
            userCookieStore.clear();
            history.push('/user/login');
        },
    },

    reducers: {
        updateCurrentUser(state, { payload }) {
            return {
                ...state,
                currentUser: payload,
            };
        },
    },
};

export default UserStoreModel;
