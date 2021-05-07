import React from 'react';
import { getLocale } from 'umi';
import type { NumberFormatterOptions, NumberFormatterProps } from './NumberFormatter';
import NumberFormatter from './NumberFormatter';

export declare type MoneyFormatterOptions = Omit<NumberFormatterOptions, 'valueStyle'>;

export declare type MoneyFormatterProps = Omit<NumberFormatterProps, 'valueStyle'>;

/**
 * 货币格式化组件
 * @param props
 * @constructor
 */
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

/**
 * 货币转换地区码表
 */
MoneyFormatter.LocaleCurrencyMap = {
    'zh-CN': 'CNY',
    'en-US': 'USD',
};

/**
 * 货币格式化静态函数
 * @param value
 * @param option
 */
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
