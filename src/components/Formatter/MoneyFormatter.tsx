import React from 'react';
import { getLocale } from 'umi';
import type { NumberFormatterOptions, NumberFormatterProps } from './NumberFormatter';
import NumberFormatter from './NumberFormatter';

export declare type MoneyFormatterOptions = Omit<NumberFormatterOptions, 'valueStyle'>;

export declare type MoneyFormatterProps = Omit<NumberFormatterProps, 'valueStyle'>;

const MoneyFormatter = (props: MoneyFormatterProps) => {
    const { className, style, value, ...rest } = props;
    return (
        <span className={className} style={style}>
            {MoneyFormatter.format(value, rest)}
        </span>
    );
};

// MoneyFormatter.defaultProps = {
//     currencyDisplay: 'narrowSymbol'
// }

MoneyFormatter.LocaleCurrencyMap = {
    'zh-CN': 'CNY',
    'en-US': 'USD',
};

MoneyFormatter.format = (value?: string | number | null, option?: MoneyFormatterOptions) => {
    const locale = getLocale();
    if (!option) option = {};
    if (!option.currency) {
        option.currency = MoneyFormatter.LocaleCurrencyMap?.[locale];
    }
    return NumberFormatter.format(value, {
        ...option,
        valueStyle: 'currency',
    });
};

export default MoneyFormatter;
