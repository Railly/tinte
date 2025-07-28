'use client';

import { Menu, X } from 'lucide-react';
import GithubIcon from '@/components/shared/icons/github';
import TwitterIcon from '@/components/shared/icons/twitter';
import { useState } from 'react';
import Logo from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { SimpleThemeSwitcher } from '@/components/simple-theme-switcher';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <div className="flex flex-col">
              <span className="font-bold text-base">Tinte</span>
              <span className="text-xs text-muted-foreground -mt-0.5">Theme Editor</span>
            </div>
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
            <SimpleThemeSwitcher />
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

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden h-8 w-8 p-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/40 py-4">
            <nav className="flex flex-col gap-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex items-center gap-3 pt-2 border-t border-border/40">
                <SimpleThemeSwitcher />
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <GithubIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <TwitterIcon className="h-4 w-4" />
                </Button>
                <Button size="sm" className="h-8 px-3 text-xs flex-1">
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}