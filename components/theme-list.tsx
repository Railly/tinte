import { getCurrentUserId } from '@/lib/auth-utils';
import { getPublicThemes, getThemesByUser } from '@/lib/db/queries';
import { ThemeListClient } from './theme-list-client';

export async function ThemeList() {
  const userId = await getCurrentUserId();
  const themes = userId ? await getThemesByUser() : await getPublicThemes();

  return (
    <div className="space-y-6">
      <ThemeListClient
        initialThemes={themes}
        isAuthenticated={!!userId}
        userId={userId}
      />
    </div>
  );
}