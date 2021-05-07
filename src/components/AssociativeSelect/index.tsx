import type { UIEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import type { SelectProps, SelectValue } from 'antd/lib/select';
import { useRequest } from 'umi';

export type AssociativeSelectData<DT> = {
    total: number;
    data: DT[];
    page_index: number;
    page_size: number;
};

export type AssociativeSelectProps<VT, DT> = {
    /**
     * label显示的字段名
     */
    labelKey?: string;
    /**
     * value数据的字段名
     */
    valueKey?: string;
    /**
     * 自定义 label 渲染
     * @param item
     * @param page
     */
    labelRender?: (item: DT, page: AssociativeSelectData<DT>) => React.ReactNode;
    /**
     * 自定义value
     * @param item
     * @param page
     */
    valueRender?: (item: DT, page: AssociativeSelectData<DT>) => React.ReactNode;
    /**
     * 自定义单项渲染
     * @param item
     * @param page
     */
    itemRender?: (item: DT, page: AssociativeSelectData<DT>) => React.ReactNode;
    /**
     * 单个项的key
     * @param item
     */
    itemKey?: (item: DT) => string;
    /**
     * 联想搜索时关键词的键
     */
    searchKey?: string;
    /**
     * 数据源获取
     * @param params
     */
    request: (params?: AnyObject) => Promise<any>;
    /**
     * 请求携带的参数，变化后会自动重新加载获取
     */
    params?: AnyObject;
    /**
     * 每页数量
     */
    pageSize?: number;
    /**
     * 当滑动到滚动条底部触发
     * @param evt
     * @param page
     */
    onScrollBottom?: (evt: UIEvent<HTMLDivElement>, page: AssociativeSelectData<DT>) => void;
} & SelectProps<VT>;

/**
 * 联想搜索+滚动分页下拉选择器
 * @param props
 * @constructor
 */
const AssociativeSelect = <VT extends SelectValue = SelectValue, DT extends {} = any>(
    props: AssociativeSelectProps<VT, DT>,
) => {
    const {
        params,
        request,
        loading,
        pageSize = 20,
        labelKey = 'label',
        valueKey = 'value',
        itemKey = valueKey,
        searchKey = labelKey,
        labelRender,
        valueRender,
        itemRender,
        virtual,
        onScrollBottom,
        ...rest
    } = props;
    const defaultPage = {
        total: 0,
        data: [],
        page_index: 1,
        page_size: pageSize,
    };
    const [page, setPage] = useState<AssociativeSelectData<DT>>(defaultPage);
    const requestData = (arg: any, resetData?: boolean) => {
        if (resetData) setPage(defaultPage);
        return request({
            page_index: page.page_index,
            page_size: pageSize,
            ...arg,
        });
    };
    const { run: fetch, loading: fetching } = useRequest(requestData, {
        manual: true,
        throwOnError: true,
        debounceInterval: 500,
        formatResult: (res) => res,
        onSuccess: (res) => {
            const newPage = {
                ...page,
                total: res.total,
                data: page.data?.concat(res.data),
            };
            setPage(newPage);
        },
    });
    useEffect(() => {
        fetch(params);
    }, [params]);
    const getLabel = (item: DT) => {
        if (labelRender) {
            return labelRender(item, page);
        }
        return item[labelKey];
    };
    const getValue = (item: DT) => {
        if (valueRender) {
            return valueRender(item, page);
        }
        return item[valueKey];
    };
    const getKey = (item: DT) => {
        if (typeof itemKey === 'function') {
            return itemKey(item);
        }
        return item[itemKey];
    };
    if (rest.showSearch) {
        rest.onSearch = (val: string) => {
            fetch(
                {
                    ...params,
                    [searchKey]: val || undefined,
                },
                true,
            );
        };
    }
    const onPopupScroll = (evt: UIEvent<HTMLDivElement>) => {
        const { currentTarget } = evt;
        const container = currentTarget.children[0] as HTMLDivElement;
        let isBottom: boolean = false;
        if (virtual) {
            const scroller = container.children[0] as HTMLDivElement;
            const tx = scroller.style.transform.match(/translateY\(\d+px\)/);
            let { scrollTop } = container;
            if (tx?.length) {
                const number = tx[0]?.match(/\d+/);
                if (number) scrollTop = +number[0];
            }
            isBottom = scrollTop + scroller.scrollHeight === container.clientHeight;
        } else {
            isBottom =
                currentTarget.scrollHeight === currentTarget.scrollTop + currentTarget.clientHeight;
        }
        if (isBottom) {
            if (onScrollBottom) onScrollBottom(evt, page);
            fetch({
                page_index: page.page_index + 1,
            });
        }
    };
    const busy = fetching || loading;
    return (
        <Select<VT> {...rest} loading={busy} onPopupScroll={onPopupScroll} virtual={virtual}>
            {page.data.map((item) => {
                return itemRender ? (
                    itemRender(item, page)
                ) : (
                    <Select.Option key={getKey(item)} value={getValue(item)}>
                        {getLabel(item)}
                    </Select.Option>
                );
            })}
        </Select>
    );
};

AssociativeSelect.defaultProps = {
    showSearch: true,
    virtual: true,
};

export default AssociativeSelect;
