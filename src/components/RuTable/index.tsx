import React, { useEffect, useImperativeHandle, useRef } from 'react';
import type {
    ProTableProps,
    ProColumns,
    ProColumnType,
    ColumnsState as ProColumnsState,
    RequestData,
    ActionType,
} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { FormInstance } from 'antd/lib/form';
import type { SortOrder } from 'antd/lib/table/interface';
import { message } from 'antd';
import { removeEmptyProperties } from '@/utils/utils';

export type RuActionType = ActionType;
export declare type RuColumns<T = any> = ProColumns<T>;
export type RuColumnType<T = unknown> = ProColumnType<T>;
export type RuColumnsState = ProColumnsState;
export type OnRequest<U> = (
    params: U & {
        pageSize?: number;
        current?: number;
        keyword?: string;
    },
    sort: Record<string, SortOrder>,
    filter: Record<string, React.ReactText[]>,
) => ({
    params: U & {
        pageSize?: number;
        current?: number;
        keyword?: string;
    },
    sort: Record<string, SortOrder>,
    filter: Record<string, React.ReactText[]>
});
export type RuTableProp<T extends {}, U extends Record<string, any> = {}> = {
    id?: string;
    onRequest?: OnRequest<U>
    onResponse?: (data: any) => RequestData<T>
    removeRequestParamsEmptyAttribute?: boolean
} & ProTableProps<T, U>;

export type RuTableInstance = {
    key?: string
    actionRef?: React.MutableRefObject<RuActionType|undefined>
    formRef?: React.MutableRefObject<FormInstance|undefined>
};

const tableInstanceSet: Record<string, RuTableInstance> = {};

/**
 * 高级 Table表格
 * @param props
 * @constructor
 */
const RuTable = <T extends {}, U extends Record<string, any> = {}>(props: RuTableProp<T, U>) => {
    const {
        actionRef:propsActionRef,
        formRef:propsFormRef,
        request,
        onRequest,
        onResponse,
        removeRequestParamsEmptyAttribute,
        ...rest
    } = props;
    const actionRef = useRef<RuActionType>();
    const formRef = useRef<FormInstance>();
    // 绑定 action ref
    useImperativeHandle(propsActionRef, () => actionRef.current, [actionRef.current]);
    useEffect(() => {
        if (typeof propsActionRef === 'function' && actionRef.current) {
            propsActionRef(actionRef.current);
        }
    }, [actionRef.current]);
    // 绑定 form ref
    useImperativeHandle(propsFormRef, () => formRef.current, [formRef.current]);
    useEffect(() => {
        if (typeof propsFormRef === 'function' && formRef.current) {
            propsFormRef(formRef.current);
        }
    }, [formRef.current]);
    useEffect(() => {
        if (props.id && tableInstanceSet[props.id]) {
            throw new Error(`The table "${props.id}" already exist`);
        }
        if (props.id) {
            tableInstanceSet[props.id] = {
                actionRef,
                formRef,
            };
        }
        return () => {
            if (props.id) {
                delete tableInstanceSet[props.id];
            }
        };
    }, []);
    const wrapRequest = request
        ? (params: any, sort: any, filter: any) => {
              if (removeRequestParamsEmptyAttribute) {
                  params = removeEmptyProperties(params);
              }
              if (onRequest) {
                  const ret = onRequest(params, sort, filter);
                  params = ret.params;
                  sort = ret.sort;
                  filter = ret.filter;
              }
              return request(params, sort, filter).then((res) => {
                  return onResponse ? onResponse(res) : res;
              });
          }
        : undefined;
    return (
        <ProTable<T, U>
            actionRef={actionRef}
            formRef={formRef}
            request={wrapRequest}
            {...rest}
        />
    );
};

RuTable.defaultProps = {
    onRequest: (params: any,sort: any,filter: any) => {
        // 自定义转换请求数据，把分页字段改成和接口一致
        const newParams = {
            ...params,
            page_num: params.current,
            page_size: params.pageSize,
        };
        delete newParams.current;
        delete newParams.pageSize;
        return {params:newParams,sort,filter};
    },
    onResponse: (res: any = {}): RequestData<any> => {
        // 可以在这里自定义转换返回数据
        return {
            data: res.data,
            total: res.total,
            success: true,
            ...res,
        };
    },
    onRequestError: (err: Error) => {
        message.error(err.message, 5);
    },
    removeRequestParamsEmptyAttribute: true,
};

/**
 * 获取Table实列
 * @param id Table的id
 */
RuTable.getTable = (id: string): RuTableInstance => {
    return {...tableInstanceSet[id],key:id};
};
/**
 * 获取一组Table实列
 * @param id Table的id数组
 */
RuTable.getTables = (id?: string[]): RuTableInstance[] => {
    const tables: RuTableInstance[] = [];
    Object.keys(tableInstanceSet).forEach(key=>{
        if(id && id.length){
            if(id.indexOf(key)!==-1){
                tables.push({
                    key,
                    ...tableInstanceSet[key]
                });
            }
        }else {
            tables.push({
                key,
                ...tableInstanceSet[key]
            });
        }
    });
    return tables;
};

export default RuTable;
