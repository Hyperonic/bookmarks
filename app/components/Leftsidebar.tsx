import Link from "next/link";
import prisma from "@/prisma/client";

const LeftSidebar = async () => {
    const recentAdded = await prisma.bookmark.findMany();
    console.log('recentAdded', recentAdded);
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex flex-col justify-between overflow-y-auto border-r p-6 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto">
        <h2 className="font-bold">Recently Added</h2>
        {recentAdded.map(item => {

          return (
              <p
                key={item.name}
                className=""
              >
                {item.name}
              </p>
          );
        })}
      </div>

      <Link href="/add">
            <button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-1 shadow-none bg-sky-500">
              <span className="primary-text-gradient text-white text-[24px]">
                +
              </span>
            </button>
        </Link>
    </section>
  );
};

export default LeftSidebar;
