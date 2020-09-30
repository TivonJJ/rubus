import * as React from 'react';

export interface Slide2VerifyProps{
    prefetch?: boolean
    onFetch?:(data?:any)=>Promise<any>
    onSuccess?:(data:any)=>void
    onCheck?:(data:any)=>Promise<any>
}

export class Slide2VerifyInterface extends React.Component<Slide2VerifyProps,any> {
    new (props: Slide2VerifyProps, context?: any)
    reset():void
}

export default Slide2VerifyInterface
