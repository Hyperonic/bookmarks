import prisma from '@/prisma/client'
import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';


export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const data = await new Response(request.body).json();
    try {
      const updatedCategory = await prisma.category.update({
        where: {
          id,
        },
        data: {
          name: data.name,
        },
      });
      return Response.json({ data: updatedCategory });
    } catch (e) {
      console.error('PUT error:', e);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  
  export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    // const searchParams = request.nextUrl.searchParams;
    // const id = searchParams.get('id');
    const { id } = params;
    try {
      await prisma.category.delete({
        where: {
          id,
        },
      });
      return new Response(null, { status: 204 });
    } catch (e) {
      console.error('DELETE error:', e);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }