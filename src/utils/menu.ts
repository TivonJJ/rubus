import React from 'react';
import joinPath from 'join-path';
import cloneDeep from 'lodash/cloneDeep';
import { getLocale } from 'umi';
import type { MenuDataItem } from '@ant-design/pro-layout';
import { parseJSONSafe } from '@/utils/utils';
import { IconMap } from '@/constants/menu';

export type MenuTypes = 'Folder' | 'Menu' | 'Action' | 'StatusBar';

export type MenuItem = {
    id: number;
    name: string | AnyObject;
    type: MenuTypes;
    dnaStr: string;
    dna: number[];
    icon?: string;
    status?: number | boolean;
    path: string;
    description?: string;
    children?: MenuItem[];
    updateTime?: string;
};

export type MenuList = MenuItem[] & {
    pathMap?: Record<string, MenuItem>;
    dnaMap?: Record<string, MenuItem>;
};
/**
 *  菜单资源字段转换映射，使字段名一致
 */
export const MenuResPropsMap = {
    res_id: 'id',
    icon_url: 'icon',
    res_name: 'name',
    res_type: 'type',
    res_url: 'path',
    dna: 'dnaStr',
};
/**
 * 遍历菜单树或菜单数组
 * @param menu
 * @param callback
 */
export function loop(
    menu: MenuList,
    callback: (
        item: MenuItem,
        index: number,
        parent: MenuItem | undefined,
        arr: MenuItem[],
    ) => boolean | void,
): MenuList {
    let shouldStop: boolean = false;
    function doEach(data: MenuList, parent?: MenuItem) {
        for (let i = 0; i < data.length; i++) {
            if(shouldStop)break;
            const item = data[i];
            const rs = callback(item, i, parent, data);
            if (rs === false) {
                shouldStop = true;
                break;
            }
            if (item.children) {
                doEach(item.children, item);
            }
        }
    }

    doEach(menu);
    return menu;
}

/**
 * 将平面的带有DNA的菜单数组转化为对象树
 * @param tileData
 */
export function planToTree(tileData: MenuList): MenuList {
    const tree: { children: MenuList } = { children: [] };
    tileData.forEach((item) => {
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
        const cloneItem = cloneDeep(item);
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
        const newDna = [...dna, index];
        item.dna = newDna;
        item.dnaStr = newDna.join('-');
    });
    return extendResourceMenuMapping(menus);
}

/**
 * 转换资源数据菜单的数据并扩展映射
 * @param menus
 */
export function convertResourceMenu(menus: MenuList): MenuList {
    loop(menus, (menu, index, parent) => {
        const path = parent ? joinPath('/', parent.path, menu.path) : joinPath('/', menu.path);
        menu.path = path;
        menu.name = parseJSONSafe(menu.name, {});
    });
    return extendResourceMenuMapping(menus);
}

/**
 * 扩展menu的Map映射
 * @param menus
 */
export function extendResourceMenuMapping(menus: MenuList): MenuList {
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
        const IconComp: React.ComponentClass | string = menu.icon
            ? IconMap[menu.icon] || menu.icon
            : null;
        let icon;
        if (IconComp) {
            if (typeof IconComp === 'string') {
                icon = IconComp;
            } else {
                icon = React.createElement(IconComp);
            }
        }
        return {
            icon,
            name: menu.name[getLocale()] || menu.name,
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
 * @param path
 */
export function getFirstAccessibleMenu(menus: MenuList, path?: string): MenuItem | null {
    let foundMenu: MenuItem | null = null;
    const {pathMap={}} = menus;
    const menu = (path && path !== '/' && path !== '') ? pathMap[path] : Object.values(pathMap)[0];
    if(!menu)return null;
    const checkIsAccessible=(m: MenuItem)=>{
        return m.status == true && (m.type === 'Action' || m.type === 'Menu') && !/:/.test(m.path);
    };
    if(checkIsAccessible(menu))return menu;
    loop(menu.children||[], (item) => {
        if (checkIsAccessible(item)) {
            foundMenu = item;
            return false;
        }
        return true;
    });
    return foundMenu;
}

/**
 * 获取第一个可访问的或指定可访问的菜单资源地址
 * @param menus
 * @param menuId
 */
export function getMenuById(menus: MenuList, menuId?: number | string): MenuItem | null {
    let foundMenu: MenuItem | null = null;
    loop(menus, (item) => {
        if (item.status == true && menuId == item.id) {
            foundMenu = item;
            return false;
        }
        return true;
    });
    return foundMenu;
}
