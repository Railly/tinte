'use client';

import { Menu } from 'lucide-react';
import GithubIcon from '@/components/shared/icons/github';
import TwitterIcon from '@/components/shared/icons/twitter';
import Logo from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/shared/theme-switcher';
import { siteConfig } from '@/config/site';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import Link from 'next/link';

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
        <div className="relative flex h-[var(--header-height)] items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Logo size={24} />
            <span className="font-bold text-base">Tinte</span>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
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
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
                <GithubIcon className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <a href={siteConfig.links.twitter} target="_blank" rel="noopener noreferrer">
                <TwitterIcon className="h-4 w-4" />
              </a>
            </Button>
            <Button size="sm" className="h-7 px-3 text-xs" asChild>
              <Link href="/chat">
                Get Started
              </Link>
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
            <SheetContent side="right" className="w-80 sm:w-96 p-8">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full">
                <nav className="flex flex-col gap-8 pt-4">
                  {navigation.map((item) => (
                    <SheetClose key={item.name} asChild>
                      <a
                        href={item.href}
                        className="text-2xl font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {item.name}
                      </a>
                    </SheetClose>
                  ))}
                </nav>

                <div className="mt-auto flex flex-col gap-6">
                  <div className="flex items-center justify-center gap-6">
                    <ThemeSwitcher />
                    <Button variant="ghost" size="sm" className="h-12 w-12 p-0" asChild>
                      <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
                        <GithubIcon className="h-8 w-8" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-12 w-12 p-0" asChild>
                      <a href={siteConfig.links.twitter} target="_blank" rel="noopener noreferrer">
                        <TwitterIcon className="h-8 w-8" />
                      </a>
                    </Button>
                  </div>
                  <Button size="lg" className="h-12 px-8 text-base w-full font-medium">
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