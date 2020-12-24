declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';

declare const REACT_APP_ENV: 'dev' | 'test' | 'pre' | 'prod' | false;

declare const REACT_APP_TITLE: string;

declare const AppStartArgs: {
    basePath?: string,
    bv?: string|number,
    [key: string]: any
};

type AnyObject = Record<string, any>;

declare const EnvConfig: AnyObject;
