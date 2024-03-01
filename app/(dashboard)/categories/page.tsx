
"use client";
import { useEffect, useMemo, useState } from 'react';
import {
  MantineReactTable,
  MRT_EditActionButtons,
  MRT_TableOptions,
  MRT_ColumnDef,
  useMantineReactTable,
  MRT_EditCellTextInput
} from 'mantine-react-table';
import { ActionIcon, Button, Flex, Text, Stack, Title, Tooltip } from '@mantine/core';
import { ModalsProvider, modals } from '@mantine/modals';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoRemoveCircleOutline } from "react-icons/io5";
import { FiPlusCircle } from "react-icons/fi";
import { ImCancelCircle } from "react-icons/im";
import { LiaAngleDownSolid } from "react-icons/lia";
import { LiaAngleRightSolid } from "react-icons/lia";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Bookmark, Category, useAddCategory, useCategories, useDeleteCategory, useUpdateCategory } from '@/hooks/useCategories';
import { useAddBookmark, useBookmarks, useDeleteBookmark, useUpdateBookmark } from '@/hooks/useBookmarks';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookmarksSchema } from '@/app/validationSchemas';
import { useForm } from 'react-hook-form';
import { z } from 'zod';





{/* <ImCancelCircle /> */}






/* const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
    ]
);

const handleSaveRow: MRT_TableOptions<Person>['onEditingRowSave'] = async ({
    table,
    row,
    values,
  }) => {
    //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here.
    tableData[row.index] = values;
    //send/receive api updates here
    setTableData([...tableData]);
    table.setEditingRow(null); //exit editing mode
  };
  const [tableData, setTableData] = useState<Person[]>(() => data);

  <MantineReactTable
      columns={columns}
      data={data}
      enableGlobalFilterModes
      enableExpanding
      editDisplayMode="row"
      enableEditing
      onEditingRowSave={handleSaveRow}
      initialState={{
        showGlobalFilter: true,
        expanded: true
      }}
      positionGlobalFilter="left"
    /> */


    

/*     const table = useMantineReactTable({
        columns,
        data,
        getRowId: (row) => row.phoneNumber,
        initialState: { showColumnFilters: true },
        onCreatingRowSave: handleCreateUser,
        onEditingRowSave: handleSaveUser,
        renderRowActions: ({ row, table }) => (
            <Flex gap="md">
                <Tooltip label="Edit">
                <ActionIcon onClick={() => table.setEditingRow(row)}>
                    <IconEdit />
                </ActionIcon>
                </Tooltip>
                <Tooltip label="Delete">
                <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
                    <IconTrash />
                </ActionIcon>
                </Tooltip>
            </Flex>
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <Button
                onClick={() => {
                table.setCreatingRow(true);
                }}
            >
                Create New User
            </Button>
        ),
        state: {
          isLoading,
          isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
          showProgressBars: isRefetching,
        },
      });
    
      return <MantineReactTable table={table} />;  */

type BookmarkFormData = z.infer<typeof bookmarksSchema>;

class CategClass implements Category {
    id: string;
    name: string;
    bookmarks: Bookmark[];
    isAdminAdded: boolean;
    newBookmarkName = ''; // Initialize to empty string
    newBookmarkLink = ''; // Initialize to empty string
    editBookmarkIndex = null;
    editedBookmarkName = '';
    editedBookmarkLink = '';
    newBookmarkSelected = false;
    editedBookmarkSelected = false;
    constructor({id = '', name, isAdminAdded, bookmarks = []}: {id?: string; name: string; isAdminAdded: boolean; bookmarks?: Bookmark[]}) {
        this.id = id;
        this.name = name;
        this.isAdminAdded = isAdminAdded;
        this.bookmarks = bookmarks;
    }
}
      
const CategoriesPage = () => {
    console.log('hello');
    const [validationErrors, setValidationErrors] = useState({} as any);
    const columns = useMemo(
        () => [
          {
            accessorKey: 'name',
            header: 'Name',
          },
          {
            accessorKey: 'link',
            header: 'Link',
            // Cell: ({ cell, row }) => (
            //     <Link href={cell.getValue() as string} passHref legacyBehavior>
            //       <Anchor
            //         target={
            //           (cell.getValue() as string).startsWith('http')
            //             ? '_blank'
            //             : undefined
            //         }
            //         rel="noopener"
            //       >
            //         {row.original?.linkText}
            //       </Anchor>
            //     </Link>
            //   ),
          },
        //   {
        //     accessorKey: 'firstName',
        //     header: 'First Name',
        //     mantineEditTextInputProps: {
        //         type: 'email',
        //         required: true,
        //         error: validationErrors?.firstName,
        //         //remove any previous validation errors when user focuses on the input
        //         onFocus: () =>
        //             setValidationErrors({
        //             ...validationErrors,
        //             firstName: undefined,
        //             }),
        //         //optionally add validation checking for onBlur or onChange
        //     },
        //   },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [validationErrors],
    );
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryIndex, setEditCategoryIndex] = useState<number | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<boolean[]>([]);
  const [editedCategoryName, setEditedCategoryName] = useState<string>('');

  const { mutate: updateCategoryName } = useUpdateCategory();
  const { mutate: removeCategory } = useDeleteCategory();
  
  const queryClient = useQueryClient();

  const { data: categoriesData, isFetching: isFetchingCategories } = useCategories(/* (data: Category[]) => {
    console.log('categ data', data);
    return data.map((category: Category) => {
        //const categ = new CategClass(category);
        return category;
    //   ...category,
    //   newBookmarkName: '', // Initialize to empty string
    //   newBookmarkLink: '', // Initialize to empty string
    //   editBookmarkIndex: null,
    //   editedBookmarkName: '',
    //   editedBookmarkLink: '',
    });
  }, */ true);
  const { data: bookmarksData, isFetching: isFetchingBookmarks } = useBookmarks(true);
  useEffect(() => {
        if (!isFetchingCategories && !isFetchingBookmarks) {
            const categ: any = categoriesData.map((category: Category) => {
                const categ = new CategClass({...category, bookmarks: bookmarksData.filter(bookmark => bookmark.categoryId === category.id)});
                return categ;
            })
            setCategories(categ);
        }
    }, [categoriesData, bookmarksData, isFetchingCategories, isFetchingBookmarks]);
    const { mutateAsync: addCategory, isPending: isAddingCategory, isError: addingCategoryError, error: addingCategoryErrorMsg } = useAddCategory();
    const { mutateAsync: updateCategory, isPending: isUpdatingCategory,  } = useUpdateCategory();
    const { mutateAsync: deleteCategory, isPending: isDeletingCategory,  } = useDeleteBookmark();
    const { mutateAsync: addBookmark, isPending: isAddingBookmark,  } = useAddBookmark();
    const { mutateAsync: removeBookmark, isPending: isRemovingBookmark, } = useDeleteBookmark();
    const { mutateAsync: updateBookmark, isPending: isUpdatingBookmark, } = useUpdateBookmark();

    console.log('querydata get', queryClient.getQueryData(['categories']));
  const toggleCategory = (index: number) => {
    const updatedExpandedCategories = [...expandedCategories];
    updatedExpandedCategories[index] = !updatedExpandedCategories[index];
    setExpandedCategories(updatedExpandedCategories);
  };

  const handleAddCategory = async () => {
    if (newCategoryName.trim() !== '') {
        // setCategories(prevCategories => {
        //     const newCategories = [{ name: newCategoryName, bookmarks: [], editBookmarkIndex: null, newBookmarkName: '', newBookmarkLink: '', editedBookmarkName: '', editedBookmarkLink: '' }, ...prevCategories];
        //     toggleCategory(newCategories.length - 1); // Toggle the newly added category
        //     return newCategories;
        // });
        const categ = new CategClass({ name: newCategoryName, isAdminAdded: true, });
        await addCategory(categ);
        console.log('categories', categories.length);
        toggleCategory(0);
      setNewCategoryName('');
    }
  };

//   const handleRemoveCategory = (index: number) => {
//     const updatedCategories = [...categories];
//     updatedCategories.splice(index, 1);
//     setCategories(updatedCategories);
//   };
  const handleRemoveCategory = async (categoryId: string) => {
    await removeCategory(categoryId);
  };

  const handleSaveEditCategory = async (categoryId: string) => {
    try {
        const updatedCategories = [...categories];
        const categoryIndex = categories.findIndex(categ => categ.id === categoryId);
        const updatedCateg = new CategClass({...updatedCategories[categoryIndex], name: editedCategoryName })
        updatedCategories[categoryIndex] = updatedCateg;
        setCategories(updatedCategories);
      await updateCategoryName({ id: categoryId, name: editedCategoryName });
      setEditCategoryIndex(null);
      setEditedCategoryName('');
    } catch (error) {
      console.error('Error updating category name:', error);
    }
  };

  const handleCancelEditCategory = () => {
    setEditCategoryIndex(null);
    setEditedCategoryName('');
  };

  const handleAddBookmark = async (categoryIndex: number) => {
    console.log('querydata get', queryClient.getQueryData([]));
    console.log('querydata cat', queryClient.getQueryData(['categories']));
    console.log('querydata bookm', queryClient.getQueryData(['bookmarks']));
    const category = categories[categoryIndex];
    if (category.newBookmarkName.trim() !== '' && category.newBookmarkLink.trim() !== '') {
        // const updatedCategory = {
        // ...category,
        // bookmarks: [{ name: category.newBookmarkName, link: category.newBookmarkLink }, ...category.bookmarks]
        // };
        // const updatedCategories = [...categories];
        // updatedCategories[categoryIndex] = updatedCategory;
        // setCategories(updatedCategories);
        // // Clear the new bookmark inputs specific to the category
        // const clearedCategories = updatedCategories.map((cat, index) =>
        // index === categoryIndex ? { ...cat, newBookmarkName: '', newBookmarkLink: '' } : cat
        // );
        // setCategories(clearedCategories);

        await addBookmark({
            categoryId: category.id,
            name: category.newBookmarkName,
            link: category.newBookmarkLink,
            isAdminAdded: true,
            isSelected: category.newBookmarkSelected
        });
    }
  };

  const handleRemoveBookmark = async (bookmarkId: string) => {
    // const category = categories[categoryIndex];
    // const updatedBookmarks = [...category.bookmarks];
    // updatedBookmarks.splice(bookmarkIndex, 1);
    // const updatedCategory = { ...category, bookmarks: updatedBookmarks };
    // const updatedCategories = [...categories];
    // updatedCategories[categoryIndex] = updatedCategory;
    // setCategories(updatedCategories);
    await removeBookmark(bookmarkId);
  };

  const handleBookmarkNameChange = (categoryIndex: number, bookmarkIndex: number, newName: string) => {
    //const categories: any = queryClient.getQueryData(['categories']);
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].editedBookmarkName = newName;
    setCategories(updatedCategories);
    //queryClient.setQueryData(['categories'], updatedCategories);
  };

  const handleBookmarkLinkChange = (categoryIndex: number, bookmarkIndex: number, newLink: string) => {
    //const categories: any = queryClient.getQueryData(['categories']);
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].editedBookmarkLink = newLink;
    setCategories(updatedCategories);
    //queryClient.setQueryData(['categories'], updatedCategories);
  };

  const handleBookmarkSelectChange = (categoryIndex: number, bookmarkIndex: number, isSeleced: boolean) => {
    //const categories: any = queryClient.getQueryData(['categories']);
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].editedBookmarkSelected = isSeleced;
    setCategories(updatedCategories);
    //queryClient.setQueryData(['categories'], updatedCategories);
  };

  const handleEditCategory = (index: number) => {
    setEditCategoryIndex(index);
    setEditedCategoryName(categories[index].name);
  };

  const handleEditBookmark = (categoryIndex: number, bookmarkIndex: number) => {
    //const categories: any = queryClient.getQueryData(['categories']);
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].editBookmarkIndex = bookmarkIndex;
    updatedCategories[categoryIndex].editedBookmarkName = updatedCategories[categoryIndex].bookmarks[bookmarkIndex].name;
    updatedCategories[categoryIndex].editedBookmarkLink = updatedCategories[categoryIndex].bookmarks[bookmarkIndex].link;
    updatedCategories[categoryIndex].editedBookmarkSelected = updatedCategories[categoryIndex].bookmarks[bookmarkIndex].isSelected;
    setCategories(updatedCategories);
    //queryClient.setQueryData(['categories'], updatedCategories);
  };

  const handleSaveEditBookmark = async (categoryIndex: number, bookmarkIndex: number) => {
    // const updatedCategories = [...categories];
    // updatedCategories[categoryIndex].bookmarks[bookmarkIndex].name = updatedCategories[categoryIndex].editedBookmarkName;
    // updatedCategories[categoryIndex].bookmarks[bookmarkIndex].link = updatedCategories[categoryIndex].editedBookmarkLink;
    // updatedCategories[categoryIndex].editBookmarkIndex = null;
    // updatedCategories[categoryIndex].editedBookmarkName = '';
    // updatedCategories[categoryIndex].editedBookmarkLink = '';
    // setCategories(updatedCategories);
    const { id } = categories[categoryIndex].bookmarks[bookmarkIndex];
    const { editedBookmarkName, editedBookmarkLink, editedBookmarkSelected } = categories[categoryIndex];
    
    try {
        const updatedCategories = [...categories];
        updatedCategories[categoryIndex].bookmarks[bookmarkIndex].name = updatedCategories[categoryIndex].editedBookmarkName;
        updatedCategories[categoryIndex].bookmarks[bookmarkIndex].link = updatedCategories[categoryIndex].editedBookmarkLink;
        updatedCategories[categoryIndex].bookmarks[bookmarkIndex].isSelected = updatedCategories[categoryIndex].editedBookmarkSelected;
        updatedCategories[categoryIndex].editBookmarkIndex = null;
        updatedCategories[categoryIndex].editedBookmarkName = '';
        updatedCategories[categoryIndex].editedBookmarkLink = '';
        updatedCategories[categoryIndex].editedBookmarkSelected = false;
        // Call the mutation function to update the bookmark
        await updateBookmark({ id, name: editedBookmarkName, link: editedBookmarkLink, isSelected: editedBookmarkSelected });
        
        // If mutation is successful, clear the edit state
        /* const updatedCategories = [...categories];
        updatedCategories[categoryIndex].editBookmarkIndex = null;
        updatedCategories[categoryIndex].editedBookmarkName = '';
        updatedCategories[categoryIndex].editedBookmarkLink = ''; */
        //setCategories(updatedCategories);
    } catch (error) {
        console.error('Error updating bookmark:', error);
        // Handle error, if needed
    }
  };

  const handleCancelEditBookmark = (categoryIndex: number) => {
    //const categories: any = queryClient.getQueryData(['categories']);
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].editBookmarkIndex = null;
    updatedCategories[categoryIndex].editedBookmarkName = '';
    updatedCategories[categoryIndex].editedBookmarkLink = '';
    updatedCategories[categoryIndex].editedBookmarkSelected = false;
    setCategories(updatedCategories);
    //queryClient.setQueryData(['categories'], updatedCategories);
  };

  const handleCategoryNameChange = (index: number, newName: string) => {
    setEditedCategoryName(newName);
  };

//   const handleSaveEditCategory = (index: number) => {
//     const updatedCategories = [...categories];
//     updatedCategories[index].name = editedCategoryName;
//     setCategories(updatedCategories);
//     setEditCategoryIndex(null);
//     setEditedCategoryName('');
//   };

  const handleNewBookmarkNameChange = (categoryIndex: number, value: string) => {
    // Retrieve the current categories data from the cache
    //const categories: any = queryClient.getQueryData(['categories']);
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].newBookmarkName = value;
    setCategories(updatedCategories);
    //queryClient.setQueryData(['categories'], updatedCategories);
  };
  
  const handleNewBookmarkLinkChange = (categoryIndex: number, value: string) => {
    //const categories: any = queryClient.getQueryData(['categories']);
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].newBookmarkLink = value;
    setCategories(updatedCategories);
    //queryClient.setQueryData(['categories'], updatedCategories);
}

const handleNewBookmarkSelectedChange = (categoryIndex: number, value: boolean) => {
    // Retrieve the current categories data from the cache
    //const categories: any = queryClient.getQueryData(['categories']);
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].newBookmarkSelected = !updatedCategories[categoryIndex].newBookmarkSelected;
    setCategories(updatedCategories);
    //queryClient.setQueryData(['categories'], updatedCategories);
  };

//   const handleEditBookmark = (categoryIndex: number, bookmarkIndex: number) => {
//     setEditBookmarkIndex({ categoryIndex, bookmarkIndex });
//   };

const {
    register,
    control,
    handleSubmit,
    formState: { errors },
} = useForm<BookmarkFormData>({
    resolver: zodResolver(bookmarksSchema)});



  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl mb-4">Categories</h1>
      {(isFetchingCategories || isFetchingBookmarks) && (
            <span>Loading...</span>
        )}
      <div className="space-y-4">
        <div className="flex space-x-2 items-center mt-4">
            <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New Category Name"
            className="border-b border-gray-400 outline-none px-2 py-1 flex-grow"
            />
            <button onClick={handleAddCategory} disabled={isAddingCategory} className="border-green-500 text-green-500 px-2 py-1 rounded hover:bg-green-500 hover:text-white">
                <FiPlusCircle />
            </button>
        </div>
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="border-gray-300 rounded">
            <div className="flex items-center">
              <button onClick={() => toggleCategory(categoryIndex)} className="mr-2 text-gray-600 hover:text-gray-800">
                {expandedCategories[categoryIndex] ? (<LiaAngleDownSolid />) : (<LiaAngleRightSolid />) }
              </button>
              {editCategoryIndex === categoryIndex ? (
                <>
                <input
                  type="text"
                  value={editedCategoryName}
                  onChange={(e) => handleCategoryNameChange(categoryIndex, e.target.value)}
                  className="mr-2 border-b border-gray-400 outline-none px-2 py-1 flex-grow"
                  autoFocus
                />
                <button onClick={() => handleSaveEditCategory(category.id)} className="mr-2 border-green-500 text-green-500 px-2 py-1 rounded hover:bg-green-500 hover:text-white">
                    <FaRegCircleCheck />
                  </button>
                  <button onClick={handleCancelEditCategory} className="border-red-500 text-red-500 px-2 py-1 rounded hover:bg-red-500 hover:text-white">
                    <ImCancelCircle />
                  </button>
                  </>
              ) : (
                <>
                  <span onClick={() => handleEditCategory(categoryIndex)} className="mr-2 cursor-pointer font-bold">{category.name}</span>
                  <button onClick={() => handleRemoveCategory(category.id)} className="border-red-500 text-red-500 px-2 py-1 rounded hover:bg-red-500 hover:text-white">
                    <IoRemoveCircleOutline />
                  </button>
                </>
              )}
            </div>
            {expandedCategories[categoryIndex] && (
            <div className="mt-2 ml-8">
              <div className="space-y-2">
                <div className="flex space-x-2 items-center">
                    <input
                        type="text"
                        value={category.newBookmarkName}
                        onChange={(e) => handleNewBookmarkNameChange(categoryIndex, e.target.value)}
                        placeholder="Bookmark Name"
                        className="border-b border-gray-400 outline-none px-2 py-1 flex-grow"
                    />
                    <input
                        type="text"
                        value={category.newBookmarkLink}
                        onChange={(e) => handleNewBookmarkLinkChange(categoryIndex, e.target.value)}
                        placeholder="Bookmark Link"
                        className="border-b border-gray-400 outline-none px-2 py-1 flex-grow"
                    />
                    <div>
                        <input
                            type="checkbox"
                            id={`isSelected-${category.id}`} // Unique id for each checkbox
                            checked={category.newBookmarkSelected}
                            onChange={(e) => handleNewBookmarkSelectedChange(categoryIndex, e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor={`isSelected-${category.id}`} className="mr-2">Is Selected?</label>
                    </div>
                    <button onClick={() => handleAddBookmark(categoryIndex)} className="border-green-500 text-green-500 px-2 py-1 rounded hover:bg-green-500 hover:text-white">
                    <FiPlusCircle />
                    </button>
                </div>
                {category.bookmarks.map((bookmark, bookmarkIndex) => (
                  <div key={bookmarkIndex} className="flex items-center">
                    {category.editBookmarkIndex === bookmarkIndex ? (
                    <>
                        <input
                        type="text"
                        value={category.editedBookmarkName}
                        onChange={(e) => handleBookmarkNameChange(categoryIndex, bookmarkIndex, e.target.value)}
                        className="mr-2 border-b border-gray-400 outline-none px-2 py-1 flex-grow"
                        autoFocus
                        />
                        <input
                        type="text"
                        value={category.editedBookmarkLink}
                        onChange={(e) => handleBookmarkLinkChange(categoryIndex, bookmarkIndex, e.target.value)}
                        className="mr-2 border-b border-gray-400 outline-none px-2 py-1 flex-grow"
                        />
                        <div>
                            <input
                                type="checkbox"
                                id={`isSelected-${bookmark.id}`} // Unique id for each checkbox
                                checked={category.editedBookmarkSelected}
                                onChange={(e) => handleBookmarkSelectChange(categoryIndex, bookmarkIndex, e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor={`isSelected-${bookmark.id}`} className="mr-2">Is Selected?</label>
                        </div>
                        <button onClick={() => handleSaveEditBookmark(categoryIndex, bookmarkIndex)} className="border-green-500 text-green-500 px-2 py-1 rounded hover:bg-green-500 hover:text-white">
                            <FaRegCircleCheck />
                        </button>
                        <button onClick={() => handleCancelEditBookmark(categoryIndex)} className="border-red-500 text-red-500 px-2 py-1 rounded hover:bg-red-500 hover:text-white">
                            <ImCancelCircle />
                        </button>
                    </>
                    ) : (
                    <>
                        <span onClick={() => handleEditBookmark(categoryIndex, bookmarkIndex)} className="mr-2 cursor-pointer">{bookmark.name}</span>
                        <span onClick={() => handleEditBookmark(categoryIndex, bookmarkIndex)} className="mr-2 cursor-pointer">{bookmark.link}</span>
                        <span onClick={() => handleEditBookmark(categoryIndex, bookmarkIndex)} className="mr-2 cursor-pointer">{bookmark.isSelected ? <FaRegCircleCheck /> : ''}</span>
                        <button onClick={() => handleRemoveBookmark(bookmark.id)} className="border-red-500 text-red-500 px-2 py-1 rounded hover:bg-red-500 hover:text-white">
                            <IoRemoveCircleOutline />
                        </button>
                    </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 

export default CategoriesPage