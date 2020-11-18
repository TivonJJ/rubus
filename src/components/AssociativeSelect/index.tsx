import React, { useEffect } from 'react';
import { Select } from 'antd';
import { SelectProps, SelectValue } from 'antd/es/select';

export interface AssociativeSelectProps<VT> extends SelectProps<VT> {
    labelKey?: string;
    valueKey?: string;
    labelRender?: () => any;
    valueRender?: () => any;
    request: (params?: AnyObject) => Promise<any>;
    params?: AnyObject;
    pageSize?: number;
}

const AssociativeSelect = <VT extends SelectValue>(props: AssociativeSelectProps<VT>) => {
    const { params, request, ...rest } = props;
    useEffect(() => {
        console.log('req');
        // request(params).then()
    }, [params]);
    return <Select<VT> {...rest} />;
};

export default AssociativeSelect;
