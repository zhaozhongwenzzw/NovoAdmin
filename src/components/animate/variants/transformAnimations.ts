import type { Variants } from "framer-motion";
import { AnimationType } from "../types";
import { defaultConfig } from "../config";

export const transformAnimations: Partial<Record<AnimationType, Variants>> = {
	[AnimationType.SCALE_IN]: {
		initial: {
			scale: 0.5,
			opacity: 0,
		},
		animate: {
			scale: 1,
			opacity: 1,
			transition: {
				duration: defaultConfig.duration * 0.9,
				ease: [0.16, 1, 0.3, 1],
				opacity: { duration: defaultConfig.duration * 0.7 },
			},
		},
	},
	[AnimationType.SCALE_OUT]: {
		initial: {
			scale: 1,
			opacity: 1,
		},
		animate: {
			scale: 0,
			transition: {
				duration: defaultConfig.duration * 0.8, // 0.24秒
				ease: [0.32, 0, 0.67, 0],
			},
		},
		exit: {
			scale: 0.6,
			opacity: 0,
			transition: {
				duration: defaultConfig.duration * 0.8,
				ease: [0.32, 0, 0.67, 0],
				opacity: { duration: defaultConfig.duration * 0.6 },
			},
		},
	},
	[AnimationType.ROTATE_CW]: {
		initial: {
			rotate: 0,
			opacity: 0,
			transformOrigin: "center",
		},
		animate: {
			rotate: 180,
			opacity: 1,
			transition: {
				duration: defaultConfig.duration * 1.1,
				ease: [0.34, 1.3, 0.64, 1],
				opacity: {
					duration: defaultConfig.duration * 0.6,
					ease: "easeOut",
				},
			},
		},
	},
	[AnimationType.ROTATE_CCW]: {
		initial: {
			rotate: 0,
			opacity: 0,
			transformOrigin: "center",
		},
		animate: {
			rotate: -180,
			opacity: 1,
			transition: {
				duration: defaultConfig.duration * 1.1,
				ease: [0.34, 1.3, 0.64, 1],
				opacity: {
					duration: defaultConfig.duration * 0.6,
					ease: "easeOut",
				},
			},
		},
	},
	[AnimationType.FLIP_X]: {
		initial: {
			rotateY: 90,
			opacity: 0,
			transformPerspective: 1000,
			transformOrigin: "center",
		},
		animate: {
			rotateY: 0,
			opacity: 1,
			transition: {
				duration: defaultConfig.duration * 0.9,
				ease: [0.25, 0.1, 0.25, 1],
				opacity: {
					duration: defaultConfig.duration * 0.5,
					delay: defaultConfig.duration * 0.1,
				},
			},
		},
	},
	[AnimationType.FLIP_Y]: {
		initial: {
			rotateX: 90,
			opacity: 0,
			transformPerspective: 1000,
			transformOrigin: "center",
		},
		animate: {
			rotateX: 0,
			opacity: 1,
			transition: {
				duration: defaultConfig.duration * 0.9,
				ease: [0.25, 0.1, 0.25, 1],
				opacity: {
					duration: defaultConfig.duration * 0.5,
					delay: defaultConfig.duration * 0.1,
				},
			},
		},
	},
};
