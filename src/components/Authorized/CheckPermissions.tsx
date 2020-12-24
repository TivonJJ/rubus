import { getDvaApp } from 'umi';
import ptr from 'path-to-regexp';

/**
 *
 * 通用权限检查方法
 * Common check permissions method
 * @param { 权限判定的路由 | Permission judgment } route
 *
 */
function check(route: string): boolean {
    const app = getDvaApp();
    // eslint-disable-next-line no-underscore-dangle
    const state = app._store.getState();
    // 未登录用户无权限
    if(!state.user || !state.user.currentUser)return false;
    // 默认有根目录权限
    if(route==='/')return true;
    const routes: string[] = Object.keys(state.user.currentUser.menu?.pathMap || {});
    const found = routes.find((item)=>{
        return ptr(item).test(route);
    });
    return found != null;
}

export default check;
