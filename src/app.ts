import { message } from 'antd';

export const dva = {
    config: {
        onError(err:any) {
            setTimeout(()=>{
                /* eslint-disable no-underscore-dangle */
                if(!err._dontReject){
                    message.error(err.message);
                }
            })
        },
    },
};
