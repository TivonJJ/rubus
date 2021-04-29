import { Request, Response } from 'express';

const Menus = require('./menu.json');
const fs = require('fs');

Menus.forEach((menu: any) => {
    if (typeof menu.res_name === 'object') {
        menu.res_name = JSON.stringify(menu.res_name);
    }
});

export const mockUser = {
    code: '0',
    data: [
        {
            password: 'A66ABB5684C45962D887564F08346E8D',
            is_deleted: 0,
            user_id: 8,
            role_id: null,
            user_res_list: Menus,
            real_name: 'admin',
            username: 'admin',
            status: 0,
        },
    ],
    msg: '成功',
    psn: '08221513038066496990',
    total: 1,
};
export const mockUserList = {
    code: '0',
    data: [
        {
            username: 'yecuihao@chinafintech.cn',
            role_id: 100019,
            status: 1,
            real_name: 'Cui Hao Ye',
            create_time: '2018-05-18 09:36:21',
            user_id: 100027,
            role_name: 'development',
            tel_phone: '15680461056',
        },
        {
            username: 'wentingting@chinafintech.cn',
            role_id: 100019,
            status: 1,
            real_name: 'Ting Ting',
            create_time: '2018-05-18 09:30:06',
            user_id: 100026,
            role_name: 'development',
            tel_phone: '13709022973',
        },
        {
            username: 'huke@chinafintech.cn',
            role_id: 100019,
            status: 2,
            real_name: 'huke',
            create_time: '2018-05-16 13:45:23',
            user_id: 100025,
            role_name: 'development',
            tel_phone: '18682752475',
        },
        {
            username: 'qinglin@chinafintech.cn',
            role_id: 100019,
            status: 1,
            real_name: '青林',
            create_time: '2018-05-16 13:00:39',
            user_id: 100024,
            role_name: 'development',
            tel_phone: '18380336772',
        },
        {
            username: 'luozhenyu@wangpos.com',
            role_id: 100019,
            status: 1,
            real_name: '罗振宇',
            create_time: '2018-04-26 20:16:25',
            user_id: 100023,
            role_name: 'development',
            tel_phone: '13980995624',
        },
        {
            username: 'yangjun@wangpos.com',
            role_id: 100019,
            status: 1,
            real_name: '杨俊',
            create_time: '2017-07-31 12:23:17',
            user_id: 100005,
            role_name: 'development',
            tel_phone: '13618008806',
        },
        {
            username: 'liqie@wangpos.com',
            role_id: 100019,
            status: 1,
            real_name: '李小红',
            create_time: '2018-04-25 15:49:46',
            user_id: 100022,
            role_name: 'development',
            tel_phone: '15002875942',
        },
        {
            username: 'sys@wangpos.com',
            role_id: '',
            status: 1,
            real_name: 'system',
            create_time: '2018-04-27 09:51:27',
            user_id: 2,
            role_name: '',
            tel_phone: '11111111111',
        },
    ],
    info: '操作成功。',
    msg: '操作成功。',
    psn: '05240938501762811600',
    status: 0,
    total: 8,
};
for (let i = 0; i < 100; i++) {
    mockUserList.data.push({
        username: '' + Math.random(),
        role_id: Math.random(),
        status: 1,
        real_name: '' + Math.random(),
        create_time: '2018-04-27 09:51:27',
        user_id: Math.random(),
        role_name: '',
        tel_phone: '' + Math.random(),
    });
}
export const mockRoleList = {
    code: '0',
    data: [
        {
            role_user_count: 7,
            role_id: 100019,
            status: 1,
            description: '调试用的',
            role_name: '开发调试',
        },
        {
            role_user_count: 0,
            role_id: 100016,
            status: 0,
            description: '商户角色',
            role_name: '商户',
        },
        {
            role_user_count: 0,
            role_id: 100015,
            status: 1,
            description: '门店员工',
            role_name: '门店员工',
        },
    ],
    info: '操作成功。',
    msg: '操作成功。',
    psn: '05240941564193180410',
    status: 0,
    total: 3,
};
export const mockResource = {
    code: '0',
    data: Menus,
    info: '操作成功。',
    msg: '操作成功。',
    psn: '05240956491217863944',
    status: 0,
    total: 35,
};
export const mockResByRole = {
    code: '0',
    data: Menus.filter((item: any) => ['操作日志', '权限资源管理'].indexOf(item.res_name) === -1),
    info: '操作成功。',
    msg: '操作成功。',
    psn: '05240958361147681540',
    status: 0,
    total: 29,
};

export default {
    'POST /api/basis/user/login': (req: Request, res: Response) => {
        const body = req.body;
        if (body.username === 'admin' && body.password === 'A66ABB5684C45962D887564F08346E8D') {
            setTimeout(() => {
                res.send(mockUser);
            }, 1000);
        } else {
            res.send({
                code: 'EB3019',
                data: [],
                info: '用户名或密码错误',
                msg: '用户名或密码错误',
                psn: '05181013091106903591',
                status: -99,
                total: 0,
            });
        }
    },
    'POST /api/basis/user/list': (req: Request, res: Response) => {
        let data = mockUserList.data;
        if ('status' in req.body) {
            data = data.filter((item) => item.status == req.body.status);
        }
        data = data.slice(
            ((req.body.page_index || 1) - 1) * req.body.page_size,
            req.body.page_size,
        );
        res.send({
            code: 0,
            total: data.length,
            data,
        });
    },
    'POST /api/basis/user/update': (req: Request, res: Response) => {
        const user = mockUserList.data.find((item) => item.user_id == req.body.user_id);
        if (user) Object.assign(user, req.body);
        res.send({
            code: 0,
            data: [],
        });
    },
    'POST /api/basis/user/create': (req: Request, res: Response) => {
        const user = { ...req.body, user_id: Date.now() };
        mockUserList.data.unshift(user);
        res.send({
            code: 0,
            data: [],
        });
    },
    'POST /api/role/list': (req: Request, res: Response) => {
        if (req.body.status) {
            const list = mockRoleList.data.filter((item) => item.status == req.body.status);
            res.send({
                ...mockRoleList,
                data: list,
            });
        } else {
            res.send(mockRoleList);
        }
    },
    'POST /api/basis/role/updateStatus': (req: Request, res: Response) => {
        const role = mockRoleList.data.find((item) => item.role_id == req.body.role_id);
        if (role) role.status = req.body.status;
        res.send({
            code: 0,
            data: [],
        });
    },
    'POST /api/basis/role/update': (req: Request, res: Response) => {
        const role = mockRoleList.data.find((item) => item.role_id == req.body.role_id);
        if (role) Object.assign(role, req.body);
        res.send({
            code: 0,
            data: [],
        });
    },
    'POST /api/basis/role/add': (req: Request, res: Response) => {
        const role = {
            status: 1,
            ...req.body,
            role_id: Date.now(),
        };
        mockRoleList.data.unshift(role);
        res.send({
            code: 0,
            data: [],
        });
    },
    'POST /api/basis/role/delete': (req: Request, res: Response) => {
        const index = mockRoleList.data.findIndex((item) => item.role_id == req.body.role_id);
        if (index !== -1) mockRoleList.data.splice(index, 1);
        res.send({
            code: 0,
            data: [],
        });
    },
    'POST /api/basis/role/detail': mockResByRole,
    'POST /api/basis/role/roleUserList': {
        code: '0',
        data: [
            {
                able_alloc_userlist: [
                    {
                        user_id: 168,
                        description: null,
                        real_name: '叶翠浩',
                        username: '15680461057',
                        status: 1,
                    },
                ],
                already_alloc_userlist: [
                    {
                        user_id: 136,
                        description: null,
                        real_name: '李切',
                        username: '15002875942',
                        status: 1,
                    },
                    {
                        user_id: 137,
                        description: null,
                        real_name: '杨俊',
                        username: '13618008806',
                        status: 1,
                    },
                    {
                        user_id: 140,
                        description: null,
                        real_name: '萨达',
                        username: 'baoxiaoja@qq.com',
                        status: 1,
                    },
                    {
                        user_id: 142,
                        description: null,
                        real_name: '灰灰',
                        username: '18180845520',
                        status: 1,
                    },
                    {
                        user_id: 145,
                        description: null,
                        real_name: '温婷婷',
                        username: '13709022973',
                        status: 1,
                    },
                    {
                        user_id: 146,
                        description: null,
                        real_name: '黎煜平',
                        username: '17308022624',
                        status: 1,
                    },
                    {
                        user_id: 153,
                        description: null,
                        real_name: '罗振宇',
                        username: '13980995624',
                        status: 1,
                    },
                    {
                        user_id: 161,
                        description: null,
                        real_name: '胡柯',
                        username: '18682752475',
                        status: 1,
                    },
                    {
                        user_id: 162,
                        description: null,
                        real_name: '魏东梅',
                        username: '18180736630',
                        status: 1,
                    },
                    {
                        user_id: 164,
                        description: null,
                        real_name: '李希西',
                        username: '18227983407',
                        status: 1,
                    },
                    {
                        user_id: 166,
                        description: null,
                        real_name: '王煜翔',
                        username: '18382988505',
                        status: 1,
                    },
                    {
                        user_id: 170,
                        description: null,
                        real_name: '唐闻',
                        username: '13072825383',
                        status: 1,
                    },
                    {
                        user_id: 172,
                        description: null,
                        real_name: '薛辉',
                        username: '15282376798',
                        status: 1,
                    },
                    {
                        user_id: 178,
                        description: null,
                        real_name: '陶凯',
                        username: '13730600285',
                        status: 1,
                    },
                    {
                        user_id: 180,
                        description: null,
                        real_name: '邬中萍',
                        username: '13678495612',
                        status: 1,
                    },
                    {
                        user_id: 181,
                        description: null,
                        real_name: '程仕磊',
                        username: '15378194572',
                        status: 1,
                    },
                    {
                        user_id: 184,
                        description: null,
                        real_name: '杨志钊',
                        username: '18482105374',
                        status: 1,
                    },
                    {
                        user_id: 187,
                        description: null,
                        real_name: 'yang',
                        username: '18482105377',
                        status: 1,
                    },
                    {
                        user_id: 188,
                        description: null,
                        real_name: '刘志刚',
                        username: '15801206388',
                        status: 1,
                    },
                    {
                        user_id: 189,
                        description: null,
                        real_name: 'huke812@163.com',
                        username: '15002876578',
                        status: 1,
                    },
                ],
            },
        ],
        msg: 'success',
        psn: '10281407009919090350',
        total: 1,
    },
    'POST /api/basis/role/allocRole': { code: 0, data: [] },
    'POST /api/resource/list': mockResource,
    'POST /api/basis/resource/list': mockResource,
    'POST /api/basis/resource/addOrUpdate': (req: Request, res: Response) => {
        const list = req.body.res_list;
        list.forEach((item: any) => {
            if (!item.res_id) {
                item.res_id = Math.random();
            }
        });
        fs.writeFile(
            require('path').join(__dirname, 'menu.json'),
            JSON.stringify(list),
            (err: any) => {
                if (err) {
                    res.send({
                        code: 'EB3119',
                        data: [],
                        info: '菜单写入失败',
                        msg: '菜单写入失败',
                        psn: '05181013091106902591',
                        status: -99,
                        total: 0,
                    });
                } else {
                    res.send({ code: 0, data: [], msg: '操作成功' });
                }
            },
        );
    },
    'POST /api/basis/user/custom': (req: Request, res: Response) => {
        setTimeout(() => {
            res.send({
                code: 0,
                data: {
                    theme: 'purple',
                },
                msg: '操作成功',
            });
        }, 1000);
    },
};
