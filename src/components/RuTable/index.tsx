import React, { useEffect, useRef } from 'react';
import ProTable, {
    ProTableProps,
    ProColumns,
    ProColumnType,
    ColumnsState as ProColumnsState,
} from '@ant-design/pro-table';
import { FormInstance } from 'antd/lib/form';
import { SortOrder } from 'antd/lib/table/interface';
import { RequestData } from '@ant-design/pro-table/lib/useFetchData';
import { message } from 'antd';
import { removeEmptyProperty } from '@/utils/utils';

export interface RuTableActionType {
    reload: (resetPageIndex?: boolean) => void;
    reloadAndRest?: () => void;
    reset?: () => void;
    clearSelected?: () => void;
}
declare type ParamsType = {
    [key: string]: any;
};
export declare type RuColumns<T = any> = ProColumns<T>;
export type RuColumnType<T = unknown> = ProColumnType<T>;
export type RuColumnsState = ProColumnsState;
export interface RuTableProp<T extends {}, U extends ParamsType> extends ProTableProps<T, U> {
    id?: string;
    onRequest?: (
        params: U & {
            pageSize?: number;
            current?: number;
            keyword?: string;
        },
        sort: {
            [key: string]: SortOrder;
        },
        filter: {
            [key: string]: React.ReactText[];
        },
    ) => any;
    onResponse?: (data: any) => RequestData<T>;
    removeRequestParamsEmptyAttribute?: boolean;
}

export type RuTableInstance =
    | {
          actionRef?: RuTableActionType;
          formRef?: FormInstance;
      }
    | undefined
    | null;

const tableInstanceSet: { [name: string]: RuTableInstance } = {};

/**
 * 高级 Table表格
 * @param props
 * @constructor
 */
const RuTable = <T extends {}, U extends ParamsType>(props: RuTableProp<T, U>) => {
    const {
        actionRef,
        formRef,
        request,
        onRequest,
        onResponse,
        removeRequestParamsEmptyAttribute,
        ...rest
    } = props;
    const insideActionRef = useRef();
    const insideFormRef = useRef();
    useEffect(() => {
        if (props.id && tableInstanceSet[props.id]) {
            throw new Error(`${props.id} is already exist`);
        }
        if (actionRef) {
            if (typeof actionRef === 'function') {
                actionRef(insideActionRef.current as any);
            } else {
                actionRef.current = insideActionRef.current;
            }
        }
        if (formRef) {
            if (typeof formRef === 'function') {
                formRef(insideFormRef.current as any);
            } else {
                formRef.current = insideFormRef.current;
            }
        }
        if (props.id) {
            tableInstanceSet[props.id] = {
                actionRef: insideActionRef.current,
                formRef: insideFormRef.current,
            };
        }
        return () => {
            if (props.id) {
                tableInstanceSet[props.id] = undefined;
                delete tableInstanceSet[props.id];
            }
        };
    }, []);
    const wrapRequest = request
        ? (params: any, sort: any, filter: any) => {
              if (removeRequestParamsEmptyAttribute) {
                  params = removeEmptyProperty(params);
              }
              if (onRequest) {
                  params = onRequest(params, sort, filter);
              }
              return request(params, sort, filter).then((res) => {
                  return onResponse ? onResponse(res) : res;
              });
          }
        : undefined;
    return (
        <ProTable<T, U>
            actionRef={insideActionRef}
            formRef={insideFormRef}
            request={wrapRequest}
            {...rest}
        />
    );
};

RuTable.defaultProps = {
    onRequest: (params: any) => {
        // 自定义转换请求数据，把分页字段改成和接口一致
        const newParams = {
            ...params,
            page_num: params.current,
            page_size: params.pageSize,
        };
        delete newParams.current;
        delete newParams.pageSize;
        return newParams;
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
    return tableInstanceSet[id];
};
/**
 * 获取一组Table实列
 * @param id Table的id数组
 */
RuTable.getTables = (id?: string[]): RuTableInstance[] => {
    if (!id) return Object.values(tableInstanceSet);
    return id.map((item) => (item ? tableInstanceSet[item] : null)).filter((ref) => ref != null);
};

export default RuTable;
