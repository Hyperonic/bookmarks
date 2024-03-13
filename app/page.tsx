import { SignInButton, SignOutButton, auth } from '@clerk/nextjs'
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FcGoogle } from "react-icons/fc";
import Image from 'next/image'


export default function Home() {
  const { userId } = auth();
  //const pathname = headers().get('x-pathname');
  //console.log('clerkuser path', userId, pathname);
  if (userId) {
    redirect('/list')
  }
  return (
    <main className="min-h-screen p-2 bg-cover bg-no-repeat bg-[url(/landing.png)]">
     {/* <Link href="/list">
          <button className="large btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
            <span className="primary-text-gradient max-lg:hidden">
              List
            </span>
          </button>
      </Link> */}
      <Image
        src="/qikdaw.png"
        width={384}
        height={192}
        alt="QikDaw"
      />
      <div className="flex flex-col ml-[100px] w-[250px] items-center">
        <span className="inline-block mb-[10px] text-white text-3xl font-bold">Easiest way to</span>
        <span className="inline-block mb-[10px] text-white text-3xl font-bold">save and access</span>
        <span className="inline-block mb-[10px] text-white text-3xl font-bold">your favorite</span>
        <span className="text-white text-3xl font-bold">websites</span>
      </div>
      <Image
        className="inline absolute bottom-[50px] left-[150px]"
        src="/qd.png"
        width={140}
        height={140}
        alt="QikDaw"
      />
     <SignInButton>
        <button className="absolute top-[150px] right-[150px] bg-sky-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-sky-700 focus:outline-none border border-sky-400">
          <FcGoogle className="inline text-[24px]" /> Login with Google or Email
        </button>
      </SignInButton>
      {/* <SignOutButton>
      <button>Sign out</button>
      </SignOutButton> */}
    </main>
  );
}
