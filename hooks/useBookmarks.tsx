import { useMutation, useQuery, QueryClient, useQueryClient } from '@tanstack/react-query';

export function useBookmarks(isAdminAdded = false, categoryId?: string) {
  return useQuery<any[]>({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      let url = '/api/bookmarks';
      if (isAdminAdded) {
        url += '?isAdminAdded=true';
      }
      if (categoryId) {
        url += `${isAdminAdded ? '&' : '?'}categoryId=${categoryId}`;
      }
      const res = await fetch(url);
      return res.json();
    },
    initialData: [], 
  });
}

export function useAddBookmark() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { categoryId: string; name: string; link: string, isAdminAdded: boolean, isSelected: boolean }>({
    mutationFn: async ({ categoryId, name, link, isAdminAdded, isSelected }) => {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId, name, link, isAdminAdded, isSelected }),
      });
      return res.json();
    },
    onMutate: async (newBookmark) => {
          // Cancel any outgoing refetches
          // (so they don't overwrite our optimistic update)
          await queryClient.cancelQueries({ queryKey: ['bookmarks'] })
      
          // Snapshot the previous value
          const previousBookmark = queryClient.getQueryData(['bookmarks'])
      
          // Optimistically update to the new value
          queryClient.setQueryData(['bookmarks'], (old: any) => [newBookmark, ...old])
      
          // Return a context object with the snapshotted value
          return { previousBookmark }
      },
    onError: (error: any) => {
      console.log(error);
    },
    onSettled: () => {
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['bookmarks']});
    },
  });
}

export function useUpdateBookmark() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { id: string; name: string, link: string, isSelected: boolean }>({
      mutationFn: async ({ id, name, link, isSelected }) => {
      const res = await fetch(`/api/bookmarks/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, link, isSelected }),
      });
      return res.json();
      },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['bookmarks']});
    },
  });
}

export function useDeleteBookmark() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
      mutationFn: async (id) => {
          await fetch(`/api/bookmarks/${id}`, {
          method: 'DELETE',
          });
      },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['bookmarks']});
    },
  });
}
