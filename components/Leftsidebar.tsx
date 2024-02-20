"use client";

import Link from "next/link";
import prisma from "@/prisma/client";
import { Drawer, DrawerHeader, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

interface RecentAdded {
  id: string;
  name: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  categoryId: string;
}

const SideSection = ({recentAdded}: {recentAdded: RecentAdded[]}) => {
  return (
  <div className='p-3'>
    <section className="h-full background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex flex-col justify-between overflow-y-auto border-r p-6 shadow-light-300 dark:shadow-none lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-6">
        <h2 className="font-bold">Recently Added</h2>
        <ScrollArea className=''>
          {recentAdded.map(item => {

            return (
                <p
                  key={item.name}
                  className="my-3"
                >
                  {item.name}
                </p>
            );
            })}
        </ScrollArea>
      </div>

      <Link href="/add">
            <button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-1 shadow-none bg-sky-500">
              <span className="primary-text-gradient text-white text-[24px]">
                +
              </span>
            </button>
        </Link>
    </section>
  </div>
  )
}

const LeftSidebar = ({showSidebar, setShowSidebar}: {showSidebar: boolean, setShowSidebar: (o: boolean) => void}) => {
  //const recentAdded = await prisma.bookmark.findMany();
  //console.log('recentAdded', recentAdded);
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [bookmarks, setBookmarks]: any = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch(`/api/bookmarks`);
            if (response.ok) {
            const data = await response.json();
            setBookmarks(data);
            } else {
            console.error('Error fetching data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
  }, []);
  if (!isDesktop)  {
    return (
      <Drawer direction='left' open={showSidebar} onOpenChange={setShowSidebar}>
        <DrawerTrigger asChild>
        </DrawerTrigger>
        <DrawerContent className='h-screen top-0 left-0 right-auto mt-0 w-[200px] rounded-none'>
          {/* <ScrollArea className='h-screen'> */}
            <SideSection recentAdded={bookmarks} />
          {/* </ScrollArea> */}
        </DrawerContent>
      </Drawer>
    )
  }
  return (<SideSection recentAdded={bookmarks} />);
};

export default LeftSidebar;
