import { Settings as ProSettings } from '@ant-design/pro-layout';
import Theme from './theme.default';

type AppSettings = ProSettings & {
    /**
     * 是否开启PWA功能
     */
    pwa: boolean;
    /**
     * 主题主色
     */
    primaryColor?: string;
    /**
     * 左侧菜单栏宽度
     */
    siderWidth?: number;
    /**
     * 当前主题配置
     */
    theme?: string;
    /**
     * 系统Logo
     */
    logo?: string;
};

const proSettings: AppSettings = {
    title: 'app.title',
    primaryColor: Theme.primaryColor,
    navTheme: 'light',
    headerTheme: 'dark',
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
    pwa: false,
    iconfontUrl: '',
};

export type { AppSettings };

export default proSettings;
