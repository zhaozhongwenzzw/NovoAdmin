import { useUserToken } from '@/store/userStore';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const Page404 = () => {
  const navigate = useNavigate();
  //为什么要判断token，因为在没有获取用户权限时，是没有渲染路由的，所以跳转私有地址就会跳转404页面,所以没有token就不渲染内容，解决没有登陆会闪404页面内容的问题
  const token = useUserToken();
  return !token ? null : (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，您访问的页面不存在"
      extra={[
        <Button key="back" type="primary" onClick={() => navigate('/')}>
          返回首页
        </Button>,
        <Button key="goBack" onClick={() => navigate(-1)}>
          返回上一页
        </Button>,
      ]}
    />
  );
};

export default Page404;
