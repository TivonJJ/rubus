/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import type {
    MenuDataItem,
    BasicLayoutProps as ProLayoutProps,
    Settings,
} from '@ant-design/pro-layout';
import ProLayout from '@ant-design/pro-layout';
import React, { useMemo } from 'react';
import type { Dispatch, Route} from 'umi';
import { Link, useIntl, connect, history, Redirect } from 'umi';
import { Result, Button } from 'antd';
import RightContent from '@/components/GlobalHeader/RightContent';
import type { ConnectState } from '@/models/connect';
import GlobalFooter from '@/components/GlobalFooter';
import type { UserModel } from '@/models/user';
import { convertMenuToMenuRenderData, getFirstAccessibleMenu } from '@/utils/menu';
import classNames from 'classnames';
import Authorized from '@/components/Authorized';
import ptr from 'path-to-regexp';
import styles from './BasicLayout.less';
import logo from '../assets/logo.png';
import type { DefaultSettings } from '../../config/defaultSettings';

const noMatch = (
    <Result
        status={403}
        title={"403"}
        subTitle={"Sorry, you are not authorized to access this page."}
        extra={
            <Button type={"primary"}>
                <Link to={"/user/login"}>Go Login</Link>
            </Button>
        }
    />
);

const notFound = (
    <Result
        status={"404"}
        title={"404"}
        subTitle={"Sorry, the page you visited does not exist."}
        extra={
            <Button type={"primary"} onClick={() => history.replace('/')}>
                Back Home
            </Button>
        }
    />
);

export type BasicLayoutProps = {
    breadcrumbNameMap: Record<string, MenuDataItem>;
    route: ProLayoutProps['route'] & {
        authority: string[];
    };
    routes: Route[]
    settings: Settings & DefaultSettings;
    dispatch: Dispatch;
    currentUser?: UserModel;
} & ProLayoutProps;

export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
    breadcrumbNameMap: Record<string, MenuDataItem>;
};

declare type NestRoutes = {
    component: React.ComponentType<any>;
    render?: (props: any) => React.ReactNode;
    children: ((props: any) => React.ReactNode) | React.ReactNode;
    path: string;
    pathExp?: RegExp
    exact?: boolean;
    sensitive?: boolean;
    strict?: boolean;
    routes: NestRoutes
}[];
const getRoutesList = (routes: NestRoutes)=>{
    const list: RegExp[] = [];
    const each = (arr: NestRoutes)=>{
        arr.forEach(item=>{
            if(item.path!=null){
                list.push(ptr(item.path));
            }
            if(item.routes){
                each(item.routes);
            }
        });
    };
    each(routes);
    return list.sort();
};
const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
    const { dispatch, children, settings, collapsed, currentUser,location,routes } = props;
    const pathname: string = location?.pathname as string;
    const { formatMessage } = useIntl();

    const handleMenuCollapse = (payload: boolean): void => {
        dispatch({
            type: 'global/changeLayoutCollapsed',
            payload,
        });
    };
    const routeRegexp = useMemo(()=>{
        return getRoutesList(routes as any);
    },[routes]);
    const content = useMemo(()=>{
        const isFound = routeRegexp.find(reg=>reg.test(pathname));
        if(!isFound){
            return notFound;
        }
        const first = getFirstAccessibleMenu(currentUser?.menu||[],pathname);
        console.log(first);
        if(first?.path && first.path !== pathname){
            console.log('aaa');
            return <Redirect to={first.path} />;
        }
        // const matchUserMenu = userMenus.find(path=>ptr(pathname).test(path));
        // if(matchUserMenu && pathMap[matchUserMenu].type==='Folder' && pathMap[matchUserMenu].children?.[0]){
        //     const r = pathMap[matchUserMenu].children[0]
        //     return <Redirect to={r.path} />
        // }
        return (
            <Authorized route={location?.pathname as string} noMatch={noMatch}>
                {children}
            </Authorized>
        );
    },[pathname]);
    return (
        <div className={classNames(styles.basicLayout, settings.layout?styles[settings.layout]:'')}>
            <ProLayout
                logo={logo}
                formatMessage={formatMessage}
                onCollapse={handleMenuCollapse}
                onMenuHeaderClick={() => history.push('/')}
                headerTitleRender={(logoDom, titleDom) => {
                    return (
                        <div
                            className={classNames(styles.mixTitle, {
                                [styles.mixTitleCollapsed]: collapsed,
                            })}
                            style={{ width: collapsed ? '' : settings.siderWidth }}
                        >
                            {logoDom}
                            {titleDom}
                        </div>
                    );
                }}
                menuItemRender={(menuItemProps, defaultDom) => {
                    if (menuItemProps.isUrl || !menuItemProps.path) {
                        return defaultDom;
                    }
                    return <Link to={menuItemProps.path}>{defaultDom}</Link>;
                }}
                breadcrumbRender={(routers = []) => [
                    {
                        path: '/',
                        breadcrumbName: formatMessage({ id: 'menu.home' }),
                    },
                    ...routers,
                ]}
                // 面包屑Item渲染
                itemRender={() => []}
                footerRender={() => <GlobalFooter />}
                menuDataRender={() => convertMenuToMenuRenderData(currentUser?.menu || [])}
                rightContentRender={() => <RightContent />}
                {...props}
                {...settings}
                title={settings.title || formatMessage({ id:'app.title' })}
            >
                {content}
            </ProLayout>
        </div>
    );
};

export default connect(({ global, settings, user }: ConnectState) => ({
    collapsed: global.collapsed,
    settings: settings as Settings & DefaultSettings,
    currentUser: user.currentUser,
}))(BasicLayout);
