import type { Theme } from '@/types/theme-better';
import { getResourcePath } from '@/utils/utils';

type ThemeType = Theme | string | null | false;

class ThemeUtil {
    public ThemeStyleLink: HTMLLinkElement | undefined;
    private StorageKey = 'theme';

    get Themes() {
        return window.umi_plugin_better_themeVar;
    }

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

    getCacheTheme(): Theme | null | undefined {
        const cacheThemeKey = localStorage.getItem(this.StorageKey);
        if (cacheThemeKey) {
            return this.getTheme(cacheThemeKey);
        }
        return null;
    }

    getTheme(key: string): Theme | undefined {
        return this.Themes?.find((item) => item.key === key);
    }

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
                ThemeStyleLink.href = getResourcePath('theme', targetTheme.fileName);
            } else {
                reject(new Error(`The theme "${theme}" doesn't exist`));
            }
        });
    }
}

export default new ThemeUtil();
