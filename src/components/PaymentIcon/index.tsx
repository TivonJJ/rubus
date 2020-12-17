import React from 'react';
import classnames from 'classnames';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import styles from './index.less';

export interface PaymentIconProps {
    code: string | number;
    size?: number;
    title?: string;
    text?: string;
    grayscale?: boolean;
    className?: string;
    style?: CSSStyleRule;
}

const ICON_POS_ARRAY = [
    [
        'CashPay',
        'Alipay',
        'WechatPay',
        'UnionPay_QR',
        'UnionPay',
        'Visa',
        'Mastercard',
        'JCB',
        'DinersClub',
        'AmericanExpress',
        'MembershipCard',
        'GroupBuying',
        'GiftCard',
        'CashCoupon',
        'Free',
        'TakeAway',
        'Other',
        'ICBCEPay',
    ],
];

const CODE_POS_MAP = (() => {
    const map = {};
    ICON_POS_ARRAY.forEach((row, y) => {
        row.forEach((item, x) => {
            map[item] = [x, y];
        });
    });
    return map;
})();

const PaymentIcon: React.FC<PaymentIconProps> = (props) => {
    const { className, style, text, title, code, size = 20, grayscale } = props;
    const iconPosition = CODE_POS_MAP[code];
    let x = 0;
    let y = 0;
    if (iconPosition) {
        x = -(iconPosition[0] * size);
        y = -(iconPosition[1] * size);
    }
    const icon = (
        <>
            <span
                className={classnames(
                    styles.paymentIcon,
                    { [styles.empty]: !iconPosition },
                    { [styles.grey]: grayscale },
                    className,
                )}
                style={{
                    ...style,
                    width: size,
                    height: size,
                    backgroundPosition: `${x}px ${y}px`,
                }}
            >
                {iconPosition ? null : <QuestionCircleOutlined style={{ color: '#ccc' }} />}
            </span>
            {text && <span className={styles.text}>{text}</span>}
        </>
    );
    return title ? <Tooltip title={title}>{icon}</Tooltip> : icon;
};

export default PaymentIcon;
