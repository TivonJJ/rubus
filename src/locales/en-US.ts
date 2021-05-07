import app from './en-US/app';
import common from './en-US/common';
import menu from './en-US/menu';
import pwa from './en-US/pwa';
import constantsAccount from './en-US/constants/account';
import constantsMenu from './en-US/constants/menu';
import componentsUploader from './en-US/components/uploader';
import componentsGlobalLangInput from './en-US/components/globalLangInput';

export default {
    ...app,
    ...common,
    ...menu,
    ...pwa,
    ...constantsAccount,
    ...constantsMenu,
    ...componentsUploader,
    ...componentsGlobalLangInput,
};
