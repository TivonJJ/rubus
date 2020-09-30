declare module "js-cookie" {
    export function get(key: string): string;
    export function set(key: string,value:string,option?:any): string;
}
