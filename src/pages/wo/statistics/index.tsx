import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card } from 'antd';

const Home:React.FC<{}>=()=>{
    return (
        <PageContainer title="总览" content="hhh">
            <Card>
                WO Statistics Page
            </Card>
        </PageContainer>
    )
}

export default Home;
