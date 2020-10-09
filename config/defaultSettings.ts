import { Settings as ProSettings } from '@ant-design/pro-layout';
import Theme from './theme';

type DefaultSettings = ProSettings & {
    pwa: boolean;
    primaryColor?: string;
    siderWidth?: number;
};

const proSettings: DefaultSettings = {
    navTheme: 'dark',
    // 拂晓蓝
    primaryColor: Theme.primaryColor,
    layout: 'mix',
    contentWidth: 'Fluid',
    // siderWidth: 280,
    splitMenus: true,
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
