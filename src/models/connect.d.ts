import { MenuDataItem, Settings as ProSettings } from '@ant-design/pro-layout';
import { GlobalModelState } from './global';
import { UserModelState } from './user';

export { GlobalModelState, UserModelState };

export interface Loading {
    global: boolean;
    effects: { [key: string]: boolean | undefined };
    models: {
        global?: boolean;
        setting?: boolean;
        user?: boolean;
        [modelName:string]: boolean;
    };
}

export interface ConnectState {
    loading: Loading;
    global: GlobalModelState;
    settings: ProSettings;
    user: UserModelState;
}

export interface Route extends MenuDataItem {
    routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
    dispatch?: Dispatch<AnyAction>;
}
