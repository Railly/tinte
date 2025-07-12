import { getCurrentUserId } from '@/lib/auth-utils';
import { ThemeList } from '@/components/theme-list';
import { CreateThemeButton } from '@/components/create-theme-button';
import { ThemeForm } from '@/components/theme-form';

export default async function Home() {
  const userId = await getCurrentUserId();
  const isAuthenticated = !!userId;

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
      
      <ThemeList />
      <ThemeForm />
    </main>
  );
}
