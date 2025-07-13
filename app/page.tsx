import { getCurrentUserId } from '@/lib/auth-utils';
import { ThemeList } from '@/components/theme-list';
import { CreateThemeButton } from '@/components/create-theme-button';
import { ThemeCreateDialog } from '@/components/dialogs/theme-create-dialog';
import { ThemeEditDialog } from '@/components/dialogs/theme-edit-dialog';
import { ThemeDeleteDialog } from '@/components/dialogs/theme-delete-dialog';
import { getThemesByUser } from '@/lib/db/queries';

export default async function CodePage() {
  const userId = await getCurrentUserId();
  const allThemes = await getThemesByUser();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tinte</h1>
          <p className="text-muted-foreground">
            Discover and share themes for VS Code, Zed, JetBrains, Vim and more
          </p>
        </div>
        <CreateThemeButton userId={userId} />
      </div>
      <ThemeList themes={allThemes} userId={userId} />
      <ThemeCreateDialog />
      <ThemeEditDialog themes={allThemes} />
      <ThemeDeleteDialog themes={allThemes} />
    </main>
  );
}