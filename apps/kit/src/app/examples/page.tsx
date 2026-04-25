import { desc, eq } from "drizzle-orm";

import { RecentKitsGrid } from "@/components/landing/recent-kits-grid";
import { brandKits, db } from "@/db";

interface ExamplesPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function ExamplesPage({
  searchParams,
}: ExamplesPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const pageSize = 24;
  const kits = await db
    .select({ id: brandKits.id })
    .from(brandKits)
    .where(eq(brandKits.is_public, true))
    .orderBy(desc(brandKits.created_at))
    .limit(pageSize + 1)
    .offset((page - 1) * pageSize);
  const hasNextPage = kits.length > pageSize;

  return (
    <main className="min-h-screen px-6 py-6">
      <nav className="mx-auto flex max-w-6xl items-center justify-between border-[#2b2925] border-b pb-5">
        <a className="font-semibold text-lg" href="/">
          kit.tinte.dev
        </a>
        <a className="text-[#a7a096] text-sm hover:text-[#f4f1e8]" href="/">
          Generate
        </a>
      </nav>
      <section className="mx-auto grid max-w-6xl gap-8 py-12">
        <div className="grid gap-3">
          <p className="text-[#d8ff5f] text-sm uppercase tracking-[0.18em]">
            Examples
          </p>
          <h1 className="font-semibold text-4xl">Public brand kits</h1>
        </div>
        <RecentKitsGrid limit={pageSize} offset={(page - 1) * pageSize} />
        <div className="flex items-center gap-3">
          {page > 1 ? (
            <a
              className="h-10 rounded-md border border-[#3a372f] px-4 py-2 text-sm hover:border-[#d8ff5f]"
              href={`/examples?page=${page - 1}`}
            >
              Previous
            </a>
          ) : null}
          {hasNextPage ? (
            <a
              className="h-10 rounded-md border border-[#3a372f] px-4 py-2 text-sm hover:border-[#d8ff5f]"
              href={`/examples?page=${page + 1}`}
            >
              Next
            </a>
          ) : null}
        </div>
      </section>
    </main>
  );
}
