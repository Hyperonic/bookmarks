"use client"; 
import { Button, TextFieldRoot, TextFieldInput, SelectRoot, SelectGroup, SelectContent, SelectLabel, SelectItem, SelectTrigger } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { bookmarksSchema } from '@/app/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useAuth } from "@clerk/nextjs";
import axios from 'axios';

type BookmarkFormData = z.infer<typeof bookmarksSchema>;

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
    const [categories, setCategories] = useState([]);
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

    const fetchData = async () => {
        try {
            const response = await axios.get(`/api/categories`);
            if (response) {
            //const data = await response.json();
            setCategories(response.data);
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, []);

    const onSubmit = handleSubmit(async (data) => {
        try {
            console.log(data, userId);
            const response = await axios.post('/api/bookmarks', {
                    categoryId: data.categoryId,
                    name: data.name,
                    link: data.link,
                    userId,
            });
            console.log('resp', response);
        router.push('/list');
        router.refresh();
        } catch (error) {
            console.log(error);
        }
    });
    return (
    <form onSubmit={onSubmit} className="flex flex-col align-center">
        <div className="flex items-center mb-4">
            <label className="mr-2 w-[100px]">Category</label>
            <div className="w-full">
            <Controller
                control={control}
                name="categoryId"
                render={({ field: { onChange, value } }) => (
                    <SelectRoot onValueChange={onChange} value={value}>
                        <SelectTrigger placeholder="" />
                        <SelectContent color="gray">
                            <SelectGroup>
                            {/* <SelectLabel>Category</SelectLabel> */}
                            {categories.map((category: any) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                            </SelectGroup>
                        </SelectContent>
                    </SelectRoot>
                )}
            />
            </div>
        </div>
        <div className="flex items-center mb-4">
            <label className="mr-2 w-[100px]">Link</label>
            <input className="h-[32px] w-full border border-greyBorder bg-grey" placeholder="" {...register('link')} />
        </div>
        <div className="flex items-center">
            <label className="mr-2 w-[100px]">Name</label>
            <input className="h-[32px] w-full border border-greyBorder bg-grey" placeholder="" {...register('name')} />
        </div>
        <button className="self-center w-[150px] mt-4 py-2 px-4 drop-shadow-md bg-grey border" type="submit">Done</button>
    </form>
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
