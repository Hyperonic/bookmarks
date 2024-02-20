"use client";
import LeftSidebar from "@/components/Leftsidebar";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <main className="flex min-h-screen flex-col background-light850_dark100 relative">
      <Navbar setShowSidebar={setShowSidebar} />
      <div className="flex flex-grow">
        <LeftSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <section className="flex flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-4xl">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default Layout;
