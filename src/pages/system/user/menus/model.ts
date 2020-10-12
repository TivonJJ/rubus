import { getMenus } from "@/services/system"
import { Effect, Reducer } from 'umi';
import { MenuList, convertResourceMenu, extendMenuMapping, MenuItem } from '@/utils/menu';

export interface SysUserMenusModelState{
    menus: MenuList
    selectedMenu?: MenuItem
}
export interface SysUserMenusModelType {
    namespace: 'sysUserMenusModel';
    state: SysUserMenusModelState;
    effects: {
        fetchMenus: Effect;
    };
    reducers: {
        updateState: Reducer<SysUserMenusModelState>;
        updateMenus: Reducer<SysUserMenusModelState>;
        selectMenu: Reducer<SysUserMenusModelState>;
        reset: Reducer<SysUserMenusModelState>;
    };
}

const initialState=():SysUserMenusModelState=>({
    menus: [],
})

const SysUserMenusModel:SysUserMenusModelType = {
    namespace: 'sysUserMenusModel',
    state: initialState(),
    effects:{
        *fetchMenus({payload},{call,put}){
            const menus = yield call(getMenus,payload);
            convertResourceMenu(menus);
            extendMenuMapping(menus);
            yield put({
                type: 'updateMenus',
                payload: menus
            })
        }
    },
    reducers:{
        updateState(state,{payload}){
            return { ...state, ...payload }
        },
        updateMenus(state,{payload}){
            return {...state,menus:payload}
        },
        selectMenu(state,{payload}){
            return {...state,selectedMenu:payload} as SysUserMenusModelState
        },
        reset(){
            return initialState();
        }
    }
}

export default SysUserMenusModel
