import { getCurrentUserId } from '@/lib/auth-utils';
import { ThemeList } from '@/components/theme-list';
import { CreateThemeButton } from '@/components/create-theme-button';
import { ThemeForm } from '@/components/theme-form';
import { getPublicThemes, getThemesByUser } from '@/lib/db/queries';
import { themeFormCache, themeSearchCache } from '@/lib/search-params';
import { type SearchParams } from 'nuqs/server';
import { type Theme } from '@/lib/db/schema';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Home({ searchParams }: PageProps) {
  const userId = await getCurrentUserId();
  const isAuthenticated = !!userId;
  
  // Parse all search params server-side
  const { create, edit } = await themeFormCache.parse(searchParams);
  const { q: searchQuery, publicOnly } = await themeSearchCache.parse(searchParams);
  
  // Get and filter themes server-side
  const allThemes = userId ? await getThemesByUser() : await getPublicThemes();
  
  const filteredThemes = allThemes.filter((theme: Theme) => {
    // Filter by visibility
    if (!isAuthenticated) return theme.public;
    if (publicOnly) return theme.public;
    return theme.public || theme.userId === userId;
  }).filter((theme: Theme) => {
    // Filter by search query (server-side search)
    if (!searchQuery?.trim()) return true;
    const query = searchQuery.toLowerCase();
    return theme.name.toLowerCase().includes(query) ||
      theme.description?.toLowerCase().includes(query);
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tinte</h1>
          <p className="text-muted-foreground">
            Discover and share themes for VS Code, Zed, JetBrains, Vim and more
          </p>
        </div>
        <CreateThemeButton isAuthenticated={isAuthenticated} />
      </div>
      <ThemeList filteredThemes={filteredThemes} userId={userId} />
      <ThemeForm create={create} edit={edit} />
    </main>
  );
}
