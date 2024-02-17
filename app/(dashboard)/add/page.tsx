"use client"; 
import { Button, TextFieldRoot, TextFieldInput, SelectRoot, SelectGroup, SelectContent, SelectLabel, SelectItem, SelectTrigger } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { bookmarksSchema } from '@/app/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useAuth } from "@clerk/nextjs";

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
            const response = await fetch(`/api/categories`);
            if (response.ok) {
            const data = await response.json();
            setCategories(data);
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
            const response = await fetch('/api/bookmarks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Specify the content type as JSON
                },
                body: JSON.stringify({
                    categoryId: data.categoryId,
                    name: data.name,
                    link: data.link,
                    userId,
                }),
            });
            console.log('resp', response);
        router.push('/list');
        router.refresh();
        } catch (error) {
            console.log(error);
        }
    });
    return (
    <form onSubmit={onSubmit}>
        <Controller
            control={control}
            name="categoryId"
            render={({ field: { onChange, value } }) => (
                <SelectRoot onValueChange={onChange} value={value}>
                    <SelectTrigger placeholder="Category" />
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
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
        <TextFieldInput placeholder="Name…" {...register('name')} />
        <TextFieldInput placeholder="Link…" {...register('link')} />
        <Button className="bg-sky-500" type="submit">Add</Button>
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
