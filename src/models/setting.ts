import type { Theme } from '@/types/theme-better';
import ThemeUtil from '@/utils/ThemeUtil';
import type { Reducer, Subscription } from 'umi';
import type { AppSettings } from '../../config/defaultSettings';
import defaultSettings from '../../config/defaultSettings';
import type { Effect } from '@@/plugin-dva/connect';
import { getCustomSettings } from '@/services/user';

export type ModelSettingState = {
    themes?: Theme[];
} & AppSettings;

export type SettingModelType = {
    namespace: 'settings';
    state: ModelSettingState;
    effects: {
        fetchCustomSetting: Effect;
    };
    reducers: {
        changeSetting: Reducer<ModelSettingState>;
    };
    subscriptions: Record<string, Subscription>;
};

const updateColorWeak: (colorWeak: boolean) => void = (colorWeak) => {
    const root = document.getElementById('root');
    if (root) {
        root.className = colorWeak ? 'colorWeak' : '';
    }
};

const updateTheme = (key: string): Theme | null => {
    const theme = ThemeUtil.getTheme(key);
    if (theme) {
        ThemeUtil.setTheme(theme).catch((e) => {
            console.error('Theme load error', e);
        });
        return theme;
    }
    return null;
};

const SettingModel: SettingModelType = {
    namespace: 'settings',
    state: defaultSettings,
    effects: {
        *fetchCustomSetting(_, { call, put }) {
            const settings = yield call(getCustomSettings);
            yield put({
                type: 'changeSetting',
                payload: {
                    theme: settings.theme,
                },
            });
        },
    },
    reducers: {
        changeSetting(state = defaultSettings, { payload }) {
            if (
                'contentWidth' in payload &&
                state.contentWidth !== payload.contentWidth &&
                window.dispatchEvent
            ) {
                window.dispatchEvent(new Event('resize'));
            }
            if ('colorWeak' in payload) {
                updateColorWeak(payload.colorWeak);
            }
            const themeConfig: Partial<AppSettings> = {};
            if ('theme' in payload) {
                const theme = updateTheme(payload.theme);
                if (theme) {
                    themeConfig.theme = theme.key;
                    themeConfig.navTheme = theme.navTheme;
                    themeConfig.headerTheme = theme.headerTheme;
                    themeConfig.primaryColor = theme.modifyVars?.['@primary-color'];
                } else {
                    themeConfig.theme = defaultSettings.theme;
                    themeConfig.navTheme = defaultSettings.navTheme;
                    themeConfig.headerTheme = defaultSettings.headerTheme;
                    themeConfig.primaryColor = defaultSettings.primaryColor;
                }
            }
            return {
                ...state,
                ...payload,
                ...themeConfig,
            };
        },
    },
    subscriptions: {
        setup({ dispatch }) {
            const cacheTheme = ThemeUtil.getCacheTheme();
            if (cacheTheme) {
                dispatch({
                    type: 'changeSetting',
                    payload: {
                        theme: cacheTheme.key,
                    },
                });
            }
            // TODO 增加时序控制
            dispatch({
                type: 'fetchCustomSetting',
            });
        },
    },
};
export default SettingModel;
