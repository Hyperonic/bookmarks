import { useMediaQuery } from "@/hooks/use-media-query";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { FiMenu } from "react-icons/fi";

const Navbar = ({setShowSidebar}: any) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
    return (
      <div className='flex bg-slate-200 p-3 space-x-3 justify-end'>
          {isDesktop ? '' : <button
            className="text-4xl mr-auto flex text-white"
            onClick={() => {
              setShowSidebar(true);
            }}
            >
              <FiMenu />
          </button>}
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded border border-gray-400 px-3 py-0.5">
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
      </div>
    )
  }
  
  export default Navbar
  