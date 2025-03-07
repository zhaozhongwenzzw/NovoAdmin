import { Iconify } from "@/components/icon";
import { useSignIn } from "@/store/userStore";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import { useState } from "react";
import styled from "styled-components";

const LoginWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--colors-background-default);
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    width: 1000px;
    height: 1000px;
    border-radius: 50%;
    background: linear-gradient(
      45deg,
      var(--colors-palette-primary-light),
      var(--colors-palette-primary-default)
    );
    top: -50%;
    right: -20%;
    opacity: 0.1;
    animation: float 20s infinite linear;
  }

  &::after {
    content: "";
    position: absolute;
    width: 800px;
    height: 800px;
    border-radius: 50%;
    background: linear-gradient(
      45deg,
      var(--colors-palette-secondary-light),
      var(--colors-palette-secondary-default)
    );
    bottom: -40%;
    left: -10%;
    opacity: 0.1;
    animation: float 15s infinite linear reverse;
  }

  @keyframes float {
    from {
      transform: rotate(0deg) translate(50px) rotate(0deg);
    }
    to {
      transform: rotate(360deg) translate(50px) rotate(-360deg);
    }
  }
`;

const LoginContainer = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 40px;
  border-radius: 24px;
  background: rgba(var(--colors-background-paperChannel), 0.7);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .login-header {
    text-align: center;
    margin-bottom: 40px;

    .logo {
      margin-bottom: 16px;
      color: var(--colors-palette-primary-default);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;

      .icon {
        font-size: 32px;
      }

      .text {
        font-size: 28px;
        font-weight: 700;
        background: linear-gradient(
          45deg,
          var(--colors-palette-primary-default),
          var(--colors-palette-secondary-default)
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }

  .ant-input-affix-wrapper {
    padding: 12px;
    border-radius: 12px;
    border: 1px solid var(--colors-palette-gray-200);
    background-color: transparent;
    transition: all 0.3s ease;

    input {
      background-color: transparent !important;

      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0 30px var(--colors-background-paper) inset !important;
        -webkit-text-fill-color: var(--colors-text-primary) !important;
        transition: background-color 5000s ease-in-out 0s;
      }
    }

    &:hover,
    &:focus {
      border-color: var(--colors-palette-primary-default);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px
        rgba(var(--colors-palette-primary-defaultChannel), 0.1);
    }

    .anticon {
      color: var(--colors-text-secondary);
    }
  }

  .ant-btn {
    height: 48px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 16px;
    overflow: hidden;
    position: relative;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px
        rgba(var(--colors-palette-primary-defaultChannel), 0.2);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .remember-login {
    .ant-checkbox-wrapper {
      color: var(--colors-text-secondary);

      &:hover {
        color: var(--colors-palette-primary-default);
      }
    }
  }

  .ant-form-item-control-input {
    min-height: auto;
  }
`;

export default function Login() {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const signIn = useSignIn();

	const handleLogin = async () => {
		try {
			const values = await form.validateFields();
			setLoading(true);
			await signIn({ ...values, remember: values.remember ?? false });
			setLoading(false);
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	};

	return (
		<LoginWrapper>
			<LoginContainer>
				<div className="login-header">
					<div className="logo">
						<Iconify
							icon="mingcute:ai-fill"
							className="icon"
							style={{
								color: "var(--colors-palette-primary-default)",
								fontSize: "36px", // 稍微调大一点
							}}
						/>
						<span className="text">Novo Admin</span>
					</div>
				</div>
				<Form form={form} onFinish={handleLogin} size="large" autoComplete="off" initialValues={{ remember: false }}>
					<Form.Item name="account" rules={[{ required: true, message: "请输入用户名" }]}>
						<Input prefix={<UserOutlined />} placeholder="用户名" autoComplete="new-username" spellCheck={false} />
					</Form.Item>
					<Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
						<Input.Password prefix={<LockOutlined />} placeholder="密码" autoComplete="new-password" />
					</Form.Item>
					<Form.Item name="remember" valuePropName="checked" className="remember-login">
						<Checkbox>7天免登录</Checkbox>
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit" block loading={loading}>
							登录
						</Button>
					</Form.Item>
				</Form>
			</LoginContainer>
		</LoginWrapper>
	);
}
