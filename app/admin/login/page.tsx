import LoginForm from "./LoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;

  return (
    <div className="flex min-h-svh items-center justify-center bg-ink px-6">
      <div className="card w-full max-w-sm p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-copper">Danumai</p>
        <h1 className="mt-3 font-display text-2xl tracking-tight text-paper">
          Admin sign in
        </h1>
        <LoginForm from={from ?? "/admin"} />
      </div>
    </div>
  );
}
