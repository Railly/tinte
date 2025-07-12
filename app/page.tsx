import { getCurrentUserId } from '@/lib/auth-utils';
import { ThemeList } from '@/components/theme-list';
import { CreateThemeButton } from '@/components/create-theme-button';
import { ThemeCreateDialog } from '@/components/dialogs/theme-create-dialog';
import { ThemeEditDialog } from '@/components/dialogs/theme-edit-dialog';
import { ThemeDeleteDialog } from '@/components/dialogs/theme-delete-dialog';
import { getPublicThemes, getThemesByUser } from '@/lib/db/queries';
import { themeSearchCache } from '@/lib/search-params';
import { type SearchParams } from 'nuqs/server';
import { type Theme } from '@/lib/db/schema';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Home({ searchParams }: PageProps) {
  const userId = await getCurrentUserId();
  const isAuthenticated = !!userId;

  // Parse all search params server-side
  const { q: searchQuery, publicOnly } = await themeSearchCache.parse(searchParams);

  // Get themes for server-side search fallback and form
  const allThemes = userId ? await getThemesByUser() : await getPublicThemes();

  // Server-side filtered themes (fallback when Upstash search is disabled)
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
      <ThemeCreateDialog />
      <ThemeEditDialog themes={allThemes} />
      <ThemeDeleteDialog themes={allThemes} />
    </main>
  );
}
