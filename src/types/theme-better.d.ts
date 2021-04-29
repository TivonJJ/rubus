import type { AppSettings } from '../../config/defaultSettings';

export type Theme = {
    key: string;
    fileName: string;
    modifyVars?: Record<string, string>;
    navTheme?: typeof AppSettings.navTheme;
    headerTheme?: typeof AppSettings.headerTheme;
};

declare global {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Window {
        umi_plugin_better_themeVar?: Theme[];
    }
}
