import React from 'react';
import { Layout, Typography } from 'antd';
import SchemaBuilder from './components/SchemaBuilder';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ backgroundColor: '#001529' }}>
        <Title style={{ color: 'white' }} level={3}>JSON Schema Builder</Title>
      </Header>
      <Content style={{ padding: '20px' }}>
        <SchemaBuilder />
      </Content>
    </Layout>
  );
}

export default App;
