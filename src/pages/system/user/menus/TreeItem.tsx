import React from 'react';
import { MenuItem } from '@/utils/menu';
import { connect, getLocale } from 'umi';
import { ConnectProps, ConnectState } from '@/models/connect';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import { SysUserMenusModelState } from './model';
import styles from './style.less';

type IConnectState = ConnectState & {
    sysUserMenusModel: SysUserMenusModelState
};

export interface TreeItemProps extends ConnectProps{
    menu:MenuItem
    highlight?:string
    sysUserMenusModel: SysUserMenusModelState
    onInsert: (level:number,target?:MenuItem)=> void
    onDel: (menu:MenuItem)=>void
}

const TreeItem:React.FC<TreeItemProps> = (props)=>{
    const {menu,highlight,sysUserMenusModel:{selectedMenu},onInsert=()=>null,onDel=()=>null} = props;
    const name:string = menu.name?menu.name[getLocale()] || '' : '';
    let renderName:React.ReactNode = name;
    if(highlight && name){
        const index = name.indexOf(highlight);
        const beforeStr = name.substr(0, index);
        const afterStr = name.substr(index + highlight.length);
        if(index > -1){
            renderName = (
                <div className="inline-block">
                    {beforeStr}
                    <span style={{ color: '#f50' }}>{highlight}</span>
                    {afterStr}
                </div>
            )
        }
    }
    const isCurrentSel = selectedMenu && selectedMenu.dnaStr===menu.dnaStr;
    return (
        <div className={styles.treeItemTitle}>
            {renderName}
            {isCurrentSel&&
                <div className={styles.treeItemBar}>
                    <MinusCircleOutlined onClick={()=>selectedMenu&&onDel(selectedMenu)} />
                    <Dropdown
                        trigger={["click"]}
                        placement="bottomCenter"
                        overlay={
                            <Menu>
                                <Menu.Item>
                                    <a onClick={()=>onInsert(1,selectedMenu)}>
                                        新建同级菜单
                                    </a>
                                </Menu.Item>
                                <Menu.Item>
                                    <a onClick={()=>onInsert(2,selectedMenu)}>
                                        新增下级菜单
                                    </a>
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <PlusCircleOutlined />
                    </Dropdown>
                </div>
            }
        </div>
    )
}

export default connect(({sysUserMenusModel}: IConnectState) => ({
    sysUserMenusModel,
}))(TreeItem);
