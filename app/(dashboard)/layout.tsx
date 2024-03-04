"use client";
import LeftSidebar from "@/components/Leftsidebar";
import Navbar from "@/components/Navbar";
import React, { createContext, useState } from "react";
import { useRouter } from "next/navigation";

export const SelectedCategoryContext = createContext(null);

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const router = useRouter();
  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category);
    router.push('/list');
  };
  return (
      <SelectedCategoryContext.Provider value={selectedCategory}>
        <main className="bg-grey flex min-h-screen flex-col background-light850_dark100 relative">
          <Navbar setShowSidebar={setShowSidebar} />
          <div className="flex flex-grow">
            <LeftSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} onSelectCategory={handleCategorySelect} />
            <section className="flex flex-1 flex-col px-6 pb-6 max-md:pb-14 sm:px-14">
              <div className="mx-auto w-full max-w-4xl">{children}</div>
            </section>
          </div>
        </main>
      </SelectedCategoryContext.Provider>
  );
};

export default Layout;
