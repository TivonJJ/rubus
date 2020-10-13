import { Button, Col, Input, Row } from 'antd';
import React  from 'react';
import { ConnectProps, ConnectState } from '@/models/connect';
import { connect } from 'umi';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { SysUserMenusModelState } from './model';
import styles from './style.less';

type IConnectState = ConnectState & {
    sysUserMenusModel: SysUserMenusModelState
};

export interface ToolbarProps extends ConnectProps{
    sysUserMenusModel: SysUserMenusModelState,
    onSave:()=>void
}

const Toolbar:React.FC<ToolbarProps> = (props)=>{
    const {sysUserMenusModel:{searchValue,menuChanged},onSave} = props;
    const search = (evt:any)=>{
        props.dispatch({
            type: 'sysUserMenusModel/updateState',
            payload:{
                searchValue: evt.target.value
            }
        })
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
                    <DownloadOutlined />
                    <UploadOutlined />
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
