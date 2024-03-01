import prisma from '@/prisma/client'
import { auth } from '@clerk/nextjs';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// export default async function handler(req: any, res: any) {
//     if (req.method === 'GET') {
//       try {
//         const categories = await prisma.category.findMany();
//         console.log('categ', categories);
//         res.status(200).json(categories);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//       }
//     } else {
//       res.status(405).json({ error: 'Method Not Allowed' });
//     }
// }

export async function GET(request: NextRequest) {
  const { userId } = auth();
  const searchParams = request.nextUrl.searchParams;
  const isAdminAdded = searchParams.get('isAdminAdded');
  console.log('isAdminAdded', isAdminAdded, request.nextUrl);

  let where: Prisma.CategoryWhereInput | Prisma.BookmarkWhereInput  = {};
  if (isAdminAdded) {
    where = {
      isAdminAdded: true
    };
  } else {
    where = {
      OR: [
        { createdById: userId as string }, // Filter by userId
        { isAdminAdded: true },   // Filter by isAdminAdded: true
      ]
    };
  }
  const categories = await prisma.category.findMany({
    where: where as Prisma.CategoryWhereInput,
    orderBy: {
      createdAt: 'desc'
    },
    // include: {
    //   bookmarks: {
    //     where: where as Prisma.BookmarkWhereInput
    //   }, // Include all fields from the bookmarks model
    // },
  });
  console.log('auth 2', categories);
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const { userId } = auth();
  const data = await new Response(request.body).json();
  try {
    const newCategory = await prisma.category.create({
      data: {
        createdById: userId as string,
        name: data.name,
        isAdminAdded: data.isAdminAdded,
      },
    });
    return Response.json({ data: newCategory });
  } catch (e) {
    console.error('POST error:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
