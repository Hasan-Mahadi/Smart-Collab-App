export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 p-12 lg:flex">
        <div className="max-w-md text-white">
          <h1 className="text-4xl font-bold">
            Smart Project & Task Collaboration
          </h1>
          <p className="mt-4 text-lg text-indigo-100">
            Streamline your team&apos;s workflow with powerful project
            management, task tracking, and real-time collaboration.
          </p>
          <div className="mt-8 space-y-3">
            {[
              'Role-based access control',
              'Real-time analytics dashboard',
              'Team collaboration tools',
              'Smart notifications',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-300" />
                <span className="text-indigo-100">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
