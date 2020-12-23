import React from 'react';
import { useIntl } from 'umi';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FormatNumberOptions } from 'react-intl';

export interface NumberFormatterOptions extends Omit<FormatNumberOptions, 'style'> {
    valueStyle?: FormatNumberOptions['style'];
}

export interface NumberFormatterProps extends NumberFormatterOptions {
    className?: string;
    style?: React.CSSProperties;
    value?: string | number | null;
    emptyContent?: React.ReactNode;
}

const NumberFormatter = (props: NumberFormatterProps) => {
    const { className, style, value, emptyContent = '-', ...rest } = props;
    const content = NumberFormatter.format(value, rest) || emptyContent;
    return (
        <span className={className} style={style}>
            {content}
        </span>
    );
};

NumberFormatter.format = (
    value?: string | number | null,
    option?: NumberFormatterOptions & FormatNumberOptions,
) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const intl = useIntl();
    let content;
    if (value) {
        if (typeof value === 'string') value = Number(value);
        const opt: NumberFormatterOptions & FormatNumberOptions = { ...option };
        if (opt.valueStyle) {
            opt.style = opt.valueStyle;
            delete opt.valueStyle;
        }
        content = intl.formatNumber(value, opt);
    }
    return content;
};

export default NumberFormatter;
