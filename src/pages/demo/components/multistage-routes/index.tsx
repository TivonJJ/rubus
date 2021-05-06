import React, { useEffect } from 'react';
import { Link } from 'umi';
import { Card, Input } from 'antd';

const Index: React.FC = () => {
    const scrollArr = new Array(50).join('-').split('-');
    useEffect(() => {
        console.log('I am ready !!');
    }, []);
    return (
        <Card>
            <h1>Hay, I'm your father!</h1>
            <Input placeholder={'Please input any words you like'} />
            {/* <div style={{height:500,overflow: 'auto'}}>
                <h5>Scroll Page</h5>
                {scrollArr.map((item,index)=>(
                    <h3 key={index}>{index}</h3>
                ))}
            </div> */}
            <div>
                <h5>data</h5>
                {scrollArr.map((item, index) => (
                    <h3 key={index}>{index}</h3>
                ))}
            </div>
            <Link to={'./multistage-routes/second'}>Go to see my son</Link>
        </Card>
    );
};

export default Index;
