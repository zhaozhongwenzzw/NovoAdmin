import type { Variants } from "framer-motion";
import { AnimationType } from "../types";

export const combinedAnimations: Partial<Record<AnimationType, Variants>> = {
	[AnimationType.ZOOM_SLIDE]: {
		initial: {
			scale: 0.5,
			x: -60,
			opacity: 0,
		},
		animate: {
			scale: 1,
			x: 0,
			opacity: 1,
			transition: {
				duration: 0.5,
				ease: [0.25, 0.1, 0.25, 1],
				scale: {
					duration: 0.4,
					ease: [0.34, 1.3, 0.64, 1],
				},
				x: {
					duration: 0.45,
					ease: [0.25, 0.1, 0.25, 1],
				},
				opacity: {
					duration: 0.3,
					ease: "easeOut",
				},
			},
		},
	},
	[AnimationType.SPIN_FADE]: {
		initial: {
			rotate: -90,
			opacity: 0,
			scale: 0.85,
			transformOrigin: "center",
		},
		animate: {
			rotate: 0,
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.55,
				ease: [0.34, 1.3, 0.64, 1],
				rotate: {
					type: "spring",
					stiffness: 150,
					damping: 15,
				},
				scale: {
					type: "spring",
					stiffness: 120,
					damping: 12,
				},
				opacity: {
					duration: 0.3,
					ease: "easeOut",
				},
			},
		},
	},
	[AnimationType.BOUNCE_SLIDE]: {
		initial: {
			x: -60,
			opacity: 0,
		},
		animate: {
			x: [null, 15, -7, 3, 0],
			opacity: 1,
			transition: {
				duration: 0.7,
				ease: [0.25, 0.46, 0.45, 0.94],
				times: [0, 0.4, 0.6, 0.8, 1],
				opacity: {
					duration: 0.25,
					ease: "easeOut",
				},
			},
		},
	},
};
