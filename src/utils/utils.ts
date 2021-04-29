import crypto from 'crypto';
import joinPath from 'join-path';

/**
 * MD5加密
 * @param text
 * @param digestType
 */
export const md5 = (text: string, digestType: 'base64' | 'hex' = 'hex'): string => {
    const hash = crypto.createHash('md5');
    hash.update(text);
    return hash.digest(digestType);
};

/**
 * 移除对象中的无效键和空串键，常用语表单数据请求接口时处理，空串对接口来说是有效的
 * @param obj
 * @param options
 * @returns {*}
 */
export function removeEmptyProperties(
    obj: Record<string, any>,
    options: {
        ignores?: string[];
        trim?: boolean;
        deep?: boolean;
    } = {},
): object | null {
    if (!obj) return null;
    Object.keys(obj).forEach((key) => {
        const { ignores, deep = true } = options;
        let val = obj[key];
        if (ignores && ignores.indexOf(key) !== -1) {
            return;
        }
        if (options.trim && typeof val === 'string') {
            val = val.trim();
            obj[key] = val;
        }
        if (val == null || val === '') {
            obj[key] = undefined;
            delete obj[key];
        }
        if (deep && typeof val === 'object') {
            removeEmptyProperties(val, options);
        }
    });
    return obj;
}

/**
 * 移除对象中指定的属性
 * @param obj 操作对象
 * @param shouldRemoveProps 需要移除的字段
 */
export const removeProperties = (obj: AnyObject, shouldRemoveProps: string[] = []): AnyObject => {
    const props = Array.isArray(shouldRemoveProps) ? shouldRemoveProps : [shouldRemoveProps];
    props.forEach((key) => {
        obj[key] = undefined;
        delete obj[key];
    });
    return obj;
};

/**
 * 数组去重
 * @param arr
 */
export function unique(arr: any[]): any[] {
    arr.sort(); // 先排序
    const res = [arr[0]];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== res[res.length - 1]) {
            res.push(arr[i]);
        }
    }
    return res;
}

/**
 * 判断是否Promise对象
 * @param obj
 */
export function isPromise(obj: any): boolean {
    return (
        !!obj &&
        (typeof obj === 'object' || typeof obj === 'function') &&
        typeof obj.then === 'function'
    );
}

/**
 * 部署到非根目录时,通过这个方法获取静态资源的完整的路径
 * @param paths 路径
 */
export function getResourcePath(...paths: string[]): string {
    return joinPath(AppStartArgs.basePath || '/', ...paths);
}

/**
 * 补零
 * @param text 需要补零的参数
 * @param count 补零位数
 */
export function zeroize(text: string, count: number): string | null {
    if (text == null) return null;
    return (Array(count).join('0') + text).slice(-count);
}

/**
 * 常见类型转换为布尔值
 * @param val
 */
export function toBoolean(val: any): boolean {
    if (typeof val === 'boolean') return val;
    switch (val) {
        case 'true':
            return true;
        case 'false':
            return false;
        case 0:
        case '0':
            return false;
        case 1:
        case '1':
            return true;
        default:
            return !!val;
    }
}

/**
 * 翻转对象Key和Value
 * @param obj
 */
export const reverseObjectKeyValue = (obj: AnyObject): AnyObject => {
    const keys = Object.keys(obj);
    const reverseObj = {};
    keys.forEach((key) => {
        const value = obj[key];
        reverseObj[value] = key;
    });
    return reverseObj;
};

/**
 * 对象字段名映射转换
 * @param source
 * @param mapping
 * @param config
 */
export function objectPropsMapping(
    source: AnyObject | AnyObject[],
    mapping: AnyObject,
    config: {
        keepOriginalProp?: boolean;
        deep?: boolean;
        reverse?: boolean;
    } = {},
): AnyObject {
    const { keepOriginalProp = false, deep = false, reverse = false } = config;
    if (reverse) {
        mapping = reverseObjectKeyValue(mapping);
    }
    // eslint-disable-next-line no-shadow,@typescript-eslint/no-shadow
    const doMapping = (source: AnyObject | AnyObject[], mapping: AnyObject) => {
        if (Array.isArray(source)) {
            source.forEach((sourceItem) => {
                doMapping(sourceItem, mapping);
            });
        } else {
            Object.keys(source).forEach((key: string) => {
                const val: any = source[key];
                if (deep && typeof val === 'object') {
                    if (Array.isArray(val)) {
                        val.forEach((item) => doMapping(item, mapping));
                    } else {
                        doMapping(val, mapping);
                    }
                } else if (key in mapping) {
                    const newKey = mapping[key];
                    source[newKey] = val;
                    if (!keepOriginalProp) {
                        delete source[key];
                    }
                }
            });
        }
        return source;
    };
    return doMapping(source, mapping);
}

/**
 * JSON转换器，不会抛出异常
 * @param json JSON内容
 * @param defaultValue 默认值
 */
export const parseJSONSafe = (json: string | AnyObject, defaultValue?: any) => {
    if (typeof json === 'string') {
        try {
            return JSON.parse(json);
        } catch (e) {
            console.warn(e);
            return defaultValue;
        }
    }
    if (json == null) return defaultValue;
    return json;
};
/**
 * 自动省略文字
 * @param text 文字内容
 * @param maxlength 超出自动省略的长度
 */
export const ellipsisText = (text: string, maxlength: number = Infinity): string => {
    if (!text) return text;
    if (text.length > maxlength) {
        return `${text.substring(0, maxlength)}...`;
    }
    return text;
};
/**
 * 隐藏铭感信息
 * @param content
 * @param options
 */
export const maskText = (
    content: string,
    options: { start?: number; end?: number; mask: string; maskCount?: number },
) => {
    if (!content) return '';
    const { start = 0, end = 0, mask = '*', maskCount } = options;
    const startText = content.substr(0, start);
    const endText = content.substr(content.length - end);
    let count = maskCount;
    // 如果不穿maskCount取截取字符的长度
    if (!count) count = content.length - start - end;
    let str = startText;
    for (let i = 0; i < count; i++) {
        str += mask;
    }
    str += endText;
    return str;
};
