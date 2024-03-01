"use client"; 
import { useContext, useEffect, useState } from 'react';
import { SelectedCategoryContext } from '../layout';
import { useQueryClient } from '@tanstack/react-query';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Bookmark, Category } from '@/hooks/useCategories';


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

  const queryClient = useQueryClient();

  const { data: bookmarks, isFetching: isFetchingBookmarks } = useBookmarks(false, selectedCategory ? selectedCategory.id : undefined)

  useEffect(() => {
    setFilteredBookmarks(bookmarks.filter(bookmark => bookmark.isSelected));
  }, [bookmarks])
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
    const selectedBookmarks = bookmarks.filter(bookmark => bookmark.isSelected);
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
          <div key={bookmark.id} className="bg-[#585858] border p-2 text-center">
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
