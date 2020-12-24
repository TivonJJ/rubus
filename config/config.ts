// https://umijs.org/config/
import { defineConfig } from 'umi';
import Theme from './theme';
import _ from 'lodash';
import proxy from './proxy';
import routes from './routes';
import defaultSettings from './defaultSettings';
import minimist from 'minimist';
import {defaults} from 'lodash';

const startArgs = defaults(minimist(process.argv.slice(2)),{basePath:'/'});

const customTheme = {...Theme};
Object.keys(customTheme).forEach(key=>{
    customTheme[_.kebabCase(key)] = customTheme[key];
    delete customTheme[key];
})

export default defineConfig({
    hash: true,
    antd: {},
    dva: {
        hmr: true,
    },
    locale: {
        // default zh-CN
        default: 'zh-CN',
        antd: true,
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
    },
    dynamicImport: {
        loading: '@/components/PageLoading/index',
    },
    targets: {
        ie: 11,
    },
    // umi routes: https://umijs.org/docs/routing
    routes: [
        ...routes,
    ],
    base: startArgs.basePath,
    // Theme for antd: https://ant.design/docs/react/customize-theme-cn
    theme: {
        ...customTheme,
    },
    title: defaultSettings.title,
    ignoreMomentLocale: true,
    proxy: proxy,
    define:{
        REACT_APP_TITLE: defaultSettings.title,
        AppStartArgs: startArgs
    },
    manifest: {
        basePath: startArgs.basePath,
    },
});
