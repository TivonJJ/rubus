import type { PropsWithChildren } from 'react';
import React from 'react';
import { Result } from 'antd';
import check  from './CheckPermissions';

type AuthorizedProps = {
    route: string;
    noMatch?: React.ReactNode;
};

const Authorized = (props: PropsWithChildren<AuthorizedProps>) => {
    const {
        children,
        route,
        noMatch = (
            <Result
                status={"403"}
                title={"403"}
                subTitle={"Sorry, you are not authorized to access this page."}
            />
        ),
    } = props;
    const childrenRender: React.ReactNode = typeof children === 'undefined' ? null : children;
    const hasAuth = check(route);
    return (
        <>
            {hasAuth ? childrenRender : noMatch}
        </>
    );
};

Authorized.check = check;

export default Authorized;
