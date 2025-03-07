import { Animate } from "@/components/animate";
import type { AnimationType } from "@/components/animate/types";
import { pageVariants } from "@/components/animate/variants";
import { memo, useCallback, useState } from "react";

// 使用 memo 优化静态内容的重渲染
const AnimationItem = memo(({ name }: { name: string }) => (
	<div className="inline-block bg-white p-4 rounded-md shadow-md">
		<span>{name}</span>
	</div>
));

// 使用 memo 优化动画组件的重渲染
const AnimationPreview = memo(({ type }: { type: string }) => (
	<Animate
		key={`${type}-preview`}
		type={type as AnimationType}
		config={{
			duration: 1.5,
			repeat: Number.POSITIVE_INFINITY,
			repeatType: "loop",
		}}
		className="inline-block bg-white p-4 rounded-md shadow-md"
	>
		<span>{type}</span>
	</Animate>
));

const AnimateSelect = memo(({ onSelect }: { onSelect: (type: AnimationType) => void }) => {
	const [hoveredAnimation, setHoveredAnimation] = useState<string | null>(null);
	const handleSelect = useCallback(
		(type: AnimationType) => {
			onSelect(type);
		},
		[onSelect],
	);

	return (
		<div className="grid grid-cols-2 gap-4 p-4 max-w-4xl mx-auto h-[400px] overflow-y-auto">
			{Object.keys(pageVariants).map((animationType) => (
				<div
					key={animationType}
					className="bg-gray-100 p-4 rounded-lg cursor-pointer flex justify-center hover:text-primary transition-colors duration-200"
					onClick={() => handleSelect(animationType as AnimationType)}
					onMouseEnter={() => setHoveredAnimation(animationType)}
					onMouseLeave={() => setHoveredAnimation(null)}
				>
					{hoveredAnimation === animationType ? (
						<AnimationPreview type={animationType} />
					) : (
						<AnimationItem name={animationType} />
					)}
				</div>
			))}
		</div>
	);
});

export default AnimateSelect;
