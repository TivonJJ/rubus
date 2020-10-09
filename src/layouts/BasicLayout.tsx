/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
    MenuDataItem,
    BasicLayoutProps as ProLayoutProps,
    Settings,
} from '@ant-design/pro-layout';
import React, { useMemo, useRef } from 'react';
import { Link, useIntl, connect, Dispatch, history } from 'umi';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import { getMatchMenu } from '@umijs/route-utils';
import GlobalFooter from '@/components/GlobalFooter';
import { UserModel } from '@/models/user';
import logo from '../assets/logo.png';

const noMatch = (
    <Result
        status={403}
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
            <Button type="primary">
                <Link to="/user/login">Go Login</Link>
            </Button>
        }
    />
);

export interface BasicLayoutProps extends ProLayoutProps {
    breadcrumbNameMap: {
        [path: string]: MenuDataItem;
    };
    route: ProLayoutProps['route'] & {
        authority: string[];
    };
    settings: Settings;
    dispatch: Dispatch;
    currentUser: UserModel;
}

export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
    breadcrumbNameMap: {
        [path: string]: MenuDataItem;
    };
};
const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
    const {
        dispatch,
        children,
        settings,
        location = {
            pathname: '/',
        },
    } = props;
    const { formatMessage } = useIntl();
    const menuDataRef = useRef<MenuDataItem[]>([]);

    const menuDataRender = (menus=props.currentUser.menu || []): MenuDataItem[] => {
        return menus.map((menu) => {
            return {
                icon: menu.icon,
                name: menu.name,
                locale: false,
                key: menu.dnaStr,
                path: menu.path,
                children: menu.children ? menuDataRender(menu.children) : undefined,
                hideInMenu: menu.type !== 'Menu' && menu.type !== 'Folder'
            } as MenuDataItem;
        });
    };
    /**
     * init variables
     */

    const handleMenuCollapse = (payload: boolean): void => {
        if (dispatch) {
            dispatch({
                type: 'global/changeLayoutCollapsed',
                payload,
            });
        }
    };
    // get children authority
    const authorized = useMemo(
        () => {
            return getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || {
                authority: undefined,
            };
        },
        [location.pathname],
    );

    return (
        <ProLayout
            logo={logo}
            formatMessage={formatMessage}
            onCollapse={handleMenuCollapse}
            onMenuHeaderClick={() => history.push('/')}
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
            itemRender={(route, params, routes, paths) => {
                const first = routes.indexOf(route) === 0;
                return first ? (
                    <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
                ) : (
                    <span>{route.breadcrumbName}</span>
                );
            }}
            footerRender={() => <GlobalFooter />}
            menuDataRender={() => menuDataRender()}
            rightContentRender={() => <RightContent />}
            postMenuData={(menuData) => {
                menuDataRef.current = menuData || [];
                return menuData || [];
            }}
            {...props}
            {...settings}
        >
            <Authorized authority={authorized!.authority} noMatch={noMatch}>
                {children}
            </Authorized>
        </ProLayout>
    );
};

export default connect(({ global, settings, user }: ConnectState) => ({
    collapsed: global.collapsed,
    settings,
    currentUser: user.currentUser,
}))(BasicLayout);
