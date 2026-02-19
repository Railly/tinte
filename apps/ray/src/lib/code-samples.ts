export const DEFAULT_CODE = `import { cache } from "react"
import { db } from "@/lib/db"

type User = {
  id: string
  name: string
  email: string
}

const getUser = cache(async (id: string) => {
  return db.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true },
  })
})

export default async function Profile({ id }: { id: string }) {
  const user = await getUser(id)
  if (!user) return <div>Not found</div>

  return (
    <main className="p-8">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </main>
  )
}`;

export const LANGUAGES = [
  "typescript",
  "javascript",
  "python",
  "rust",
  "go",
  "html",
  "css",
  "json",
  "bash",
  "sql",
  "java",
  "cpp",
  "ruby",
  "swift",
  "kotlin",
] as const;

export type Language = (typeof LANGUAGES)[number];
