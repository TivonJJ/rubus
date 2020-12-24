import Cookies from 'js-cookie';

/**
 * 利用cookie存储一个Key,对应到localStorage或sessionStorage中存储的数据
 * 实现跨窗口访问localStorage或sessionStorage的效果
 */
class CookieStore {
    storePrefix = '';

    userMarkPrefix = '@user_';

    Storage = localStorage;

    cookieKey = 'user-key';

    constructor(storePrefix: string) {
        this.storePrefix = storePrefix;
    }

    set(data: any) {
        this.clear();
        if (!data) return;
        const storeKey = this.getRealKey() + Date.now();
        this.Storage.setItem(storeKey, window.JSON.stringify(data));
        Cookies.set(this.cookieKey, storeKey, { path: '/' });
    }

    get(): any {
        const storeKey = Cookies.get(this.cookieKey);
        if (!storeKey) return null;
        const user = this.Storage.getItem(storeKey);
        if (!user) {
            Cookies.set(this.cookieKey, '');
            return null;
        }
        return window.JSON.parse(user);
    }

    getRealKey(): string {
        return this.storePrefix + this.userMarkPrefix;
    }

    clear() {
        const regx = new RegExp(`^(${this.getRealKey()})`);
        for (let i = 0; i < this.Storage.length; i++) {
            const key: string = this.Storage.key(i) || '';
            if (regx.test(key)) {
                this.Storage.removeItem(key);
            }
        }
        Cookies.set(this.cookieKey, '');
    }
}

export default CookieStore;
