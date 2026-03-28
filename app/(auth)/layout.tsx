export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col h-screen items-center justify-center">
			{children}
		</div>
	);
}
