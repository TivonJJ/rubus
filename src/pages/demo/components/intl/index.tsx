import React, { useMemo } from 'react';
import { FormattedMessage, getAllLocales, useIntl } from 'umi';
import { Card } from 'antd';
import NumberFormatter from '@/components/Formatter/NumberFormatter';
import MoneyFormatter from '@/components/Formatter/MoneyFormatter';

const Index = () => {
    const { formatMessage, formatDate, formatTime } = useIntl();
    const locals = useMemo(() => {
        return getAllLocales().join('、');
    }, []);
    return (
        <Card>
            Supports: {locals}
            <h1>{formatMessage({ id: 'pages.demo.components.intl.cn' })}</h1>
            {/* 用法一 */}
            <div>{formatMessage({ id: 'pages.demo.components.intl.text' })}</div>
            {/* 用法二 */}
            <div>
                <FormattedMessage id={'pages.demo.components.intl.text'} />
            </div>
            <div>{formatMessage({ id: 'pages.demo.components.intl.exp' }, { name: '叮叮猫' })}</div>
            <div
                dangerouslySetInnerHTML={{
                    __html: formatMessage({ id: 'pages.demo.components.intl.html' }),
                }}
            />
            <div>
                Date: {formatDate(new Date())} {formatTime(new Date())}
            </div>
            <div>
                Number format <NumberFormatter value={1237891.37821} />
            </div>
            <div>
                Money format <MoneyFormatter value={1237891.37821} />
            </div>
        </Card>
    );
};

export default Index;
