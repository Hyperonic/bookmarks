"use client"; 
import { Button, TextFieldRoot, TextFieldInput, SelectRoot, SelectGroup, SelectContent, SelectLabel, SelectItem, SelectTrigger } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { bookmarksSchema } from '@/app/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from "@clerk/nextjs";
import axios from 'axios';
import { ImSpinner2 } from "react-icons/im";
import classNames from 'classnames';
import { Category, useAddCategory, useCategories } from '@/hooks/useCategories';
import { useAddBookmark, useBookmarks, useUpdateBookmark } from '@/hooks/useBookmarks';
import { DevTool } from "@hookform/devtools";



type BookmarkFormData = z.infer<typeof bookmarksSchema>;

// interface Category {
//     id: number,
//     name: string
// }

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
const AddPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const router = useRouter();
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<BookmarkFormData>({
        resolver: zodResolver(bookmarksSchema),
    });
    const { userId } = useAuth();

    // const fetchData = async () => {
    //     try {
    //         const response = await axios.get(`/api/categories`);
    //         if (response) {
    //         //const data = await response.json();
    //         setCategories(response.data);
    //       }
    //     } catch (error) {
    //       console.error('Error fetching categories:', error);
    //     }
    //   };
    
    //   useEffect(() => {
    //     fetchData();
    //   }, []);

    const onSubmit = handleSubmit(async (data) => {
        setIsSubmitting(true);
        try {
            console.log(data, userId);
            // const response = await axios.post('/api/bookmarks', {
            //         categoryId: data.categoryId,
            //         name: data.name,
            //         link: data.link,
            //         userId,
            // });
            // console.log('resp', response);
          let categoryId = categories.find(categ => categ.name === input)?.id;
          if (!categoryId) {
            const { data: { id } } = await addCategory({name: input, isAdminAdded: false});
            categoryId = id;
            console.log('resp', data);
          }
          await addBookmark({
              categoryId: categoryId as string,
              name: data.name,
              link: data.link,
              isAdminAdded: false,
              isSelected: true
          });
        //router.push('/list');
        //router.refresh();
        } catch (error) {
            console.log(error);
        } finally {
          setIsSubmitting(false);
        }
    });
    const ref = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);
  const [filteredCategories, setFiltered] = useState<Category[]>([]);
  const [isShow, setIsShow] = useState(false);
  const [input, setInput] = useState("");
  
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget.value;
    const newFilteredCategories = categories.filter(
      category =>
        category.name.toLowerCase().indexOf(input.toLowerCase()) > -1
    );
    setActive(0);
    setFiltered(newFilteredCategories);
    setIsShow(true);
    setInput(e.currentTarget.value)
  };
  const onFocus = () => {
    setFiltered(categories);
    setIsShow(true);
  };
const onClick = (e: React.MouseEvent<HTMLElement>) => {
    setActive(0);
    setFiltered([]);
    setIsShow(false);
    setInput(e.currentTarget.innerText)
  };
const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) { // enter key
      setActive(0);
      setIsShow(false);
      setInput(filteredCategories[active-1].name)
    }
    else if (e.keyCode === 38) { // up arrow
      return (active === 0) ? null : setActive(active - 1);
    }
    else if (e.keyCode === 40) { // down arrow
      return (active - 1 === filteredCategories.length) ? null : setActive(active + 1);
    }
  };

  const { data: categoriesData, isFetching: isFetchingCategories } = useCategories(false);
  const { data: bookmarksData, isFetching: isFetchingBookmarks } = useBookmarks(false);
  useEffect(() => {
        if (!isFetchingCategories && !isFetchingBookmarks) {
            const categ: any = categoriesData.map((category: Category) => {
              return {...category, bookmarks: bookmarksData.filter((bookmark: any) => bookmark.categoryId === category.id)};
          })
            setCategories(categ);
        }
    }, [categoriesData, isFetchingCategories, bookmarksData, isFetchingBookmarks]);
    const { mutateAsync: addCategory, isPending: isAddingCategory, isError: addingCategoryError, error: addingCategoryErrorMsg } = useAddCategory();
    const { mutateAsync: addBookmark, isPending: isAddingBookmark,  } = useAddBookmark();
    const { mutateAsync: updateBookmark, isPending: isUpdatingBookmark, } = useUpdateBookmark();
    const [prevSelection, setPrevSelection] = useState<{ [key: string]: any }>({});
    const doneSuggestion = async () => {
      try {
        const updatedBookmarks = categories
          .flatMap(category => category.bookmarks)
          .filter(bookmark => bookmark.isSelected && bookmark.isSelected !== prevSelection[bookmark.id]);

        // Perform mutation to update bookmarks with changed isSelected property
        //await mutationFn(updatedBookmarks);
      } catch (error) {
          console.error('Error updating bookmark:', error);
      }
    }

// Function to toggle the isSelected property of a bookmark
const toggleBookmarkSelection = (bookmark: any) => {
  bookmark.isSelected = !bookmark.isSelected;
  setPrevSelection(prevState => ({
    ...prevState,
    [bookmark.id]: bookmark.isSelected,
  }));
};
    return (
      <div className="mt-4 flex flex-col align-center">
      <h4>Create Category</h4>
    <form onSubmit={onSubmit} className="mt-4 flex flex-col align-center">
        <div className="flex items-center mb-4">
        <label className="mr-2 w-[100px]">Category</label>
        <div
            // use classnames here to easily toggle dropdown open 
            className={classNames({
                "dropdown w-full": true,
                "dropdown-open": isShow,
            })}
            ref={ref}
        >
        <input
            type="text"
            className="px-2 h-[32px] w-full border border-greyBorder bg-grey"
            value={input}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onClick={onFocus}
            placeholder=""
            tabIndex={0}
        />{
            (() => {
            if (isShow) {
                if (filteredCategories.length) {
                    return (
                        <div className="z-20 dropdown-content bg-base-200 max-h-96 overflow-auto flex-col rounded-md">
                            <ul
                            className="menu menu-compact "
                            // use ref to calculate the width of parent
                            style={{ width: ref.current?.clientWidth }}
                            >
                            {filteredCategories.map((item, index) => {
                                return (
                                <li
                                    key={index}
                                    tabIndex={index + 1}
                                    onClick={onClick}
                                    className={classNames("border-b border-b-base-content/10 w-full", {'bg-grey': index === active})}
                                >
                                    <button>{item.name}</button>
                                </li>
                                );
                            })}
                            </ul>
                        </div>
                        )
                }
            }
        })()
    }
        </div>
        </div>
        <div className="flex items-center mb-4">
            <label className="mr-2 w-[100px]">Link</label>
            <input className="px-2 h-[32px] w-full border border-greyBorder bg-grey" placeholder="" {...register('link')} />
        </div>
        <div className="flex items-center">
            <label className="mr-2 w-[100px]">Name</label>
            <input className="px-2 h-[32px] w-full border border-greyBorder bg-grey" placeholder="" {...register('name')} />
        </div>
        <button className="self-center w-[150px] mt-4 py-2 px-4 drop-shadow-md bg-grey border" type="submit">{isSubmitting ? (<ImSpinner2 className="m-auto animate-spin" />)
: 'Done'}</button>
    <DevTool control={control} />
    </form>
    {categories.length ? (
    <div>
      <h4>Or select from suggestions below</h4>
      {categories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="border-gray-300 rounded">
            <div className="grid grid-cols-6 gap-4">
              {category.bookmarks.map((bookmark: any) => (
                <div onClick={() => toggleBookmarkSelection(bookmark)} key={bookmark.id} className={classNames('cursor-pointer border-gray-300 rounded-lg border p-2 text-center', {'bg-green': bookmark.isSelected})}>
                  {bookmark.name}
                </div>
              ))}
            </div>
          </div>
      ))}
      <button className="self-center w-[150px] mt-4 py-2 px-4 drop-shadow-md bg-grey border" onClick={doneSuggestion}>Done</button>
      </div>) : ''}
    </div>
    )
}

// export async function getStaticProps() {
//     // Fetch data from an external source
//     let categories = [];
//     try {
//         categories = await prisma.category.findMany();
//     } catch (error) {
//         console.error('Error fetching categories:', error);
//         throw error;
//     }
    
//     // Return the data as props
//     return {
//         props: {
//             categories,
//         },
//     };
// }

export default AddPage
