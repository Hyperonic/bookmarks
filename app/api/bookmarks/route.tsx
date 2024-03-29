import prisma from '@/prisma/client'
import { auth } from '@clerk/nextjs';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// const GET = async(req: any, res: any) => {
//     if (req.method === 'GET') {
//       try {
//         const bookmarks = await prisma.bookmark.findMany();
//         const categoryIds = [...new Set(bookmarks.map(bookmark => bookmark.categoryId))];
//         const categoriesData = await prisma.category.findMany({
//           where: {
//             id: {
//               in: categoryIds,
//             },
//             name: {
//               contains: req.query.searchTerm || '', // Filter by search term
//             },
//           },
//         });
//         res.status(200).json(categoriesData);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//       }
//     } else {
//       res.status(405).json({ error: 'Method Not Allowed' });
//     }
// }

// const POST = async(request: Request) => {
//     const data = await request.json()
//     const bookmark = await prisma.bookmark.create({
//         data: {
//             categoryId: data.categoryId,
//             name: data.name,
//             link: data.link,
//             userId: data.userId,
//         },
//     });
//     return NextResponse.json({ data: bookmark })
// }

// export { GET, POST }

export async function POST(request: NextRequest) {
  console.log('request', request.body);
  const { userId } = auth();
  const data = await new Response(request.body).json()
  console.log('bookmark post data', data);
  try {
  const bookmark = await prisma.bookmark.create({
      data: {
          userId: userId as string,
          categoryId: data.categoryId,
          name: data.name,
          link: data.link,
          isAdminAdded: data.isAdminAdded,
          isSelected: data.isSelected,
      },
  });
  console.log('post resp', bookmark);
  return Response.json({ data: bookmark })
} catch (e){
  console.log('post err', e);
}
}

export async function GET(request: NextRequest) {
  const { userId } = auth();
  const searchParams = request.nextUrl.searchParams;
  const isAdminAdded = searchParams.get('isAdminAdded');
  const categoryId = searchParams.get('categoryId');
  let where: Prisma.BookmarkWhereInput  = {};
  if (isAdminAdded) {
    where = {
      isAdminAdded: true,
    };
  } else {
    where = {
      OR: [
        { userId: userId as string }, // Filter by userId
        { isAdminAdded: true },   // Filter by isAdminAdded: true
      ]
    };
  }
  if (categoryId) {
    where = {
      ...where,
      categoryId,
    };
  }
  const bookmarks = await prisma.bookmark.findMany({
    where,
    orderBy: {
      createdAt: 'desc'
    },
    // include: {
    //   category: true, // Include all fields from the category model
    // },
});
  // const categoryIds = [...new Set(bookmarks.map(bookmark => bookmark.categoryId))];
  // const categoriesData = await prisma.category.findMany({
  //   where: {
  //     id: {
  //       in: categoryIds,
  //     },
  //     name: {
  //       contains: request.nextUrl.searchParams.get('searchTerm') || '', // Filter by search term
  //     },
  //   },
  // });
  return Response.json(bookmarks);
}
