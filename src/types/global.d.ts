import {DvaInstance} from "dva";
import {Store} from 'redux';

interface PrivateDvaInstance extends DvaInstance{
    _models: any[]
    _store: Store
    _plugin: any[]
}

declare global {
    interface Window {
        reloadAuthorized: () => void
        g_app: PrivateDvaInstance
    }
}
