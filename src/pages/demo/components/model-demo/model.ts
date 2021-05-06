export type DemoModelState = {
    name?: string;
    desc?: string;
};

export type DemoModelType = {
    namespace: 'demoModel';
    state: DemoModelState;
};

export default {
    namespace: 'demoModel',
    state: {
        name: '哈哈',
        desc: '呵呵',
    },
} as DemoModelType;
