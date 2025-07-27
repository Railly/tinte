import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Validate URL format
    let validUrl: URL;
    try {
      validUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Fetch the webpage
    const response = await fetch(validUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MetaFetcher/1.0)',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract title
    const title = $('title').first().text().trim() || 
                 $('meta[property="og:title"]').attr('content') || 
                 $('meta[name="title"]').attr('content') || 
                 validUrl.hostname.replace('www.', '');

    // Extract description
    const description = $('meta[name="description"]').attr('content') ||
                       $('meta[property="og:description"]').attr('content') ||
                       $('meta[name="twitter:description"]').attr('content') ||
                       '';

    // Extract favicon
    let favicon = '';
    const faviconSelectors = [
      'link[rel="icon"]',
      'link[rel="shortcut icon"]', 
      'link[rel="apple-touch-icon"]',
      'link[rel="apple-touch-icon-precomposed"]'
    ];

    for (const selector of faviconSelectors) {
      const href = $(selector).attr('href');
      if (href) {
        favicon = href.startsWith('http') ? href : new URL(href, validUrl.origin).toString();
        break;
      }
    }

    // Fallback to default favicon path
    if (!favicon) {
      favicon = `${validUrl.origin}/favicon.ico`;
    }

    return NextResponse.json({
      title: title.slice(0, 100), // Limit length
      description: description.slice(0, 200), // Limit length
      favicon,
      url: validUrl.toString(),
      domain: validUrl.hostname.replace('www.', '')
    });

  } catch (error) {
    console.error('Meta fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metadata' }, 
      { status: 500 }
    );
  }
}