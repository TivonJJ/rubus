import { Settings as ProSettings } from '@ant-design/pro-layout';
import Theme from './theme';

type DefaultSettings = ProSettings & {
    pwa: boolean;
    primaryColor?: string;
    siderWidth?: number;
};

const proSettings: DefaultSettings = {
    primaryColor: Theme.primaryColor,
    navTheme: 'light',
    // headerTheme: 'light',
    layout: 'mix',
    splitMenus: true,
    contentWidth: 'Fluid',
    siderWidth: 260,
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
