"use client"; 
import { useEffect, useState } from 'react';


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
  const [bookmarks, setBookmarks]: any = useState([]);
  const [filteredBookmarks, setFilteredBookmarks]: any = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch(`/api/bookmarks`);
            if (response.ok) {
            const data = await response.json();
            setBookmarks(data);
            setFilteredBookmarks(data);
            } else {
            console.error('Error fetching data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
  }, []);
  const filterBookmarks = (searchTerm: string) => {
    let filteredBookmarks = bookmarks;
    if (searchTerm.trim()) {
      filteredBookmarks = bookmarks.filter((bookmark: any) =>
        bookmark.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredBookmarks(filteredBookmarks);
  };
  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search bookmarks"
          onChange={(e) => filterBookmarks(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {filteredBookmarks.map((bookmark: any) => (
          <div key={bookmark.id} className="bg-gray-200 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">{bookmark.name}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListPage
