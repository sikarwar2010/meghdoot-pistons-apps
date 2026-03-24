import { Show, SignInButton, UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Welcome to MEGH Apps</h1>
      <Show when={'signed-in'}>
        <UserButton />
      </Show>
      <Show when={'signed-out'}>
        <SignInButton />
      </Show>
    </div>
  );
}
