import React from 'react';
import { getLocale, useRequest } from 'umi';
import { Alert, Spin, Tree as AntTree } from 'antd';
import type { MenuList } from '@/utils/menu';
import { loop } from '@/utils/menu';
import type { DataNode } from 'antd/lib/tree';
import { TypeIconMap } from '@/constants/menu';
import { parseJSONSafety } from '@/utils/utils';
import { getMenus } from './service';

type Key = string | number;

export type IRoleTreeSelectProps = {
    fetching?: boolean;
    value?: Key[];
    onChange?: (
        values:
            | {
                  checked: Key[];
                  halfChecked: Key[];
              }
            | Key[],
    ) => void;
};

const Tree: React.FC<IRoleTreeSelectProps> = (props) => {
    const { value, onChange } = props;
    const local = getLocale();
    const { data: menus, error, loading: fetchingMenus } = useRequest(getMenus, {
        formatResult: (data = []) => {
            loop(data, (menu) => {
                menu.name = parseJSONSafety(menu.name, {});
            });
            return data;
        },
    });
    const adaptMenuData = (data: MenuList): DataNode[] => {
        return data.map((item) => {
            return {
                key: item.id,
                title: item.name[local],
                icon: React.createElement(TypeIconMap[item.type]),
                children: adaptMenuData(item.children || []),
            };
        });
    };
    const treeData = adaptMenuData(menus || []);
    if (error) {
        return <Alert message={error.message} type={'error'} showIcon />;
    }
    return (
        <Spin spinning={fetchingMenus}>
            {treeData.length > 0 ? (
                <AntTree
                    showIcon
                    checkable
                    autoExpandParent={false}
                    treeData={treeData}
                    onCheck={onChange}
                    checkedKeys={value}
                />
            ) : (
                <span className={'text-muted'}>请先配置权限资源</span>
            )}
        </Spin>
    );
};

export default Tree;
