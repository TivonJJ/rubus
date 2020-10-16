import React, { useMemo, useState } from 'react';
import { connect,getLocale } from 'umi';
import { Modal, Tree as AntTree } from 'antd';
import { ConnectProps, ConnectState } from '@/models/connect';
import { loop, MenuItem, MenuList, recombineTreesDNA } from '@/utils/menu';
import { DataNode } from 'antd/lib/tree';
import debounce from 'lodash/debounce'
import {
    FolderOpenOutlined,
    LinkOutlined,
    PlayCircleOutlined,
    NotificationOutlined,
    PlusCircleOutlined,
} from '@ant-design/icons';
import {SysUserMenusModelState} from './model';
import TreeItem from './TreeItem';

type IConnectState = ConnectState & {
    sysUserMenusModel: SysUserMenusModelState
};

export interface ITreeProps extends ConnectProps{
    sysUserMenusModel: SysUserMenusModelState;
    onSelect:(menu:MenuItem,key:string)=>void
}

const TypesIconMap = {
    'Folder': <FolderOpenOutlined />,
    'Menu': <LinkOutlined />,
    'Action': <PlayCircleOutlined />,
    'StatusBar': <NotificationOutlined />,
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

const Tree:React.FC<ITreeProps>=(props)=>{
    const {sysUserMenusModel:{menus,selectedMenu,searchValue}} = props;
    const [expandedKeys,setExpandedKeys] = useState<string[]>();
    const [autoExpandParent,setAutoExpandParent] = useState<boolean>(false);
    const local = getLocale();
    const onInsert = (level:number,to?:MenuItem)=>{
        props.dispatch({
            type: 'sysUserMenusModel/insertMenu',
            payload: {
                level,
                to
            }
        })
        if(to?.dnaStr){
            setExpandedKeys([...expandedKeys||[],to.dnaStr])
        }
    }
    const onDel=(menu:MenuItem)=>{
        Modal.confirm({
            title: '确定移除？',
            onOk:()=>{
                props.dispatch({
                    type: 'sysUserMenusModel/delMenu',
                    payload: menu
                })
            }
        })
    }
    const adaptMenuData=(data:MenuList):DataNode[]=>{
        return data.map((item)=>{
            return {
                key: item.dnaStr,
                title:
                    <TreeItem
                        menu={item}
                        highlight={searchValue}
                        onInsert={onInsert}
                        onDel={onDel}
                    />,
                icon: TypesIconMap[item.type],
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
            payload: recombineTreesDNA(data),
        })
    }
    const searchTree = debounce(()=>{
        const keys:string[] = [];
        if(searchValue){
            loop(menus,(item)=>{
                const name = item.name && item.name[local];
                if(name && name.indexOf(searchValue) !== -1 && item.dna.length>1){
                    keys.push(item.dnaStr);
                }
            })
        }
        setExpandedKeys(keys);
        setAutoExpandParent(true);
    },800)
    useMemo(()=>{
        searchTree()
    },[searchValue])
    const onSelect=(keys:any[])=>{
        const curKey = keys[0];
        loopMenu(menus,curKey,(menu)=>{
            props.onSelect(menu,curKey);
        })
    }
    return (
        <div>
            {treeData.length>0?
                <AntTree
                    draggable
                    blockNode
                    showIcon
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
                :
                <PlusCircleOutlined onClick={()=>onInsert(0)} />
            }
        </div>
    )
}

export default connect(({sysUserMenusModel}: IConnectState) => ({
    sysUserMenusModel,
}))(Tree);
