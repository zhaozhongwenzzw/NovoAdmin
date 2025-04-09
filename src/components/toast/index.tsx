import { useSettings } from "@/store/settingStore";
import { themeVars } from "@/configs/theme/hooks/theme.css";
import { rgbAlpha } from "@/utils/theme";
import { Toaster } from "sonner";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Iconify } from "../icon";

/**
 * https://sonner.emilkowal.ski/getting-started
 */
export default function Toast() {
	const { themeMode } = useSettings();

	return (
		<ToasterStyleWrapper>
			<Toaster
				position="top-center"
				theme={themeMode}
				toastOptions={{
					duration: 3000,
					style: {
						backgroundColor: themeVars.colors.background.paper,
					},
					classNames: {
						toast: "rounded-lg border-0",
						description: "text-xs text-current/45",
						content: "flex-1",
						icon: "flex items-center justify-center px-4 rounded-lg",
						success: "bg-success/10",
						error: "bg-error/10",
						warning: "bg-warning/10",
						info: "bg-info/10",
					},
				}}
				icons={{
					success: <SuccessIcon />,
					error: <ErrorIcon />,
					warning: (
						<div className="p-2 bg-warning/10 rounded-lg">
							<Iconify icon="carbon:warning-alt-filled" size={24} color={themeVars.colors.palette.warning.default} />
						</div>
					),
					info: (
						<div className="p-2 bg-info/10 rounded-lg">
							<Iconify icon="carbon:information-filled" size={24} color={themeVars.colors.palette.info.default} />
						</div>
					),
					loading: (
						<div className="p-2 bg-gray-400/10 rounded-lg text-primary">
							<Iconify icon="svg-spinners:3-dots-fade" size={24} className="text-primary animate-pulse" />
						</div>
					),
				}}
			/>
		</ToasterStyleWrapper>
	);
}

const ToasterStyleWrapper = styled.div`
  [data-sonner-toast] {
    font-weight: 600;
    font-size: 14px;

    [data-cancel] {
      color: ${themeVars.colors.text.primary};
      background-color: transparent;
      &:hover {
        background-color: ${rgbAlpha(themeVars.colors.text.primaryChannel, 0.08)};
      }
    }

    /* Default */
    [data-action] {
      color: ${themeVars.colors.palette.primary.default};
      background-color: transparent;
      &:hover {
        background-color: ${rgbAlpha(themeVars.colors.palette.primary.defaultChannel, 0.08)};
      }
    }

    /* Info */
    &[data-type='info'] [data-action] {
      color: ${themeVars.colors.palette.info.default};
      background-color: transparent;
      &:hover {
        background-color: ${`rgba(${themeVars.colors.palette.info.defaultChannel}, 0.08)`};
      }
    }

    /* Error */
    &[data-type='error'] [data-action] {
      color: ${themeVars.colors.palette.error.default};
      background-color: transparent;
      &:hover {
        background-color: ${`rgba(${themeVars.colors.palette.error.defaultChannel}, 0.08)`};
      }
    }

    /* Success */
    &[data-type='success'] [data-action] {
      color: ${themeVars.colors.palette.success.default};
      background-color: transparent;
      &:hover {
        background-color: ${`rgba(${themeVars.colors.palette.success.defaultChannel}, 0.08)`};
      }
    }

    /* Warning */
    &[data-type='warning'] [data-action] {
      color: ${themeVars.colors.palette.warning.default};
      background-color: transparent;
      &:hover {
        background-color: ${`rgba(${themeVars.colors.palette.warning.defaultChannel}, 0.08)`};
      }
    }

    /* Close Button */
    [data-close-button] {
      top: 0;
      right: 0;
      left: auto;
      border-width: 1px;
      border-style: dashed;
      background-color: ${themeVars.colors.background.paper};
      border-color: ${themeVars.colors.common.border};
    }
  }
`;

// 成功图标动画 - 更简洁干净版本
const SuccessIcon = () => {
	const checkmarkVariants = {
		hidden: { pathLength: 0, opacity: 0 },
		visible: {
			pathLength: 1,
			opacity: 1,
			transition: {
				pathLength: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] },
				opacity: { duration: 0.6 },
			},
		},
	};

	const circleVariants = {
		hidden: { scale: 1.5, opacity: 0 },
		visible: {
			scale: 1,
			opacity: 1,
			transition: {
				duration: 0.6,
				ease: [0.34, 1.56, 0.64, 1], // 弹性效果
			},
		},
	};

	return (
		<div className="p-2">
			<motion.svg width="24" height="24" viewBox="0 0 24 24" fill="none" initial="hidden" animate="visible">
				<title>成功提示图标</title>
				{/* 主圆圈 */}
				<motion.circle
					cx="12"
					cy="12"
					r="10"
					stroke={themeVars.colors.palette.success.default}
					strokeWidth="2"
					fill="none"
					variants={circleVariants}
					initial={{ rotate: -90, pathLength: 0 }}
					animate={{ rotate: 0, pathLength: 1 }}
					transition={{ duration: 0.8, delay: 0.1, ease: "easeInOut" }}
				/>

				{/* 勾号 */}
				<motion.path
					d="M8 12L11 15L16 9"
					stroke={themeVars.colors.palette.success.default}
					strokeWidth="3"
					strokeLinecap="round"
					strokeLinejoin="round"
					fill="none"
					variants={checkmarkVariants}
				/>
			</motion.svg>
		</div>
	);
};

// 错误图标动画 - 更简洁干净版本
const ErrorIcon = () => {
	const circleVariants = {
		hidden: { scale: 0.8, opacity: 0, borderRadius: 50 },
		visible: {
			scale: 1,
			opacity: 1,
			transition: {
				duration: 0.4,
				ease: "easeOut",
			},
		},
		pulse: {
			scale: [1, 1.05, 1],
			transition: {
				duration: 0.4,
				repeat: 1,
				repeatType: "reverse" as const,
			},
		},
	};

	const crossVariants = {
		hidden: { pathLength: 0, opacity: 0 },
		visible: (i: number) => ({
			pathLength: 1,
			opacity: 1,
			transition: {
				pathLength: { duration: 0.4, ease: [0.65, 0, 0.35, 1] },
				opacity: { duration: 0.3 },
				delay: i * 0.15,
			},
		}),
	};

	const shakeVariants = {
		hidden: { x: 0 },
		visible: {
			x: [0, -2, 3, -3, 2, 0],
			transition: {
				duration: 0.5,
				delay: 0.6,
				ease: "easeInOut",
			},
		},
	};

	return (
		<div className="p-2">
			<motion.svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				initial="hidden"
				animate={["visible", "pulse"]}
				variants={shakeVariants}
			>
				<title>错误提示图标</title>
				<motion.circle
					cx="12"
					cy="12"
					r="11"
					stroke={`rgba(${themeVars.colors.palette.error.defaultChannel}, 0.3)`}
					strokeWidth="1"
					fill="none"
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0, 0.5, 0],
					}}
					transition={{
						duration: 1.2,
						delay: 0.6,
						repeat: 1,
						repeatType: "reverse" as const,
					}}
				/>

				{/* 主圆圈 */}
				<motion.circle
					cx="12"
					cy="12"
					r="10"
					stroke={themeVars.colors.palette.error.default}
					strokeWidth="2"
					fill="none"
					variants={circleVariants}
				/>

				{/* 交叉线 */}
				<motion.path
					d="M8 8L16 16"
					stroke={themeVars.colors.palette.error.default}
					strokeWidth="2.5"
					strokeLinecap="round"
					custom={0}
					variants={crossVariants}
				/>
				<motion.path
					d="M16 8L8 16"
					stroke={themeVars.colors.palette.error.default}
					strokeWidth="2.5"
					strokeLinecap="round"
					custom={1}
					variants={crossVariants}
				/>
			</motion.svg>
		</div>
	);
};
