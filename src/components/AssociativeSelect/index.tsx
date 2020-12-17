import React, { UIEvent, useEffect, useState } from 'react';
import { Select } from 'antd';
import { SelectProps, SelectValue } from 'antd/lib/select';
import { useRequest } from 'umi';

export interface AssociativeSelectData<DT> {
    total: number;
    data: DT[];
    page_index: number;
    page_size: number;
}

export interface AssociativeSelectProps<VT, DT> extends SelectProps<VT> {
    labelKey?: string;
    valueKey?: string;
    labelRender?: (item: DT, page: AssociativeSelectData<DT>) => React.ReactNode;
    valueRender?: (item: DT, page: AssociativeSelectData<DT>) => React.ReactNode;
    itemRender?: (item: DT, page: AssociativeSelectData<DT>) => React.ReactNode;
    itemKey?: (item: DT) => string;
    searchKey?: string;
    request: (params?: AnyObject) => Promise<any>;
    params?: AnyObject;
    pageSize?: number;
    onScrollBottom?: (evt: UIEvent<HTMLDivElement>, page: AssociativeSelectData<DT>) => void;
}

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
