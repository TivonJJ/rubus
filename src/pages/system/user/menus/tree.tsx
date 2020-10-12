import React, { useState } from 'react';
import { connect } from 'umi';
import { Input, Tree as AntTree } from 'antd';
import { ConnectProps, ConnectState } from '@/models/connect';
import { loop, MenuItem, MenuList } from '@/utils/menu';
import { DataNode } from 'antd/lib/tree';
import debounce from 'lodash/debounce'
import {SysUserMenusModelState} from './model';

type IConnectState = ConnectState & {
    sysUserMenusModel: SysUserMenusModelState
};

export interface TreeProps extends ConnectProps{
    sysUserMenusModel: SysUserMenusModelState;
}

const loopMenu = (data:MenuList, key:string, callback:(item:MenuItem,index:number,arr:MenuList)=>void) => {
    for (let i = 0; i < data.length; i++) {
        if (data[i].dnaStr === key) {
            callback(data[i], i, data);
            return;
        }
        const {children} = data[i];
        if (children) {
            loopMenu(children, key, callback);
        }
    }
};

const Tree:React.FC<TreeProps>=(props)=>{
    const {sysUserMenusModel:{menus,selectedMenu}} = props;
    const [expandedKeys,setExpandedKeys] = useState<string[]>();
    const [autoExpandParent,setAutoExpandParent] = useState<boolean>();
    const [searchValue,setSearchValue] = useState<string>();
    const adaptMenuData=(data:MenuList):DataNode[]=>{
        return data.map((item)=>{
            return {
                key: item.dnaStr,
                title: item.name,
                children: adaptMenuData(item.children||[])
            }
        })
    }
    const treeData = adaptMenuData(menus);
    const onDrop=(info:any)=>{
        const dropKey = info.node.props.eventKey;
        const dragKey = info.dragNode.props.eventKey;
        const dropPos = info.node.props.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

        const data = [...menus];
        loopMenu(data, dragKey, (dragObj, index, arr) => {
            arr.splice(index, 1);
            if (!info.dropToGap) {
                loopMenu(data, dropKey, item => {
                    item.children = item.children || [];
                    item.children.push(dragObj);
                });
            } else if (
                (info.node.props.children || []).length > 0 && // Has children
                info.node.props.expanded && // Is expanded
                dropPosition === 1 // On the bottom gap
            ) {
                loopMenu(data, dropKey, item => {
                    item.children = item.children || [];
                    // where to insert 示例添加到头部，可以是随意位置
                    item.children.unshift(dragObj);
                });
            } else {
                loopMenu(data, dropKey, (item, i, ar) => {
                    if (dropPosition === -1) {
                        ar.splice(i, 0, dragObj);
                    } else {
                        ar.splice(i + 1, 0, dragObj);
                    }
                });
            }
        });
        props.dispatch({
            type: 'sysUserMenusModel/updateMenus',
            payload: data,
        })
    }
    const search = debounce((value)=>{
        const keys:string[] = [];
        if(value){
            loop(menus,(item)=>{
                if(item.name && item.name.indexOf(value) !== -1 && item.dna.length>1){
                    keys.push(item.dnaStr);
                }
            })
        }
        setExpandedKeys(keys);
        setAutoExpandParent(true);
    },800)
    const onSelect=(keys:any[])=>{
        const curKey = keys[0];
        loopMenu(menus,curKey,(menu)=>{
            props.dispatch({
                type: 'sysUserMenusModel/selectMenu',
                payload: menu
            })
        })
    }
    return (
        <div>
            <Input.Search
                placeholder="快速查找"
                onChange={e=>{
                    setSearchValue(e.target.value);
                    search(e.target.value)
                }}
                value={searchValue}
                allowClear
            />
            <AntTree
                draggable
                blockNode
                autoExpandParent={autoExpandParent}
                onDrop={onDrop}
                treeData={treeData}
                expandedKeys={expandedKeys}
                onExpand={(keys)=>{
                    setExpandedKeys(keys as string[]);
                    setAutoExpandParent(false);
                }}
                selectedKeys={selectedMenu?[selectedMenu.dnaStr]:[]}
                onSelect={onSelect}
            />
        </div>
    )
}

export default connect(({sysUserMenusModel}: IConnectState) => ({
    sysUserMenusModel,
}))(Tree);