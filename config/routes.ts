const routes = [
    {
        path: '/user',
        component: '../layouts/AccountLayout',
        routes: [
            {
                name: 'login',
                path: '/user/login',
                component: './user/login',
            },
        ],
    },
    {
        component: '../layouts/SecurityLayout',
        routes: [
            {
                path: '/',
                component: '../layouts/BasicLayout',
                routes: [
                    {
                        path: 'sys',
                        routes: [
                            {
                                path: 'user/accounts',
                                component: './system/user/accounts',
                            },
                            {
                                path: 'user/menus',
                                component: './system/user/menus',
                            },
                            {
                                path: 'user/roles',
                                component: './system/user/roles',
                            },
                        ],
                    },
                    {
                        path: 'demo/components',
                        component: './demo/Components',
                    },
                    {
                        component: './404',
                    },
                ],
            },
        ],
    },
    {
        component: './404',
    },
];

export default routes;
