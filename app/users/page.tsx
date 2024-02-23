import { prisma } from "@/lib/ConnectPrisma";
import Link from "next/link";
import { Heading1 } from "../components/static/Heading";

const page = async () => {
  const users = await prisma.user.findMany({
    select: { name: true },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <div className="mt-20 w-[80%]">
        <Heading1 text="users" />
        <div className="mb-10 grid gap-2 rounded-md bg-black/20 p-8 shadow-lg ring-primary dark:shadow-none dark:ring-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {users ? (
            users
              .sort((a, b) =>
                a.name
                  .toLocaleLowerCase()
                  .localeCompare(b.name.toLocaleLowerCase()),
              )
              .map((u, i) => (
                <Link key={i} href={`/users/${u.name}`}>
                  <div
                    className={`flex items-center justify-center rounded-md p-4 hover:bg-link`}
                  >
                    {u.name}
                  </div>
                </Link>
              ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default page;
