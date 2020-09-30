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
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
            {
                path: '/',
                component: '../layouts/BasicLayout',
                authority: ['admin', 'user'],
            },
            {
                component: './404',
            },
        ],
    },
    {
        component: './404',
    },
]

export default routes;
