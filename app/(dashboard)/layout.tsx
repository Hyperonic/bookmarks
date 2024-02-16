import LeftSidebar from "@/app/components/Leftsidebar";
import Navbar from "@/app/components/Navbar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen flex-col background-light850_dark100 relative">
      <Navbar />
      <div className="flex flex-grow">
        <LeftSidebar />
        <section className="flex flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-4xl">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default Layout;
