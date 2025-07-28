'use client';

import { Menu } from 'lucide-react';
import GithubIcon from '@/components/shared/icons/github';
import TwitterIcon from '@/components/shared/icons/twitter';
import Logo from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/shared/theme-switcher';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetClose 
} from '@/components/ui/sheet';

export function Header() {
  const navigation = [
    { name: 'Features', href: '#features' },
    { name: 'Roadmap', href: '#roadmap' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Docs', href: '#docs' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4">
        <div className="flex h-12 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Logo size={24} />
            <span className="font-bold text-base">Tinte</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA + Social */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeSwitcher />
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <GithubIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <TwitterIcon className="h-4 w-4" />
            </Button>
            <Button size="sm" className="h-7 px-3 text-xs">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden h-8 w-8 p-0"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-6">
                <nav className="flex flex-col gap-4">
                  {navigation.map((item) => (
                    <SheetClose key={item.name} asChild>
                      <a
                        href={item.href}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.name}
                      </a>
                    </SheetClose>
                  ))}
                </nav>
                <div className="flex flex-col gap-4 pt-4 border-t border-border/40">
                  <div className="flex items-center gap-3">
                    <ThemeSwitcher />
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <GithubIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <TwitterIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button size="sm" className="h-9 px-4 text-sm w-full">
                    Get Started
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}