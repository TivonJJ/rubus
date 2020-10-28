import React, { ChangeEvent } from 'react';
import moment from 'moment';
import { reverseObjectKeyValue } from '@/utils/utils';

type Pipe = {
    input: (...args: any[]) => any;
    output: (...args: any[]) => any;
};
type PipeWrapper = (...args: any[]) => Pipe;
export type PipeType = PipeWrapper & Pipe;

export interface FormItemInterceptorProps {
    pipes: PipeType | PipeType[] | Pipe | Pipe[];
    onChange?: (values: ChangeEvent, ...args: any[]) => void;
    valuePropName?: string;
}
export interface IDefaultPipes {
    DateString: PipeType;
    String: PipeType;
    Number: PipeType;
    Mapping: PipeType;
    Bool2Number: PipeType;
    Number2Bool: PipeType;
    ArrayString: PipeType;
}

/**
 * 预置处理管道
 */
const DefaultPipes = {
    /**
     * 时间字符串转换，统一时间格式为 String
     * @param options
     * @constructor
     */
    DateString: (options: { format?: string } = {}) => {
        return {
            input(value: any) {
                if (!value) return value;
                return moment(value);
            },
            output(value: any) {
                if (typeof options === 'string') {
                    options = { format: options };
                }
                const { format = 'YYYY-MM-DD HH:mm:ss' } = options;
                if (!value) return value;
                if (Array.isArray(value)) {
                    value = value.map((m) => m.format(format));
                } else {
                    value = value.format(format);
                }
                return value;
            },
        };
    },
    /**
     * 统一格式为 String
     */
    String: {
        input(value: any) {
            if (value == null) return value;
            return String(value);
        },
        output(value: any) {
            if (value == null) return value;
            return String(value);
        },
    },
    /**
     * 统一格式为 Number
     */
    Number: {
        input(value: any) {
            if (value == null) return value;
            return Number(value);
        },
        output(value: any) {
            if (value == null) return value;
            return Number(value);
        },
    },
    /**
     * map 映射
     * @param map 映射表
     * @constructor
     */
    Mapping: (map: AnyObject = {}) => {
        const reverseMap = reverseObjectKeyValue(map);
        return {
            input(value: string) {
                return reverseMap[value];
            },
            output(value: string) {
                return map[value];
            },
        };
    },
    /**
     * Boolean值转Number值
     * @param trueNumber 真值对应的数值
     * @param falseNumber 假值对应的数值
     * @constructor
     */
    Bool2Number: (trueNumber: number = 1, falseNumber: number = 0) => {
        if (isNaN(trueNumber) || isNaN(falseNumber)) {
            throw new TypeError('Argument 1,2 should be a number');
        }
        return {
            input(value: any) {
                return value == trueNumber;
            },
            output(value: any) {
                return value === true ? trueNumber : falseNumber;
            },
        };
    },
    /**
     * Number值转Boolean
     * @param trueNumber 真值对应的数值
     * @param falseNumber 假值对应的数值
     * @constructor
     */
    Number2Bool: (trueNumber: number = 1, falseNumber: number = 0) => {
        if (isNaN(trueNumber) || isNaN(falseNumber)) {
            throw new TypeError('Argument 1,2 should be a number');
        }
        return {
            input(value: any) {
                return value === true ? trueNumber : falseNumber;
            },
            output(value: any) {
                return value == trueNumber;
            },
        };
    },
    /**
     * 数组转为指定间隔符间隔的字符串
     * @param splitter 间隔符 默认,
     * @constructor
     */
    ArrayString: (splitter: string = ',') => {
        return {
            input(value: any) {
                if (!value) return [];
                if (typeof value === 'string') return value.split(splitter);
                return value;
            },
            output(value: any) {
                if (Array.isArray(value)) return value.join(splitter);
                return value;
            },
        };
    },
} as IDefaultPipes;

/**
 * Form 表单数据转换拦截器
 * @param props
 * @constructor
 */
const FormItemInterceptor: React.FC<FormItemInterceptorProps> & { Pipes: IDefaultPipes } = (
    props,
) => {
    const { pipes, children, onChange, valuePropName } = props;
    const pipeList: PipeWrapper[] | Pipe[] = Array.isArray(pipes) ? pipes : [pipes];
    const frequentlyValuePropsName = ['checked', 'value'];
    let valKey = 'value';
    if (valuePropName) {
        valKey = valuePropName;
    } else {
        frequentlyValuePropsName.forEach((name) => {
            if (name in props) {
                valKey = name;
            }
        });
    }
    const value = props[valKey];
    compose(pipeList, value, 'onRender');
    // @ts-ignore
    return React.cloneElement(children, {
        [valKey]: compose(pipeList, value, 'input', valKey),
        onChange(val: any, ...args: any[]) {
            return onChange && onChange(compose(pipeList, val, 'output', valKey), value, ...args);
        },
    });
};

FormItemInterceptor.Pipes = DefaultPipes;

function compose(list: PipeWrapper[] | Pipe[], val: any, action: string, valKey?: string) {
    let resultVal = getValue(val, valKey);
    list.forEach((pipe: PipeWrapper | Pipe) => {
        if (typeof pipe === 'function') {
            pipe = pipe();
        }
        if (pipe[action]) {
            resultVal = pipe[action](resultVal);
        }
    });
    return resultVal;
}

function getValue(value: any, valKey?: string) {
    if (valKey && value && typeof value === 'object' && value.target) return value.target[valKey];
    return value;
}

export default FormItemInterceptor;
