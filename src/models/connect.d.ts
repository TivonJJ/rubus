import type { MenuDataItem, Settings as ProSettings } from '@ant-design/pro-layout';
import { GlobalModelState } from './global';
import { UserModelState } from './user';

export { GlobalModelState, UserModelState };

export type Loading = {
    global: boolean;
    effects: Record<string, boolean | undefined>;
    models: {
        global?: boolean;
        setting?: boolean;
        user?: boolean;
        [modelName: string]: boolean;
    };
};

export type ConnectState = {
    loading: Loading;
    global: GlobalModelState;
    settings: ProSettings;
    user: UserModelState;
};

export type Route = {
    routes?: Route[];
} & MenuDataItem;

/**
 * @type T: Params matched in dynamic routing
 */
export type ConnectProps<T = {}> = {
    dispatch?: Dispatch<AnyAction>;
} & Partial<RouterTypes<Route, T>>;
