import { Settings as ProSettings } from '@ant-design/pro-layout';
import Theme from './theme';

type DefaultSettings = ProSettings & {
    pwa: boolean;
    primaryColor?: string
};

const proSettings: DefaultSettings = {
    navTheme: 'light',
    // 拂晓蓝
    primaryColor: Theme.primaryColor,
    layout: 'side',
    contentWidth: 'Fluid',
    fixedHeader: false,
    fixSiderbar: true,
    colorWeak: false,
    menu: {
        locale: true,
    },
    title: 'Rubus Starter Kit',
    pwa: false,
    iconfontUrl: '',
};

export type { DefaultSettings };

export default proSettings;
