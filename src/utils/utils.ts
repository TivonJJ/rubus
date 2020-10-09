import { parse } from 'querystring';
import crypto from 'crypto';
import joinPath from 'join-path';
import moment, { MomentInput } from 'moment';
import { PaginationProps } from 'antd/lib/pagination';

// 获取页面Query参数
export const getPageQuery = () => parse(window.location.href.split('?')[1]);
/**
 * MD5加密
 * @param text
 * @param digestType
 */
export const md5 = (text:string, digestType:"latin1" | "hex" | "base64" = 'hex'):string => {
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
export function removeEmptyProperty(obj: { [key:string]:any }, options:{ignores?:string[],trim?:boolean} = {}):object|null {
    if(!obj)return null;
    Object.keys(obj).forEach(key=>{
        let val = obj[key];
        if (options.ignores && options.ignores.indexOf(key) !== -1) {
            return;
        }
        if (options.trim && typeof val==='string'){
            val = val.trim();
            obj[key] = val;
        }
        if (val == null || val === '') {
            obj[key] = undefined;
            delete obj[key];
        }
        if(typeof val==='object'){
            removeEmptyProperty(val,options);
        }
    })
    return obj;
}
/**
 * 移除对象中指定的属性
 * @param obj 操作对象
 * @param shouldRemoveProps 需要移除的字段
 */
export const removeProperties = (obj:AnyObject, shouldRemoveProps:string[]=[]):AnyObject => {
    const props = Array.isArray(shouldRemoveProps) ? shouldRemoveProps : [shouldRemoveProps];
    props.forEach(key => {
        obj[key] = undefined;
        delete obj[key];
    });
    return obj;
};
// 数组去重
export function unique(arr:any[]):any[] {
    arr.sort(); // 先排序
    const res = [arr[0]];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== res[res.length - 1]) {
            res.push(arr[i]);
        }
    }
    return res;
}
// 判断是否Promise对象
export function isPromise(obj:any):boolean {
    return (
        !!obj &&
        (typeof obj === 'object' || typeof obj === 'function') &&
        typeof obj.then === 'function'
    );
}

/**
 * 部署到非根目录时,通过这个方法获取静态资源的完整的路径
 * @param path 相对路径
 */
export function getResourcePath(path:string):string {
    return joinPath(AppStartArgs.basePath, path);
}
// 获取两个时间的间隔，自动格化式显示
export function durationDate(pre:MomentInput,next:MomentInput):string|null {
    if(!pre || !next)return null; // 缺少开始或结束时间都返回空
    pre = moment(pre);
    next = moment(next);
    if(pre.isSame(next))return null;// 前后时间相等返回空
    return pre.to(next,true);
}

/**
 * 补零
 * @param text 需要补零的参数
 * @param count 补零位数
 */
export function zeroize(text:string,count:number):string|null{
    if(text==null)return null;
    return (Array(count).join('0') + text).slice(-count);
}
// 常见类型转换为布尔值
export function toBoolean(val:any):boolean {
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

export interface DefaultPaginationProps extends PaginationProps{
    data?: any[]
}
// 创建一个默认的分页对象
export function createPagination(props:DefaultPaginationProps = {}) {
    const {
        showSizeChanger = true,
        showQuickJumper = true,
        size = 'small',
        pageSizeOptions = ['10', '20', '30', '40'],
        pageSize = 20,
        current = 1,
        total = 0,
        data = [],
    } = props;
    return {
        ...props,
        showSizeChanger,
        showQuickJumper,
        size,
        pageSizeOptions,
        pageSize,
        current,
        total,
        data,
    };
}

export interface ObjectProsMappingConfig{
    keepOriginalProp?: boolean,
    deep?: boolean,
}
export type ObjectProsMappingMap = {[key:string]:string}
/**
 * 对象字段名映射转换
 * @param source
 * @param mapping
 * @param config
 */
export function objectPropsMapping(source:AnyObject|AnyObject[],mapping:ObjectProsMappingMap,config:ObjectProsMappingConfig = {}):AnyObject{
    const {keepOriginalProp=false,deep=false} = config;
    if(Array.isArray(source)){
        source.forEach((sourceItem)=>{
            objectPropsMapping(sourceItem,mapping,config);
        })
    }else {
        Object.keys(source).forEach((key:string)=>{
            const val:any = source[key];
            if(deep && typeof val === 'object'){
                if(Array.isArray(val)){
                    val.forEach((item)=>objectPropsMapping(item,mapping,config))
                }else {
                    objectPropsMapping(val,mapping,config);
                }
            }else if(key in mapping) {
                const newKey = mapping[key];
                source[newKey] = val;
                if(!keepOriginalProp){
                    delete source[key];
                }
            }
        })
    }
    return source;
}
