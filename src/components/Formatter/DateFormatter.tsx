import moment from 'moment';
import React from 'react';

export type DateFormatterProps = {
    className?: string;
    style?: React.CSSProperties;
    /**
     * 需要转换的时间  Moment|string|Date|number
     */
    value?: moment.MomentInput;
    /**
     * 格式化规则 默认 YYYY-MM-DD HH:mm:ss
     */
    format?: string;
    /**
     * 当无时间或时间无效时显示的内容  默认-
     */
    emptyContent?: React.ReactNode;
};

/**
 * 时间格式化
 * @param props
 * @constructor
 */
const DateFormatter = (props: DateFormatterProps) => {
    const { className, style, value, format, emptyContent = '-' } = props;
    return (
        <span className={className} style={style}>
            {value ? DateFormatter.format(value, format) : emptyContent}
        </span>
    );
};

/**
 * 时间转换静态函数
 * @param date
 * @param format
 */
DateFormatter.format = (date: moment.MomentInput, format: string = 'YYYY-MM-DD HH:mm:ss') => {
    return moment(date).format(format);
};

export default DateFormatter;
