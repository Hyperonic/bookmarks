"use client"; 
import { useCallback, useContext, useEffect, useState } from 'react';
import { SelectedCategoryContext } from '../layout';
import { useQueryClient } from '@tanstack/react-query';
import { useBookmarks, useDeleteBookmark, useSelectedBookmarks, useUpdateBookmarkSelection } from '@/hooks/useBookmarks';
import { Bookmark, Category } from '@/hooks/useCategories';
import { FaMinus } from 'react-icons/fa';


const getData = async () => {
//   const user = await getUserFromClerkID()
//   const analyses = await prisma.entryAnalysis.findMany({
//     where: {
//       userId: user.id,
//     },
//     orderBy: {
//       createdAt: 'asc',
//     },
//   })
//   const total = analyses.reduce((acc, curr) => {
//     return acc + curr.sentimentScore
//   }, 0)
//   const average = total / analyses.length
//   return { analyses, average }
}

const ListPage = () => {
  //const { analyses, average } = await getData()
  //const [bookmarks, setBookmarks]: any = useState([]);
  const [filteredBookmarks, setFilteredBookmarks]: any = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedCategory = useContext(SelectedCategoryContext) as Category | null;

  const { data: bookmarks, isFetching: isFetchingBookmarks } = useBookmarks(false, selectedCategory ? selectedCategory.id : undefined)

  const { data: userData, isFetching: isFetchingSelectedBookmarks } = useSelectedBookmarks();

  const { mutateAsync: removeBookmark, isPending: isRemovingBookmark, } = useDeleteBookmark();

  const { mutateAsync: updateUser, isPending: isUpdatingUser, } = useUpdateBookmarkSelection();

  const getBookmarks = useCallback(() => {
    return bookmarks.filter(bookmark => (selectedCategory ? bookmark.categoryId === selectedCategory?.id : true) && 
        ((bookmark.isSelected && !userData.unselectedBookmarks?.includes(bookmark.id)) || userData.selectedBookmarks?.includes(bookmark.id))
    )
  }, [bookmarks, selectedCategory, userData]);

  useEffect(() => {
    if (bookmarks && userData) {
      setFilteredBookmarks(getBookmarks());
    }
  }, [bookmarks, selectedCategory, userData, getBookmarks])
  // useEffect(() => {
  //   const fetchData = async () => {
  //       try {
  //           const response = await fetch(`/api/bookmarks`);
  //           if (response.ok) {
  //           const data = await response.json();
  //           setBookmarks(data);
  //           console.log('filteredBookmarks',);
  //           setFilteredBookmarks(data);
  //           } else {
  //           console.error('Error fetching data:', response.statusText);
  //           }
  //       } catch (error) {
  //           console.error('Error fetching data:', error);
  //       }
  //   };

  //   fetchData();
  // }, []);
  const filterBookmarks = (searchTerm: string) => {
    const selectedBookmarks = getBookmarks();
    let filteredBookmarks = selectedBookmarks;
    if (searchTerm.trim()) {
      filteredBookmarks = selectedBookmarks.filter((bookmark: any) =>
        bookmark.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.link.toLowerCase().includes(searchTerm.toLowerCase()) //||
        //bookmark.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredBookmarks(filteredBookmarks);
  };
  const handleRemoveBookmark = async (bookmark: any) => {
    console.log(bookmark);
    if (!bookmark.isAdminAdded) {
      await removeBookmark(bookmark.id);
    }
      let { selectedBookmarks, hiddenCategories, unselectedBookmarks } = userData;
      const getFilteredBookmarks = () => {
        return bookmarks.filter(bookmark => (selectedCategory ? bookmark.categoryId === selectedCategory?.id : true) && 
            ((bookmark.isSelected && !unselectedBookmarks?.includes(bookmark.id)) || selectedBookmarks?.includes(bookmark.id))
        )
      }
      if (selectedBookmarks.includes(bookmark.id)) {
        selectedBookmarks = selectedBookmarks.filter((itemId: any) => itemId !== bookmark.id);
      }
      if (bookmark.isAdminAdded) {
        unselectedBookmarks = [...unselectedBookmarks, bookmark.id];
      }
      if (!getFilteredBookmarks().filter(itemBookmark => itemBookmark.id !== bookmark.id).length) {
          hiddenCategories = [...hiddenCategories, selectedCategory?.id];
      }
      const userDataPayload = { hiddenCategories, selectedBookmarks, unselectedBookmarks };
      updateUser(userDataPayload);
  }
  return (
    <div>
      <div className="my-4">
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => filterBookmarks(e.target.value)}
          className="placeholder:italic bg-grey border border-gray-300 rounded-lg px-4 py-2 w-full"
        />
      </div>
      <div className="grid grid-cols-6 gap-4">
        {filteredBookmarks.map((bookmark: any) => (
          <div key={bookmark.id} className="relative bg-[#585858] border p-2 text-center group"
          >
              <div className="absolute top-0 right-0 -mt-1 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  className="bg-red-500 text-white rounded-full p-1"
                  onClick={() => handleRemoveBookmark(bookmark)}
                >
                  <FaMinus className="text-sm" />
                </button>
              </div>
            <a href={bookmark.link} target="_blank" rel="noopener noreferrer" className="text-lg text-white font-semibold">
            {bookmark.name}
            </a>
            {/* <h2 className="text-lg text-white font-semibold">{bookmark.name}</h2> */}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListPage
