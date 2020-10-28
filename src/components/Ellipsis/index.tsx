import classNames from 'classnames';
import React, { CSSProperties } from 'react';
import styles from './index.less';

export interface EllipsisProps {
    /**
     * 显示的最大行数
     */
    line?: number;
    /**
     * 移动到文本是否展示完整内容的提示
     */
    tooltip?: boolean;
    style?: CSSProperties;
    className?: string;
}

const Ellipsis: React.FC<EllipsisProps> = (props) => {
    return (
        <div
            className={classNames(styles.ellipsis, props.className)}
            style={{
                ...props.style,
                WebkitLineClamp: props.line,
            }}
        >
            {props.children}
        </div>
    );
};

export default Ellipsis;
