import request from '@/utils/request';
import { objectPropsMapping } from '@/utils/utils';
import type { MenuList} from '@/utils/menu';
import { planToTree, MenuResPropsMap } from '@/utils/menu';

// 获取系统所有菜单资源树
export async function getMenus(params?: any): Promise<MenuList> {
    return request.post('basis/resource/list', params).then((res) => {
        const { data } = res;
        const resList = objectPropsMapping(data, MenuResPropsMap) as MenuList;
        return planToTree(resList);
    });
}
// 设置更新菜单
export async function setMenus(params: any) {
    return request.post('basis/resource/addOrUpdate', {
        res_list: objectPropsMapping(params, MenuResPropsMap, { reverse: true }),
    });
}
