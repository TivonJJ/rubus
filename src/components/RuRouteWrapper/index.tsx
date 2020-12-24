import React, { useMemo, useState } from 'react';
import { withRouter } from 'umi';
import type { RouteComponentProps } from 'react-router';

export type RuRouteWrapperConfig = {
    onResume?: (match: any) => void;
    forceRender?: boolean;
    childProps?: AnyObject;
};

type RuRouteRenderProps = {
    child: any;
} & RuRouteWrapperConfig & RouteComponentProps;

const RouteRender: React.FC<RuRouteRenderProps> = (props) => {
    const { children: root, childProps, onResume, forceRender = false } = props;
    let { child: children } = props;
    const isRoot = props.match.isExact;
    const [shouldRenderRoot, setShouldRenderRoot] = useState<boolean>(isRoot);
    useMemo(() => {
        if (props.match.isExact) {
            if (!shouldRenderRoot) setShouldRenderRoot(true);
            if (onResume) onResume(props.match);
        }
    }, [props.match.isExact]);
    if (childProps && children.props?.children) {
        const childrenWithProps = React.Children.map(children.props.children, (item) => {
            const originRender = item.props.render;
            return React.cloneElement(item, {
                render: (cprops: any) => {
                    return originRender({ ...cprops, ...childProps });
                },
            });
        });
        children = React.cloneElement(children, { children: childrenWithProps });
    }
    return (
        <>
            {(shouldRenderRoot || forceRender) && (
                <div style={{ display: isRoot ? '' : 'none' }}>{root}</div>
            )}
            {!isRoot && <div>{children}</div>}
        </>
    );
};

function createRouteWrapper(
    options: RuRouteWrapperConfig = {},
    RootComponent: React.FC | React.ComponentClass,
) {
    return withRouter((props) => {
        const { childProps } = options;
        return (
            <RouteRender
                child={props.children}
                childProps={childProps}
                forceRender={options.forceRender}
                onResume={options.onResume}
                {...props}
            >
                <RootComponent {...props} />
            </RouteRender>
        );
    });
}

export default function RuRouteWrapper(options?: RuRouteWrapperConfig) {
    return (RootComponent: React.FC<any> | React.ComponentClass) => {
        return createRouteWrapper(options, RootComponent);
    };
}
