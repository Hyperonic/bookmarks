import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    
    const categories: any = [
      /* { name: 'Social', type: CategoryType.Social },
      { name: 'Entertainment', type: CategoryType.Entertainment },
      { name: 'Technology', type: CategoryType.Technology },
      { name: 'Finance', type: CategoryType.Finance }, */
    ];

      for (const category of categories) {
        const createdCategory = await prisma.category.create({
          data: category,
        });
        console.log('createdCategory', createdCategory);
        const user = await prisma.user.upsert({
            where: { email: 'aziz.zee@gmail.com' },
            update: {},
            create: {
            email: 'aziz.zee@gmail.com',
            firstName: 'Zeeshan',
            lastName: 'Aziz',
            bookmark: {
                create: [{
                    name: 'Facebook',
                    link: 'https://www.prisma.io/nextjs',
                    categoryId: createdCategory.id,
                }],
                },
            },
            include: {
                bookmark: true,
            },
        })
        console.log({ user, })
    }
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })