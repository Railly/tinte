import { getCurrentUserId } from '@/lib/auth-utils';
import { getPublicThemes, getUserThemes } from '@/lib/db/queries';
import { ThemeCard } from './theme-card';
import { ThemeListClient } from './theme-list-client';

export async function ThemeList() {
  const userId = await getCurrentUserId();
  
  // Get data on the server using direct database queries
  const [publicThemes, userThemes] = await Promise.all([
    getPublicThemes(),
    userId ? getUserThemes(userId) : [],
  ]);

  return (
    <div className="space-y-6">
      {/* Server-rendered theme cards with client-side state management */}
      <ThemeListClient 
        initialPublicThemes={publicThemes}
        initialUserThemes={userThemes}
        isAuthenticated={!!userId}
      />
    </div>
  );
}