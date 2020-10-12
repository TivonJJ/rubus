import request from '@/utils/request';
import { objectPropsMapping } from '@/utils/utils';
import { MenuList, planToTree, MenuResPropsMap } from '@/utils/menu';

/**
 * 获取系统所有菜单资源树
 * @param params
 */
export async function getMenus(params?:any):Promise<MenuList> {
    return request.post('basis/resource/list',params).then(res=>{
        const {data} = res;
        const resList = objectPropsMapping(data,MenuResPropsMap) as MenuList;
        return planToTree(resList);
    })
}
