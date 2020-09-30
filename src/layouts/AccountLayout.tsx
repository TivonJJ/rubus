import { MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useIntl, ConnectProps, connect } from 'umi';
import React from 'react';
import { ConnectState } from '@/models/connect';
import GlobalFooter from '@/components/GlobalFooter';
import styles from './AccountLayout.less';

export interface UserLayoutProps extends Partial<ConnectProps> {
    breadcrumbNameMap: {
        [path: string]: MenuDataItem;
    };
}

const UserLayout: React.FC<UserLayoutProps> = (props) => {
    const {
        route = {
            routes: [],
        },
    } = props;
    const { routes = [] } = route;
    const {
        children,
        location = {
            pathname: '',
        },
    } = props;
    const { formatMessage } = useIntl();
    const { breadcrumb } = getMenuData(routes);
    const title = getPageTitle({
        pathname: location.pathname,
        formatMessage,
        breadcrumb,
        ...props,
    });
    return (
        <HelmetProvider>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <div className={styles.container}>
                <div className={styles.content}>
                    {children}
                </div>
                <GlobalFooter className={styles.footer} />
            </div>
        </HelmetProvider>
    );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
