import { getCurrentUserId } from '@/lib/auth-utils';
import { ThemeCreator } from '@/components/theme-creator';
import { ThemeList } from '@/components/theme-list';
import { getThemesByUser } from '@/lib/db/queries';

export default async function CodePage() {
  const userId = await getCurrentUserId();
  const allThemes = await getThemesByUser();

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <ThemeCreator />
        
        {/* Existing Themes Section */}
        {allThemes.length > 0 && (
          <div className="mt-16 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Your Projects</h2>
              <p className="text-muted-foreground">Manage and share your existing projects</p>
            </div>
            <ThemeList themes={allThemes} userId={userId} />
          </div>
        )}
      </div>
    </main>
  );
}