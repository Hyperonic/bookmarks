import { useQuery, useMutation, useQueryClient, QueryClient, QueryFunctionContext } from '@tanstack/react-query';

export interface Bookmark {
    id: string;
    name: string;
    link: string;
    isAdminAdded: boolean;
    isSelected: boolean;
}

export interface Category {
    id: string
    name: string;
    bookmarks: Bookmark[];
    newBookmarkName: string;
    newBookmarkLink: string;
    newBookmarkSelected: boolean;
    editBookmarkIndex: number | null;
    editedBookmarkName: string;
    editedBookmarkLink: string;
    editedBookmarkSelected: boolean;
    isAdminAdded: boolean;
}

export function useCategories(/* select: any,  */isAdminAdded = false) {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
        let url = '/api/categories';

        if (isAdminAdded) {
          url += '?isAdminAdded=true';
        }
        const res = await fetch(url);
        const data = res.json();
        console.log('data', data);
        return data;
    },
    initialData: [], 
    //select,
  });
}

export function useAddCategory() {
    const queryClient = useQueryClient();
  return useMutation<any, Error, { name: string, isAdminAdded: boolean }>({
    mutationFn: async (body) => {
        console.log('mutationFn', queryClient.getQueryData(['categories']));
        const res = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        return res.json();
    },
    onMutate: async (newCategory) => {
        console.log('onMutate 1', queryClient.getQueryData(['categories']));
            // Cancel any outgoing refetches
            // (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['categories'] })
            console.log('onMutate 2', queryClient.getQueryData(['categories']));
        
            // Snapshot the previous value
            const previousCategories = queryClient.getQueryData(['categories']) as any[];

            // Ensure that `previousCategories` is an array or provide a default value if it's undefined
            const updatedCategories = [newCategory, ...previousCategories]//Array.isArray(previousTodos) ? [...previousTodos, newCategory] : [newTodo];
        
            // Optimistically update to the new value
            queryClient.setQueryData(['categories'], updatedCategories)
        
            // Return a context object with the snapshotted value
            return { previousCategories }
        },
    onError: (error: any) => {
        console.log(error);
    },
    onSettled: () => {
    },
    onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['categories']});
    },
 });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();
    return useMutation<any, Error, { id: string; name: string }>({
        mutationFn: async ({ id, name }) => {
        const res = await fetch(`/api/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        return res.json();
        },
        onMutate: async (newCategory) => {
            // Cancel any outgoing refetches
            // (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['categories', newCategory.id] })
        
            // Snapshot the previous value
            const previousCategory = queryClient.getQueryData(['categories', newCategory.id])
        
            // Optimistically update to the new value
            queryClient.setQueryData(['categories', newCategory.id], newCategory)
        
            // Return a context with the previous and new todo
            return { previousCategory, newCategory }
          },
            // If the mutation fails, use the context we returned above
        onError: (err, newCategory, context: any) => {
            queryClient.setQueryData(
            ['categories', context.newCategory.id],
            context.previousCategory,
            )
        },
        // Always refetch after error or success:
        onSettled: (newTodo) => {
            queryClient.invalidateQueries({ queryKey: ['categories', newTodo.id] })
        },
    });
  }
  
export function useDeleteCategory() {
    const queryClient = useQueryClient();
    return useMutation<void, Error, string>({
        mutationFn: async (id) => {
            await fetch(`/api/categories/${id}`, {
            method: 'DELETE',
            });
        },
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['categories']});
      },
    });
  }