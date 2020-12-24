import type { MenuDataItem,ProSettings } from '@ant-design/pro-layout';
import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import type { ConnectProps} from 'umi';
import { useIntl, connect } from 'umi';
import React from 'react';
import type { ConnectState } from '@/models/connect';
import GlobalFooter from '@/components/GlobalFooter';
import styles from './AccountLayout.less';

export type UserLayoutProps = {
    breadcrumbNameMap: Record<string, MenuDataItem>;
} & Partial<ConnectProps> & ProSettings;

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
        title: formatMessage({id:props.title})
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
