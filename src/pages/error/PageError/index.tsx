import { FallbackProps } from 'react-error-boundary';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const PageError: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/home', { replace: true }); // 先导航
    resetErrorBoundary(); // 然后重置错误状态
  };

  return (
    <Result
      status="error"
      title="页面加载失败"
      subTitle={`错误信息: ${error.message}`}
      extra={[
        <Button key="retry" onClick={resetErrorBoundary}>
          重试
        </Button>,
        <Button key="home" type="primary" onClick={handleNavigate}>
          返回首页
        </Button>,
      ]}
    />
  );
};

export default PageError;
