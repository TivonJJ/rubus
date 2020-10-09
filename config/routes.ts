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
                        path: 'home',
                        component: './home',
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
