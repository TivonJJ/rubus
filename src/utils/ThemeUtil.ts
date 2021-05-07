import type { Theme } from '@/types/theme-better';
import { getPublicPath } from '@/utils/utils';

type ThemeType = Theme | string | null | false;

/**
 * 主题工具，用于多主题配置切换
 */
class ThemeUtil {
    public ThemeStyleLink: HTMLLinkElement | undefined;
    private StorageKey = 'theme';

    /**
     * 获取umi_plugin_better_theme下配置的所有主题数组
     * @constructor
     */
    get Themes() {
        return window.umi_plugin_better_themeVar;
    }

    /**
     * 创建CSS引入的Link标签
     * @private
     */
    private createStyleLink() {
        const linkId = 'better-theme-link';
        const exist = document.getElementById(linkId);
        if (exist) {
            document.body.removeChild(exist);
        }
        const ThemeStyleLink = document.createElement('link');
        ThemeStyleLink.id = linkId;
        ThemeStyleLink.rel = 'stylesheet';
        ThemeStyleLink.type = 'text/css';
        document.body.appendChild(ThemeStyleLink);
        this.ThemeStyleLink = ThemeStyleLink;
        return ThemeStyleLink;
    }

    /**
     * 从localStorage中获取当前配置的主题
     */
    getCacheTheme(): Theme | null | undefined {
        const cacheThemeKey = localStorage.getItem(this.StorageKey);
        if (cacheThemeKey) {
            return this.getTheme(cacheThemeKey);
        }
        return null;
    }

    /**
     * 根据key获取主题配置
     * @param key 主题key
     * @return Theme|undefined
     */
    getTheme(key: string): Theme | undefined {
        return this.Themes?.find((item) => item.key === key);
    }

    /**
     * 设置更新当前主题
     * @param theme 设置的主题
     * @return Promise<ThemeType>
     */
    setTheme(theme: ThemeType): Promise<ThemeType> {
        return new Promise((resolve, reject) => {
            const ThemeStyleLink = this.createStyleLink();
            if (!theme) {
                ThemeStyleLink.href = '';
                localStorage.removeItem(this.StorageKey);
                resolve(theme);
                return;
            }
            const targetTheme =
                typeof theme === 'string' ? this.Themes?.find((item) => item.key === theme) : theme;
            if (targetTheme) {
                ThemeStyleLink.onload = () => {
                    localStorage.setItem(this.StorageKey, targetTheme.key);
                    resolve(theme);
                };
                ThemeStyleLink.href = getPublicPath('theme', targetTheme.fileName);
            } else {
                reject(new Error(`The theme "${theme}" doesn't exist`));
            }
        });
    }
}

export default new ThemeUtil();
