import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const Page403 = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，您没有权限访问该页面"
      extra={[
        <Button key="back" type="primary" onClick={() => navigate('/')}>
          返回首页
        </Button>,
        <Button key="retry" onClick={() => window.location.reload()}>
          重试
        </Button>,
      ]}
    />
  );
};

export default Page403;
