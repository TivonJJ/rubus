import type { PropsWithChildren } from 'react';
import React from 'react';
import check from './CheckPermissions';

type AuthorizedProps = {
    route: string;
    noMatch?: React.ReactNode;
};

/**
 * 权限包装器，如果有权限才会渲染children，没有则显示noMatch或不显示
 * @param props
 * @constructor
 */
const Authorized = (props: PropsWithChildren<AuthorizedProps>) => {
    const { children, route, noMatch = null } = props;
    const childrenRender: React.ReactNode = typeof children === 'undefined' ? null : children;
    const hasAuth = check(route);
    return <>{hasAuth ? childrenRender : noMatch}</>;
};

/**
 * 权限检测函数 CheckPermissions
 */
Authorized.check = check;

export default Authorized;
