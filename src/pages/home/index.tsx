import { Animate } from "@/components/animate";
import { AnimationType } from "@/components/animate/types";
export default function Home() {
	return (
		<div>
			Home
			<Animate
				type={AnimationType.FADE_IN}
				exit={AnimationType.FADE_OUT}
				config={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
			>
				<div>
					<h1>Hello</h1>
				</div>
			</Animate>
		</div>
	);
}
