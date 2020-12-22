import React from 'react';
import { getLocale, useIntl } from 'umi';

export interface MoneyFormatterProps {
    currency?: string;
    value?: string | number | null;
    emptyContent?: React.ReactNode;
}

const MoneyFormatter = (props: MoneyFormatterProps) => {
    const { emptyContent = '-' } = props;
    let { value, currency } = props;
    const locale = getLocale();
    if (!currency) {
        currency = {
            'zh-CN': 'CNY',
            'en-US': 'USD',
        }[locale];
    }
    const intl = useIntl();
    let content = emptyContent;
    if (value) {
        if (typeof value === 'string') value = Number(value);
        content = intl.formatNumber(value, {
            style: 'currency',
            currency,
        });
    }

    return <span>{content}</span>;
};

export default MoneyFormatter;
