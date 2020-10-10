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
import React from 'react';
import { Link, useIntl, connect, Dispatch, history } from 'umi';
// import { Result, Button } from 'antd';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import GlobalFooter from '@/components/GlobalFooter';
import { UserModel } from '@/models/user';
import { convertMenuToMenuRenderData } from '@/utils/menu';
import classNames from 'classnames';
import styles from './BasicLayout.less';
import logo from '../assets/logo.png';
import { DefaultSettings } from '../../config/defaultSettings';

// const noMatch = (
//     <Result
//         status={403}
//         title="403"
//         subTitle="Sorry, you are not authorized to access this page."
//         extra={
//             <Button type="primary">
//                 <Link to="/user/login">Go Login</Link>
//             </Button>
//         }
//     />
// );

export interface BasicLayoutProps extends ProLayoutProps {
    breadcrumbNameMap: {
        [path: string]: MenuDataItem;
    };
    route: ProLayoutProps['route'] & {
        authority: string[];
    };
    settings: Settings & DefaultSettings;
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
        collapsed,
        currentUser,
    } = props;
    const { formatMessage } = useIntl();

    const handleMenuCollapse = (payload: boolean): void => {
        if (dispatch) {
            dispatch({
                type: 'global/changeLayoutCollapsed',
                payload,
            });
        }
    };
    return (
        <div className={classNames(styles.basicLayout, styles[settings.layout])}>
            <ProLayout
                logo={logo}
                formatMessage={formatMessage}
                onCollapse={handleMenuCollapse}
                onMenuHeaderClick={() => history.push('/')}
                headerTitleRender={(logoDom, titleDom) => {
                    return (
                        <div
                            className={
                                classNames(
                                    styles.mixTitle,
                                    { [styles.mixTitleCollapsed]: collapsed },
                                )
                            }
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
                itemRender={(route, params, routes, paths) => {
                    const first = routes.indexOf(route) === 0;
                    return first ? (
                        <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
                    ) : (
                        <span>{route.breadcrumbName}</span>
                    );
                }}
                footerRender={() => <GlobalFooter />}
                menuDataRender={() => convertMenuToMenuRenderData(currentUser.menu || [])}
                rightContentRender={() => <RightContent />}
                {...props}
                {...settings}
            >
                {children}
            </ProLayout>
        </div>
    );
};

export default connect(({ global, settings, user }: ConnectState) => ({
    collapsed: global.collapsed,
    settings,
    currentUser: user.currentUser,
}))(BasicLayout as React.FC);
