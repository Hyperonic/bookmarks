"use client";

import Link from "next/link";
import prisma from "@/prisma/client";
import { Drawer, DrawerHeader, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSession, useOrganizationList } from '@clerk/nextjs';
import { Category, useCategories } from "@/hooks/useCategories";
import { useQueryClient } from "@tanstack/react-query";
import { useBookmarks, useSelectedBookmarks } from "@/hooks/useBookmarks";
import classnames from "classnames";


// interface RecentAdded {
//   id: string;
//   name: string;
//   link: string;
//   createdAt: Date;
//   updatedAt: Date;
//   userId: string;
//   categoryId: string;
// }

const SideSection = ({recentAdded, isAdmin, handleCategoryClick, selectedCategory}: {recentAdded: Category[], isAdmin: boolean, handleCategoryClick: any, selectedCategory: any}) => {
  return (
  <div className='bg-blue p-3 text-white'>
    <section className="h-full background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex flex-col justify-between overflow-y-auto shadow-light-300 dark:shadow-none lg:w-[266px]">
      <div className="p-6 flex flex-1 flex-col gap-6">
        {
          isAdmin ? (
            <button className="font-bold text-left text-recentAdded">
              <Link href="/categories">Manage Categories</Link>
            </button>) : ''
        }
        <h2 className="font-bold text-recentAdded">Recently Added</h2>
        <ScrollArea className=''>
          {recentAdded.map(item => {

            return (
                <p
                  onClick={() => handleCategoryClick(item)}
                  key={item.id}
                  className={classnames('my-3  cursor-pointer', {'font-bold': selectedCategory?.id === item.id })}
                >
                  {item.name}
                </p>
            );
            })}
        </ScrollArea>
      </div>

      <Link href="/add">
            <button className="border small-medium btn-secondary min-h-[41px] w-full px-4 py-1 shadow-none bg-blue">
              <span className="primary-text-gradient text-recentAdded text-[24px]">
                +
              </span>
            </button>
        </Link>
    </section>
  </div>
  )
}

const LeftSidebar = ({showSidebar, setShowSidebar, onSelectCategory}: {showSidebar: boolean, setShowSidebar: (o: boolean) => void, onSelectCategory: any}) => {
  //const recentAdded = await prisma.bookmark.findMany();
  //console.log('recentAdded', recentAdded);
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { session } = useSession();
  let isAdmin = false;

  console.log('session', session);
  const organizationMemberships = session?.user?.organizationMemberships || [];
  console.log('organizationMemberships', organizationMemberships);
  for (const membership of organizationMemberships) {
    if (membership.role == "org:admin") {
      isAdmin = true;
      break;
    }
  }

  const { organizationList, isLoaded } = useOrganizationList();

  console.log('isLoaded', isLoaded);
  console.log('organizationList', organizationList);

  // useEffect(() => {
  //   console.log('isLoaded', isLoaded);
  //   console.log('organizationList', organizationList);
  // }, [isLoaded, organizationList]);

  // // Loop through all organization memberships
  // for (const membership of organizationMemberships) {
  //   if (membership.role) {
  //     return membership.role.toLowerCase(); // Return the role in lowercase if it exists
  //   }
  // }

  const queryClient = useQueryClient();

  const { data: categoriesData, isFetching: isFetchingCategories } = useCategories();
  const { data: bookmarksData, isFetching: isFetchingBookmarks } = useBookmarks();
  const { data: userData, isFetching: isFetchingSelectedBookmarks } = useSelectedBookmarks();

  const [categories, setCategories] = useState<Category[]>([]);


  useEffect(() => {
    if (!isFetchingCategories && !isFetchingBookmarks && !isFetchingSelectedBookmarks && userData) {
      const filteredCategories = categoriesData.filter(category => {
        if(userData.hiddenCategories.includes(category.id)) {
          return false;
        }
        return bookmarksData.some(bookmark => bookmark.categoryId === category.id && (userData.selectedBookmarks.includes(bookmark.id) || bookmark.isSelected))
      })
      setCategories(filteredCategories);
    }
  }, [categoriesData, bookmarksData, isFetchingCategories, isFetchingBookmarks, userData, isFetchingSelectedBookmarks]);

  //const [bookmarks, setBookmarks]: any = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //       try {
  //           const response = await fetch(`/api/bookmarks`);
  //           if (response.ok) {
  //           const data = await response.json();
  //           setBookmarks(data);
  //           } else {
  //           console.error('Error fetching data:', response.statusText);
  //           }
  //       } catch (error) {
  //           console.error('Error fetching data:', error);
  //       }
  //   };

  //   fetchData();
  // }, []);
  const [ selectedCategory, setSelectedCategory ] = useState(null);
  const handleCategoryClick = (category: any) => {
    onSelectCategory(category); // Notify parent component of selected category
    setSelectedCategory(category);
  };
  if (!isDesktop)  {
    return (
      <Drawer direction='left' open={showSidebar} onOpenChange={setShowSidebar}>
        <DrawerTrigger asChild>
        </DrawerTrigger>
        <DrawerContent className='h-screen top-0 left-0 right-auto mt-0 w-[200px] rounded-none'>
          {/* <ScrollArea className='h-screen'> */}
            <SideSection recentAdded={categories} isAdmin={isAdmin} handleCategoryClick={handleCategoryClick} selectedCategory={selectedCategory} />
          {/* </ScrollArea> */}
        </DrawerContent>
      </Drawer>
    )
  }
  return (<SideSection recentAdded={categories} isAdmin={isAdmin} handleCategoryClick={handleCategoryClick} selectedCategory={selectedCategory} />);
};

export default LeftSidebar;
