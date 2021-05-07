import {
    FolderOpenOutlined,
    LinkOutlined,
    PlayCircleOutlined,
    NotificationOutlined,
} from '@ant-design/icons';
import { getIntl } from 'umi';

const { formatMessage } = getIntl();

// 菜单类型
export const Types = {
    Folder: formatMessage({ id: 'constants.menu.types.folder' }),
    Menu: formatMessage({ id: 'constants.menu.types.menu' }),
    Action: formatMessage({ id: 'constants.menu.types.action' }),
    StatusBar: formatMessage({ id: 'constants.menu.types.statusbar' }),
};

// 菜单类型图标
export const TypeIconMap = {
    Folder: FolderOpenOutlined,
    Menu: LinkOutlined,
    Action: PlayCircleOutlined,
    StatusBar: NotificationOutlined,
};
