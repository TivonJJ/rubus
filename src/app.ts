/* eslint-disable no-underscore-dangle */

import { message } from 'antd';

export const dva = {
    config: {
        onError(err:any) {
            setTimeout(()=>{
                if(!err._dontReject){
                    message.error(err.message);
                }
            })
        },
    },
};
