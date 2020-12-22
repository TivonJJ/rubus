import { Request, Response } from 'express';
const fs = require('fs');

export default {
    'POST /api/basis/file/upload':(req:Request,res:Response)=>{
        setTimeout(()=>{
            res.send({
                data:[
                    {file_key:'u_'+Date.now()}
                ]
            })
        },2000)
    },
    'GET /api/basis/file/download/:key':(req:Request,res:Response)=>{
        res.writeHead(200, {'Content-Type': 'image/png'});
        const stream = fs.createReadStream( './mock/upload.jpg' );
        const responseData:Buffer[] = [];//存储文件流
        if (stream) {//判断状态
            stream.on( 'data', ( chunk:Buffer )=> {
                responseData.push( chunk );
            });
            stream.on( 'end', function() {
                const finalData = Buffer.concat( responseData );
                res.write( finalData );
                res.end();
            });
        }
    }
}
