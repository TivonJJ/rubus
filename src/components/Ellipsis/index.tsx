import classNames from 'classnames';
import React, { CSSProperties, MouseEventHandler } from 'react';
import { Popover } from 'antd';
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
    onClick?: MouseEventHandler;
}

const Ellipsis: React.FC<EllipsisProps> = (props) => {
    const { style, className, children, onClick, line, tooltip } = props;
    const content = (
        <div
            className={classNames(styles.ellipsis, className)}
            onClick={onClick}
            style={{
                ...style,
                WebkitLineClamp: line,
            }}
        >
            {children}
        </div>
    );
    return tooltip ? <Popover content={children}>{content}</Popover> : content;
};

export default Ellipsis;
