import app from './zh-CN/app';
import common from './zh-CN/common';
import menu from './zh-CN/menu';
import pwa from './zh-CN/pwa';
import constantsAccount from './zh-CN/constants/account';
import constantsMenu from './zh-CN/constants/menu';
import componentsUploader from './zh-CN/components/uploader';

export default {
    ...app,
    ...common,
    ...menu,
    ...pwa,
    ...constantsAccount,
    ...constantsMenu,
    ...componentsUploader,
};
