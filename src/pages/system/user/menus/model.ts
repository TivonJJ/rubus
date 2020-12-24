import type { Effect, Reducer } from 'umi';
import type { MenuList, MenuItem} from '@/utils/menu';
import { loop, recombineTreesDNA, treeToPlan } from '@/utils/menu';
import { parseJSONSafe } from '@/utils/utils';
import { getMenus, setMenus } from './service';

export type SysUserMenusModelState = {
    menus: MenuList;
    selectedMenu?: MenuItem;
    menuChanged: boolean;
    searchValue?: string;
};
export type SysUserMenusModelType = {
    namespace: 'sysUserMenusModel';
    state: SysUserMenusModelState;
    effects: {
        fetchMenus: Effect;
        save: Effect;
    };
    reducers: {
        updateState: Reducer<SysUserMenusModelState>;
        updateMenus: Reducer<SysUserMenusModelState>;
        updateMenu: Reducer<SysUserMenusModelState>;
        insertMenu: Reducer<SysUserMenusModelState>;
        delMenu: Reducer<SysUserMenusModelState>;
        selectMenu: Reducer<SysUserMenusModelState>;
        reset: Reducer<SysUserMenusModelState>;
    };
};

const initialState = (): SysUserMenusModelState => ({
    menus: [],
    menuChanged: false,
});

const SysUserMenusModel: SysUserMenusModelType = {
    namespace: 'sysUserMenusModel',
    state: initialState(),
    effects: {
        *fetchMenus({ payload }, { call, put }) {
            const menus = yield call(getMenus, payload);
            loop(menus, (menu) => {
                menu.name = parseJSONSafe(menu.name, {});
            });
            yield put({
                type: 'updateState',
                payload: { menus },
            });
        },
        *save(_, { call, select, put }) {
            const menus = yield select((state: any) => state.sysUserMenusModel.menus);
            const planMenus = treeToPlan(menus);
            yield put({
                type: 'updateState',
                payload: { menuChanged: false },
            });
            return yield call(setMenus, planMenus);
        },
    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        },
        updateMenus(state, { payload }) {
            return { ...state, menus: recombineTreesDNA(payload), menuChanged: true };
        },
        updateMenu(state, { payload }) {
            const { target, values } = payload;
            const menus = loop(state?.menus || [], (menu) => {
                if (menu.dnaStr === target.dnaStr) {
                    Object.assign(menu, values);
                    return false;
                }
                return true;
            });
            recombineTreesDNA(menus);
            return { ...state, menus, menuChanged: true };
        },
        insertMenu(state, { payload }) {
            const { level, to } = payload;
            const menus = state?.menus || [];
            const insertedMenu = insertMenu(menus, to, level);
            return {
                ...state,
                menus: recombineTreesDNA(menus),
                selectedMenu: insertedMenu,
                menuChanged: true,
            } as SysUserMenusModelState;
        },
        delMenu(state, { payload }) {
            const menus = state?.menus || [];
            loop(menus, (menu, index, parent, arr) => {
                if (menu.dnaStr === payload.dnaStr) {
                    arr.splice(index, 1);
                    return false;
                }
                return true;
            });
            return {
                ...state,
                selectedMenu: undefined,
                menuChanged: true,
                menus: recombineTreesDNA(menus),
            } as SysUserMenusModelState;
        },
        selectMenu(state, { payload }) {
            return { ...state, selectedMenu: payload } as SysUserMenusModelState;
        },
        reset() {
            return initialState();
        },
    },
};

function insertMenu(menus: MenuList, to: MenuItem, level: number): MenuItem | null {
    const menuMark = Math.random();
    const addItem = {
        type: 'Folder',
        status: 1,
        path: '',
        $mark: menuMark,
    } as any;
    if (level === 0) {
        menus.push(addItem);
    } else {
        loop(menus, (item, index, parent, arr) => {
            if (item.dnaStr === to.dnaStr) {
                if (level === 1) {
                    // 创建同级
                    addItem.type = to.type;
                    arr.splice(index + 1, 0, addItem);
                } else {
                    // 创建下级
                    addItem.type =
                        { Folder: 'Menu', Menu: 'Action', Action: 'Action' }[to.type] ||
                        addItem.type;
                    if (!item.children) item.children = [];
                    item.children.push(addItem);
                }
                return false;
            }
            return true;
        });
    }
    let insertedMenu = null;
    loop(menus, (item: any) => {
        if (item.$mark === menuMark) {
            insertedMenu = item;
        }
    });
    return insertedMenu;
}

export default SysUserMenusModel;
