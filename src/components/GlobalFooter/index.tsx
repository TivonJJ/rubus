import { DefaultFooter, FooterProps } from '@ant-design/pro-layout';
import React from 'react';

export interface GlobalFooterProps extends FooterProps{}

const GlobalFooter: React.FC<GlobalFooterProps> = (props) => {
    return <DefaultFooter {...props} />;
};

GlobalFooter.defaultProps = {
    copyright: `2020 Rubus Starter kit ${AppStartArgs.bv ? `Ver:${AppStartArgs.bv}` : ''}`,
    links: false,
};

export default GlobalFooter;
