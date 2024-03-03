import prisma from '@/prisma/client'
import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
  const { userId } = auth();
  const searchParams = request.nextUrl.searchParams;
  const isAdminAdded = searchParams.get('isAdminAdded');
  console.log('isAdminAdded', isAdminAdded, request.nextUrl);
  console.log('userId', userId);

  const categories = await prisma.user.findUnique({
    where: {
      clerkId: userId as string
    },
    select: {
      unselectedBookmarks: true,
      selectedBookmarks: true,
      hiddenCategories: true
    }
  });
  console.log('auth 2', categories);
  return NextResponse.json(categories);
}

export async function PUT(request: NextRequest) {
    const { userId } = auth();
    const { selectedBookmarks, unselectedBookmarks, hiddenCategories }  = await new Response(request.body).json();
    try {
      const updatedCategory = await prisma.user.update({
        where: {
          clerkId: userId as string,
        },
        data: {
          unselectedBookmarks,
          selectedBookmarks,
          hiddenCategories
        },
      });
      return Response.json({ data: updatedCategory });
    } catch (e) {
      console.error('PUT error:', e);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }