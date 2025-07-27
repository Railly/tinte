import { useState, useEffect } from 'react';

type UrlMetadata = {
  title: string;
  description: string;
  favicon: string;
  domain: string;
  loading: boolean;
  error?: string;
};

export function useUrlMetadata(url: string): UrlMetadata {
  const [metadata, setMetadata] = useState<UrlMetadata>({
    title: '',
    description: '',
    favicon: '',
    domain: '',
    loading: true
  });

  useEffect(() => {
    if (!url) return;

    let cancelled = false;

    const fetchMetadata = async () => {
      try {
        // Basic URL parsing for immediate display
        const urlObj = new URL(url);
        const domain = urlObj.hostname.replace('www.', '');
        
        if (cancelled) return;

        // Set initial state with domain
        setMetadata(prev => ({
          ...prev,
          domain,
          title: domain,
          loading: true
        }));

        // Fetch enhanced metadata
        const response = await fetch('/api/fetch-meta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        });

        if (cancelled) return;

        if (response.ok) {
          const meta = await response.json();
          setMetadata({
            title: meta.title || domain,
            description: meta.description || '',
            favicon: meta.favicon || `${urlObj.origin}/favicon.ico`,
            domain: meta.domain || domain,
            loading: false
          });
        } else {
          throw new Error('Failed to fetch metadata');
        }
      } catch (error) {
        if (cancelled) return;
        
        console.error('Metadata fetch error:', error);
        
        // Fallback to basic URL info
        try {
          const urlObj = new URL(url);
          const domain = urlObj.hostname.replace('www.', '');
          setMetadata({
            title: domain,
            description: '',
            favicon: `${urlObj.origin}/favicon.ico`,
            domain,
            loading: false,
            error: 'Failed to load metadata'
          });
        } catch {
          setMetadata({
            title: 'Invalid URL',
            description: '',
            favicon: '',
            domain: '',
            loading: false,
            error: 'Invalid URL'
          });
        }
      }
    };

    fetchMetadata();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return metadata;
}