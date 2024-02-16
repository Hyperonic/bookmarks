import prisma from '@/prisma/client'
import { auth } from '@clerk/nextjs'

export const getUserFromClerkID = async (select = { id: true }) => {
  const { userId } = auth()
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      userId,
    },
    select,
  })

  return user
}