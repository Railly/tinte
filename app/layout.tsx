import type { Metadata } from 'next';
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';
import './globals.css';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Tinte - Theme Designer',
  description: 'Design themes for VS Code, shadcn/ui, and more',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <NuqsAdapter>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                  <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                  </div>
                  <div className="flex-1" />
                  <div className="flex items-center gap-4 px-4">
                    <SignedOut>
                      <SignInButton />
                      <SignUpButton>
                        <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                          Sign Up
                        </button>
                      </SignUpButton>
                    </SignedOut>
                  </div>
                </header>
                {children}
              </SidebarInset>
            </SidebarProvider>
          </NuqsAdapter>
        </body>
      </html>
    </ClerkProvider>
  );
}
