import { Button, Col, Input, Row, Modal } from 'antd';
import type { ChangeEvent, MouseEvent } from 'react';
import React, { useRef } from 'react';
import type { ConnectProps, ConnectState } from '@/models/connect';
import { connect, useIntl } from 'umi';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import type { MenuList } from '@/utils/menu';
import { planToTree, treeToPlan } from '@/utils/menu';
import type { SysUserMenusModelState } from './model';
import styles from './style.less';

type IConnectState = ConnectState & {
    sysUserMenusModel: SysUserMenusModelState;
};

export type IToolbarProps = {
    sysUserMenusModel: SysUserMenusModelState;
    onSave: () => void;
} & ConnectProps;

const Toolbar: React.FC<IToolbarProps> = (props) => {
    const {
        sysUserMenusModel: { searchValue, menuChanged, menus },
        onSave,
    } = props;
    const fileSelectRef = useRef<any>();
    const { formatMessage } = useIntl();
    const search = (evt: any) => {
        props.dispatch({
            type: 'sysUserMenusModel/updateState',
            payload: {
                searchValue: evt.target.value,
            },
        });
    };
    const exportJSON = (evt: MouseEvent & { currentTarget: HTMLAnchorElement }) => {
        const fileName = `menus-${Date.now()}.json`;
        evt.currentTarget.download = fileName;
        const list = treeToPlan(menus);
        evt.currentTarget.href = `data:text/plain,${JSON.stringify(list)}`;
    };
    const handleFile = (evt: ChangeEvent & { currentTarget: HTMLInputElement }) => {
        const { files } = evt.currentTarget;
        if (!files || !files.length) return;
        const file = files[0];
        if (!/\.json$/.test(file.name)) {
            Modal.error({
                title: formatMessage({ id: 'page.system.user.menu.toolbar.import.fileType' }),
            });
            return;
        }
        if (window.FileReader) {
            const reader = new FileReader();
            reader.onload = () => {
                let json: MenuList | null = null;
                try {
                    json = JSON.parse(reader.result as string);
                } catch (e) {
                    Modal.error({
                        title: formatMessage({ id: 'page.system.user.menu.toolbar.import.fail' }),
                        content: e.message,
                    });
                }
                if (json) {
                    json.forEach((item) => {
                        // item.local_added = true;
                        // item.res_id = undefined;
                        item.updateTime = undefined;
                    });
                    props.dispatch({
                        type: 'sysUserMenusModel/selectMenu',
                        payload: null,
                    });
                    props.dispatch({
                        type: 'sysUserMenusModel/updateMenus',
                        payload: planToTree(menus),
                    });
                }
            };
            reader.readAsText(file);
        } else {
            Modal.error({
                content: formatMessage({ id: 'page.system.user.menu.toolbar.import.notSupport' }),
            });
        }
        fileSelectRef.current.value = null;
    };
    return (
        <div className={styles.toolbar}>
            <Row gutter={12}>
                <Col md={12} sm={24}>
                    <Input.Search
                        className={styles.search}
                        placeholder={formatMessage({
                            id: 'page.system.user.menu.toolbar.searchPlaceholder',
                        })}
                        onChange={search}
                        value={searchValue}
                        allowClear
                    />
                    <Button.Group className={styles.actions}>
                        <Button>
                            <a
                                onClick={exportJSON}
                                title={formatMessage({
                                    id: 'page.system.user.menu.toolbar.export',
                                })}
                            >
                                <DownloadOutlined />
                            </a>
                        </Button>
                        <Button
                            title={formatMessage({ id: 'page.system.user.menu.toolbar.import' })}
                            onClick={() => fileSelectRef.current.click()}
                        >
                            <UploadOutlined />
                            <input
                                type={'file'}
                                style={{ display: 'none' }}
                                id={'uploadel'}
                                ref={fileSelectRef}
                                onChange={handleFile}
                            />
                        </Button>
                    </Button.Group>
                </Col>
                <Col md={12} sm={24} className={'text-right'}>
                    <Button type={'primary'} onClick={onSave} disabled={!menuChanged}>
                        {formatMessage({ id: 'page.system.user.menu.toolbar.save' })}
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default connect(({ sysUserMenusModel }: IConnectState) => ({
    sysUserMenusModel,
}))(Toolbar);
