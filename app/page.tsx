import { SignInButton, SignOutButton, auth } from '@clerk/nextjs'
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FcGoogle } from "react-icons/fc";



export default function Home() {
  const { userId } = auth();
  //const pathname = headers().get('x-pathname');
  //console.log('clerkuser path', userId, pathname);
  if (userId) {
    redirect('/list')
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-cover bg-no-repeat bg-[url(/landing.png)]">
     {/* <Link href="/list">
          <button className="large btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
            <span className="primary-text-gradient max-lg:hidden">
              List
            </span>
          </button>
      </Link> */}
     <SignInButton>
        <button className="bg-sky-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-sky-700 focus:outline-none border border-sky-400">
          <FcGoogle className="inline" /> Login with Google
        </button>
      </SignInButton>
      {/* <SignOutButton>
      <button>Sign out</button>
      </SignOutButton> */}
    </main>
  );
}
