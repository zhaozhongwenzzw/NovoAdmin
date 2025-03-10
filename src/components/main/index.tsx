export default function Main({ children }: { children: React.ReactNode }) {
	return <main className="flex flex-col h-full gap-4 overflow-hidden">{children}</main>;
}
