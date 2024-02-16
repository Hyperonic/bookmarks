import prisma from '@/prisma/client'
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
  const categories = await prisma.category.findMany();
  return NextResponse.json(categories);
}