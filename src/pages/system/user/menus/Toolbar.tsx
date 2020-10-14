import { Button, Col, Input, Row, Modal } from 'antd';
import React, { ChangeEvent, MouseEvent, useRef } from 'react';
import { ConnectProps, ConnectState } from '@/models/connect';
import { connect } from 'umi';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { MenuList, planToTree, treeToPlan } from '@/utils/menu';
import { SysUserMenusModelState } from './model';
import styles from './style.less';

type IConnectState = ConnectState & {
    sysUserMenusModel: SysUserMenusModelState
};

export interface IToolbarProps extends ConnectProps{
    sysUserMenusModel: SysUserMenusModelState,
    onSave:()=>void
}

const Toolbar:React.FC<IToolbarProps> = (props)=>{
    const {sysUserMenusModel:{searchValue,menuChanged,menus},onSave} = props;
    const fileSelectRef = useRef<any>()
    const search = (evt:any)=>{
        props.dispatch({
            type: 'sysUserMenusModel/updateState',
            payload:{
                searchValue: evt.target.value
            }
        })
    }
    const exportJSON=(evt:MouseEvent&{currentTarget:HTMLAnchorElement})=>{
        const fileName = `menus-${Date.now()}.json`;
        evt.currentTarget.download = fileName;
        const list = treeToPlan(menus);
        evt.currentTarget.href = `data:text/plain,${JSON.stringify(list)}`;
    }
    const handleFile=(evt:ChangeEvent&{currentTarget:HTMLInputElement})=>{
        const {files} = evt.currentTarget;
        if(!files || !files.length)return;
        const file = files[0];
        if(!/\.json$/.test(file.name)){
            Modal.error({
                title: '仅支持json格式文件'
            });
            return;
        }
        if(window.FileReader){
            const reader = new FileReader();
            reader.onload = ()=>{
                let json:MenuList|null = null;
                try{
                    json = JSON.parse(reader.result as string);
                }catch (e){
                    Modal.error({
                        title: '资源导入失败',
                        content: e.message
                    })
                }
                if(json){
                    json.forEach(item=>{
                        // item.local_added = true;
                        // item.res_id = undefined;
                        item.updateTime = undefined;
                    });
                    props.dispatch({
                        type:'sysUserMenusModel/selectMenu',
                        payload:null
                    });
                    props.dispatch({
                        type:'sysUserMenusModel/updateMenus',
                        payload: planToTree(menus)
                    });
                }
            };
            reader.readAsText(file);
        }else {
            Modal.error({
                content: '您的浏览器不支持文件读取'
            })
        }
        fileSelectRef.current.value = null;
    }
    return (
        <div className={styles.toolbar}>
            <Row gutter={12}>
                <Col md={12} sm={24}>
                    <Input.Search
                        className={styles.search}
                        placeholder="快速查找"
                        onChange={search}
                        value={searchValue}
                        allowClear
                    />
                    <Button.Group className={styles.actions}>
                        <Button>
                            <a onClick={exportJSON} title="导出">
                                <DownloadOutlined />
                            </a>
                        </Button>
                        <Button title="导入" onClick={()=>fileSelectRef.current.click()}>
                            <UploadOutlined />
                            <input
                                type="file"
                                style={{display:'none'}}
                                id='uploadel'
                                ref={fileSelectRef}
                                onChange={handleFile}
                            />
                        </Button>
                    </Button.Group>
                </Col>
                <Col md={12} sm={24} className="text-right">
                    <Button type="primary" onClick={onSave} disabled={!menuChanged}>
                        保存
                    </Button>
                </Col>
            </Row>
        </div>
    )
}

export default connect(({ sysUserMenusModel }:IConnectState)=>({
    sysUserMenusModel
}))(Toolbar)
