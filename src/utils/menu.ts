import joinPath from 'join-path';
import _ from 'lodash';
import { getLocale } from 'umi';
import { MenuDataItem } from '@ant-design/pro-layout';

export type MenuTypes = 'Folder' | 'Menu' | 'Action' | 'StatusBar';

export interface MenuItem {
    id: number
    name: string
    type: MenuTypes
    dnaStr: string
    dna: number[]
    icon?: string
    status?: number | boolean
    path?: string
    children?: MenuItem[]
}

export type MenuList = MenuItem[] & {
    pathMap?: { [path: string]: MenuItem }
    dnaMap?: { [dna: string]: MenuItem }
}
/**
 *  菜单资源字段转换映射，使字段名一致
 */
export const MenuResPropsMap = {
    'res_id': 'id',
    'icon_url':'icon',
    'res_name': 'name',
    'res_type': 'type',
    'res_url': 'path',
    'dna': 'dnaStr',
}
export const IconMap = {
    path: 'ss'
}
/**
 * 遍历菜单树或菜单数组
 * @param menu
 * @param callback
 */
export function loop(menu: MenuList, callback: (item: MenuItem, index: number, parent: MenuItem | undefined,arr:MenuItem[]) => boolean|void) {
    function doEach(data: MenuList, parent?: MenuItem) {
        for(let i=0;i<data.length;i++){
            const item = data[i];
            const rs = callback(item, i, parent,data);
            if(rs===false){
                break;
            }
            if (item.children) {
                doEach(item.children, item);
            }
        }
    }

    doEach(menu);
}

/**
 * 将平面的带有DNA的菜单数组转化为对象树
 * @param tileData
 */
export function planToTree(tileData: MenuList): MenuList {
    const tree: { children: MenuList } = { children: [] };
    tileData.forEach(item => {
        const dna = item.dnaStr || '0';
        const chain = dna.split('-');
        item.dna = [];
        chain.forEach((key: string) => {
            item.dna.push(+key);
        });
        let cursor: any = tree;
        item.dna.forEach((index: number) => {
            if (!cursor.children) {
                cursor.children = [];
            }
            const { children } = cursor;
            if (!children[index]) {
                children[index] = {} as any;
            }
            cursor = cursor.children[index];
        });
        Object.assign(cursor, item);
    });
    return tree.children;
}

/**
 * 将菜单树展开为平面数组
 * @param menus
 */
export function treeToPlan(menus: MenuList): MenuList {
    const list: MenuList = [];
    loop(menus, (item) => {
        const cloneItem = _.cloneDeep(item);
        delete cloneItem.children;
        list.push(cloneItem);
    });
    return list;
}

/**
 * 当树结构发生了变化后对变化后的树的DNA进行重新排序以保证DNA和数结构的一致
 * @param menus
 */
export function recombineTreesDNA(menus: MenuList) {
    loop(menus, (item, index, parent) => {
        const dna = parent ? parent.dna : [];
        dna.push(index);
        item.dna = dna;
        item.dnaStr = dna.join('-');
    });
    return menus;
}

/**
 * 转换资源数据菜单的数据
 * @param menus
 */
export function convertResourceMenu(menus: MenuList): MenuList {
    const local = getLocale();
    loop(menus, (menu, index, parent) => {
        const path = parent ? joinPath('/', parent.path, menu.path) : joinPath('/', menu.path);
        menu.path = path;
        const name = JSON.parse(menu.name) || {};
        menu.name = name[local];
    });
    return menus;
}

/**
 * 扩展菜单资源Map映射
 * @param menus
 */
export function extendMenuMapping(menus: MenuList): MenuList {
    const routeMap: AnyObject = {};
    const dnaMap: AnyObject = {};
    loop(menus, (menu) => {
        routeMap[menu.path || ''] = menu;
        dnaMap[menu.dnaStr] = menu;
    });
    menus.pathMap = routeMap;
    menus.dnaMap = dnaMap;
    return menus;
}

/**
 * 转换菜单为渲染菜单配置项
 * @param menus
 */
export function convertMenuToMenuRenderData(menus: MenuList): MenuDataItem[] {
    return menus.map((menu) => {
        return {
            icon: menu.icon,
            name: menu.name,
            locale: false,
            path: menu.path,
            children: menu.children ? convertMenuToMenuRenderData(menu.children) : undefined,
            hideInMenu: menu.type !== 'Menu' && menu.type !== 'Folder' && menu.status == true,
        } as MenuDataItem;
    });
}

/**
 * 获取第一个可访问的或指定可访问的菜单资源地址
 * @param menus
 * @param menuId
 */
export function getFirstAccessibleMenu(menus: MenuList, menuId?: number|string): MenuItem | null {
    let foundMenu: MenuItem | null = null;
    loop(menus, (item) => {
        if (item.status == true && item.type === 'Folder') {
            if (menuId) {
                if (menuId == item.id) {
                    foundMenu = item;
                }
            } else {
                foundMenu = item;
            }
            if(foundMenu){
                return false;
            }
        }
        return true;
    });
    return foundMenu;
}
