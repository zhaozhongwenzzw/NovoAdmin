import type { Variants } from "framer-motion";
import { AnimationType } from "../types";
import { defaultConfig } from "../config";

export const basicAnimations: Partial<Record<AnimationType, Variants>> = {
	[AnimationType.DEFAULT]: {
		initial: { opacity: 1 },
		animate: {},
		exit: {},
	},
	[AnimationType.FADE_IN]: {
		initial: { opacity: 0 },
		animate: {
			opacity: 1,
			transition: {
				duration: defaultConfig.duration * 0.7,
				ease: [0.4, 0, 0.2, 1],
			},
		},
	},
	[AnimationType.FADE_OUT]: {
		initial: { opacity: 1 },
		animate: {
			opacity: 0,
			transition: {
				duration: defaultConfig.duration * 0.7,
				ease: [0.4, 0, 0.2, 1],
			},
		},
		exit: {
			opacity: 0,
			transition: {
				duration: defaultConfig.duration * 0.6,
				ease: [0.4, 0, 1, 1],
			},
		},
	},
	[AnimationType.SLIDE_IN_LEFT]: {
		initial: {
			opacity: 0,
			x: -30,
		},
		animate: {
			opacity: 1,
			x: 0,
			transition: {
				duration: defaultConfig.duration * 0.8,
				ease: [0.25, 0.1, 0.25, 1],
				opacity: { duration: defaultConfig.duration * 0.6 },
			},
		},
	},
	[AnimationType.SLIDE_OUT_LEFT]: {
		initial: {
			opacity: 1,
			x: 0,
		},
		animate: {
			opacity: 1,
			x: -30,
			transition: {
				duration: defaultConfig.duration * 0.7,
				ease: [0.4, 0, 0.2, 1],
				opacity: { duration: defaultConfig.duration * 0.5 },
			},
		},
		exit: {
			opacity: 0,
			x: -30,
			transition: {
				duration: defaultConfig.duration * 0.7,
				ease: [0.4, 0, 0.2, 1],
				opacity: { duration: defaultConfig.duration * 0.5 },
			},
		},
	},
	[AnimationType.SLIDE_IN_RIGHT]: {
		initial: {
			opacity: 0,
			x: 30,
		},
		animate: {
			opacity: 1,
			x: 0,
			transition: {
				duration: defaultConfig.duration * 0.8,
				ease: [0.25, 0.1, 0.25, 1],
				opacity: { duration: defaultConfig.duration * 0.6 },
			},
		},
	},
	[AnimationType.SLIDE_OUT_RIGHT]: {
		initial: {
			opacity: 1,
			x: 0,
		},
		animate: {
			opacity: 1,
			x: 30,
			transition: {
				duration: defaultConfig.duration * 0.7,
				ease: [0.4, 0, 0.2, 1],
				opacity: { duration: defaultConfig.duration * 0.5 },
			},
		},
		exit: {
			opacity: 0,
			x: 30,
			transition: {
				duration: defaultConfig.duration * 0.7,
				ease: [0.4, 0, 0.2, 1],
				opacity: { duration: defaultConfig.duration * 0.5 },
			},
		},
	},
	[AnimationType.SLIDE_IN_TOP]: {
		initial: {
			opacity: 0,
			y: -30,
		},
		animate: {
			opacity: 1,
			y: 0,
			transition: {
				duration: defaultConfig.duration * 0.8,
				ease: [0.25, 0.1, 0.25, 1],
				opacity: { duration: defaultConfig.duration * 0.6 },
			},
		},
	},
	[AnimationType.SLIDE_OUT_TOP]: {
		initial: {
			opacity: 1,
			y: 0,
		},
		animate: {
			opacity: 1,
			y: -30,
			transition: {
				duration: defaultConfig.duration * 0.3,
				ease: [0.4, 0, 0.2, 1],
			},
		},
		exit: {
			opacity: 0,
			y: -30,
			transition: {
				duration: defaultConfig.duration * 0.7,
				ease: [0.4, 0, 0.2, 1],
				opacity: { duration: defaultConfig.duration * 0.5 },
			},
		},
	},
	[AnimationType.SLIDE_IN_BOTTOM]: {
		initial: {
			opacity: 0,
			y: 30,
		},
		animate: {
			opacity: 1,
			y: 0,
			transition: {
				duration: defaultConfig.duration * 0.8,
				ease: [0.33, 1, 0.68, 1],
				opacity: { duration: defaultConfig.duration * 0.6 },
			},
		},
	},
	[AnimationType.SLIDE_OUT_BOTTOM]: {
		initial: {
			opacity: 1,
			y: 0,
		},
		animate: {
			opacity: 1,
			y: 30,
			transition: {
				duration: defaultConfig.duration * 0.7,
				ease: "easeInOut",
				opacity: { duration: defaultConfig.duration * 0.5 },
			},
		},
		exit: {
			opacity: 0,
			y: 30,
			transition: {
				duration: defaultConfig.duration * 0.7,
				ease: "easeInOut",
				opacity: { duration: defaultConfig.duration * 0.5 },
			},
		},
	},
};
