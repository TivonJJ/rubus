import React, { useEffect } from 'react';
import { Card, Spin } from 'antd';

const Index: React.FC = () => {
    const [scrollArr, setScrollArr] = React.useState<string[]>([]);
    useEffect(() => {
        setTimeout(() => {
            setScrollArr(new Array(50).join('-').split('-'));
        }, 1000);
    }, []);
    return (
        <Card>
            <h1>Hay, You are my son!</h1>
            <Spin spinning={!scrollArr.length}>
                <h5>data</h5>
                {scrollArr.map((item, index) => (
                    <h3 key={index}>{index}</h3>
                ))}
            </Spin>
        </Card>
    );
};

export default Index;
