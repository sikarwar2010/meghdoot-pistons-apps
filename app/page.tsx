import { Show, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Welcome to MEGH Apps</h1>
      <Show when={'signed-in'}>
        <Link href="/dashboard" className="text-blue-500 hover:underline">
          Go to Dashboard
        </Link>
        <UserButton />
      </Show>
      <Show when={'signed-out'}>
        <SignInButton />
      </Show>
    </div>
  );
}
