import joinPath from 'join-path';
import _ from 'lodash';
import { getLocale } from 'umi';
import { MenuDataItem } from '@ant-design/pro-layout';

export type MenuTypes = 'Folder' | 'Menu' | 'Action' | 'StatusBar';
export interface MenuItem {
    id: number,
    name: string,
    type: MenuTypes,
    dnaStr: string,
    dna: number[],
    icon?: string,
    status?: number | boolean,
    path?: string,
    children?: MenuItem[]
}
export type MenuList = MenuItem[] & {
    pathMap?: {[path:string]:MenuItem},
    dnaMap?: {[dna:string]:MenuItem},
}

/**
 * 遍历菜单树或菜单数组
 * @param menu
 * @param callback
 */
export function each(menu:MenuList,callback:(item:MenuItem,index:number,parent:MenuItem|undefined,arr:MenuList)=>void){
    function doEach(data:MenuList, parent?:MenuItem) {
        data.forEach((item, index, arr) => {
            callback(item, index, parent, arr);
            if (item.children) {
                doEach(item.children, item);
            }
        });
    }
    doEach(menu);
}
/**
 * 将平面的带有DNA的菜单数组转化为对象树
 * @param tileData
 */
export function planToTree(tileData: MenuList):MenuList {
    const tree:{children:MenuList} = { children: [] };
    tileData.forEach(item => {
        const dna = item.dnaStr || '0';
        const chain = dna.split('-');
        item.dna = [];
        chain.forEach((key: string) => {
            item.dna.push(+key);
        });
        let cursor:any = tree;
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
export function treeToPlan(menus: MenuList):MenuList{
    const list:MenuList = [];
    each(menus,(item)=>{
        const cloneItem = _.cloneDeep(item);
        delete cloneItem.children;
        list.push(cloneItem);
    })
    return list;
}
/**
 * 当树结构发生了变化后对变化后的树的DNA进行重新排序以保证DNA和数结构的一致
 * @param menus
 */
export function recombineTreesDNA(menus:MenuList){
    each(menus,(item,index,parent)=>{
        const dna = parent ? parent.dna : [];
        dna.push(index);
        item.dna = dna;
        item.dnaStr = dna.join('-');
    })
    return menus;
}
/**
 * 转换资源数据菜单的数据
 * @param menus
 */
export function convertResourceMenu(menus:MenuList):MenuList{
    const local = getLocale();
    each(menus,(menu,index,parent)=>{
        const path = parent?joinPath('/',parent.path,menu.path):joinPath('/',menu.path);
        menu.path = path;
        const name = JSON.parse(menu.name) || {};
        menu.name = name[local];
    })
    return menus;
}
/**
 * 扩展菜单资源Map映射
 * @param menus
 */
export function extendMenuMapping(menus:MenuList):MenuList{
    const routeMap:AnyObject = {};
    const dnaMap:AnyObject = {};
    each(menus,(menu)=>{
        routeMap[menu.path||''] = menu;
        dnaMap[menu.dnaStr] = menu;
    })
    menus.pathMap = routeMap;
    menus.dnaMap = dnaMap;
    return menus;
}

/**
 * 转换菜单为渲染菜单配置项
 * @param menus
 */
export function convertMenuToMenuRenderData(menus:MenuList):MenuDataItem[]{
    return menus.map((menu) => {
        return {
            icon: menu.icon,
            name: menu.name,
            locale: false,
            key: menu.dnaStr,
            path: menu.path,
            children: menu.children ? convertMenuToMenuRenderData(menu.children) : undefined,
            hideInMenu: menu.type !== 'Menu' && menu.type !== 'Folder'
        } as MenuDataItem;
    });
}
