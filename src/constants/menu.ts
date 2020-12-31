import {
    FolderOpenOutlined,
    LinkOutlined,
    PlayCircleOutlined,
    NotificationOutlined,
} from '@ant-design/icons';
import { getIntl } from 'umi';

const { formatMessage } = getIntl();

export const Types = {
    Folder: formatMessage({ id: 'constants.menu.types.folder' }),
    Menu: formatMessage({ id: 'constants.menu.types.menu' }),
    Action: formatMessage({ id: 'constants.menu.types.action' }),
    StatusBar: formatMessage({ id: 'constants.menu.types.statusbar' }),
};

export const TypeIconMap = {
    Folder: FolderOpenOutlined,
    Menu: LinkOutlined,
    Action: PlayCircleOutlined,
    StatusBar: NotificationOutlined,
};
