import moment from 'moment';
import React from 'react';

export type DateFormatterProps = {
    className?: string;
    style?: React.CSSProperties;
    value?: moment.MomentInput;
    format?: string;
    emptyContent?: React.ReactNode;
};

const DateFormatter = (props: DateFormatterProps) => {
    const { className, style, value, format, emptyContent = '-' } = props;
    return (
        <span className={className} style={style}>
            {value ? DateFormatter.format(value, format) : emptyContent}
        </span>
    );
};

DateFormatter.format = (date: moment.MomentInput, format: string = 'YYYY-MM-DD HH:mm:ss') => {
    return moment(date).format(format);
};

export default DateFormatter;
