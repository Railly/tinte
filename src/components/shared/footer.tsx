'use client';

import GithubIcon from '@/components/shared/icons/github';
import TwitterIcon from '@/components/shared/icons/twitter';
import DiscordIcon from '@/components/shared/icons/discord';
import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="px-4 py-6">
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <a href={siteConfig.links.discord} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
            Discord <DiscordIcon className="w-3 h-3" />
          </a>
          <a href={siteConfig.links.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
            Twitter <TwitterIcon className="w-3 h-3" />
          </a>
          <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
            GitHub <GithubIcon className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}