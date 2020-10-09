import {DefaultFooter, FooterProps} from '@ant-design/pro-layout';
import React from 'react';

export interface GlobalFooterProps extends FooterProps{}

const GlobalFooter: React.FC<GlobalFooterProps> = props => {
    return (
        <DefaultFooter
            copyright={props.copyright}
            links={props.links}
            style={props.style}
            className={props.className}
        />
    );
};

GlobalFooter.defaultProps = {
    copyright: 'Copyright  2020 Rubus Starter kit',
    links: false
};

export default GlobalFooter
