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
                path:'/',
                component: '../layouts/BasicLayout',
                routes:[
                    {
                        path: 'wo/statistics',
                        component: './wo/statistics',
                    },
                    {
                        component: './404',
                    },
                ]
            },
        ],
    },
    {
        component: './404',
    },
]

export default routes;
