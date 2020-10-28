import { Effect, Reducer } from 'umi';
import { createRole, getRoles, updateRole } from '@/services/systemAccounts';

export interface RoleType {
    role_user_count: number
    role_id?: number | string
    status?: number | string
    description: string
    role_name: string
}
export interface SysAccountRolesModelState {
    roles: RoleType[];
}
export interface SysAccountRolesModelType {
    namespace: 'sysAccountRolesModel';
    state: SysAccountRolesModelState;
    effects: {
        fetch: Effect;
        upsert: Effect;
    };
    reducers: {
        updateState: Reducer<SysAccountRolesModelState>;
    };
}

const SysAccountRolesModel:SysAccountRolesModelType = {
    namespace: 'sysAccountRolesModel',
    state:{
        roles: [],
    },
    effects:{
        *fetch({payload},{call,put}){
            const res = yield call(getRoles,payload);
            yield put({
                type: 'updateState',
                payload: {
                    roles: res.data
                }
            })
        },
        *upsert({payload},{call}){
            const action = payload.role_id ? updateRole : createRole;
            yield call(action,payload);
        },
    },
    reducers:{
        updateState(state,{payload}){
            return {...state,...payload}
        }
    }
}

export default SysAccountRolesModel;
