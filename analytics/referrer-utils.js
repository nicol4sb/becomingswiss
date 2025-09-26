// Referrer analysis utilities
const url = require('url');

// Known search engines and their query parameters
const SEARCH_ENGINES = {
  'google.com': { name: 'Google', queryParam: 'q' },
  'google.co.uk': { name: 'Google UK', queryParam: 'q' },
  'google.de': { name: 'Google DE', queryParam: 'q' },
  'bing.com': { name: 'Bing', queryParam: 'q' },
  'yahoo.com': { name: 'Yahoo', queryParam: 'p' },
  'duckduckgo.com': { name: 'DuckDuckGo', queryParam: 'q' },
  'baidu.com': { name: 'Baidu', queryParam: 'wd' },
  'yandex.com': { name: 'Yandex', queryParam: 'text' }
};

// Known social media platforms
const SOCIAL_PLATFORMS = {
  'facebook.com': 'Facebook',
  'twitter.com': 'Twitter',
  'x.com': 'X (Twitter)',
  'linkedin.com': 'LinkedIn',
  'instagram.com': 'Instagram',
  'youtube.com': 'YouTube',
  'tiktok.com': 'TikTok',
  'reddit.com': 'Reddit',
  'pinterest.com': 'Pinterest',
  'snapchat.com': 'Snapchat'
};

// Known news and content platforms
const CONTENT_PLATFORMS = {
  'medium.com': 'Medium',
  'substack.com': 'Substack',
  'dev.to': 'Dev.to',
  'hackernews.ycombinator.com': 'Hacker News',
  'github.com': 'GitHub',
  'stackoverflow.com': 'Stack Overflow'
};

function parseReferrer(referrer) {
  if (!referrer || referrer === 'Direct' || referrer === '-') {
    return {
      type: 'direct',
      category: 'Direct',
      domain: 'Direct',
      searchQuery: null,
      platform: 'Direct'
    };
  }

  try {
    const parsedUrl = new url.URL(referrer);
    const domain = parsedUrl.hostname.toLowerCase();
    const pathname = parsedUrl.pathname;
    const searchParams = parsedUrl.searchParams;

    // Check for search engines
    for (const [searchDomain, engine] of Object.entries(SEARCH_ENGINES)) {
      if (domain === searchDomain || domain.endsWith('.' + searchDomain)) {
        const query = searchParams.get(engine.queryParam) || searchParams.get('q');
        return {
          type: 'search',
          category: 'Search Engine',
          domain: engine.name,
          searchQuery: query,
          platform: engine.name,
          originalDomain: domain
        };
      }
    }

    // Check for social media
    for (const [socialDomain, platform] of Object.entries(SOCIAL_PLATFORMS)) {
      if (domain === socialDomain || domain.endsWith('.' + socialDomain)) {
        return {
          type: 'social',
          category: 'Social Media',
          domain: platform,
          searchQuery: null,
          platform: platform,
          originalDomain: domain
        };
      }
    }

    // Check for content platforms
    for (const [contentDomain, platform] of Object.entries(CONTENT_PLATFORMS)) {
      if (domain === contentDomain || domain.endsWith('.' + contentDomain)) {
        return {
          type: 'content',
          category: 'Content Platform',
          domain: platform,
          searchQuery: null,
          platform: platform,
          originalDomain: domain
        };
      }
    }

    // Check for email clients
    if (domain.includes('mail.') || domain.includes('outlook.') || domain.includes('gmail.') || 
        domain.includes('yahoo.') || domain.includes('hotmail.')) {
      return {
        type: 'email',
        category: 'Email',
        domain: 'Email Client',
        searchQuery: null,
        platform: 'Email',
        originalDomain: domain
      };
    }

    // Generic external referrer
    return {
      type: 'external',
      category: 'External Website',
      domain: domain,
      searchQuery: null,
      platform: domain,
      originalDomain: domain
    };

  } catch (error) {
    // If URL parsing fails, treat as direct
    return {
      type: 'direct',
      category: 'Direct',
      domain: 'Direct',
      searchQuery: null,
      platform: 'Direct'
    };
  }
}

function categorizeReferrers(referrerStats) {
  const categories = {
    direct: { count: 0, percentage: 0, referrers: [] },
    search: { count: 0, percentage: 0, referrers: [], queries: [] },
    social: { count: 0, percentage: 0, referrers: [] },
    content: { count: 0, percentage: 0, referrers: [] },
    email: { count: 0, percentage: 0, referrers: [] },
    external: { count: 0, percentage: 0, referrers: [] }
  };

  const totalRequests = Object.values(referrerStats).reduce((sum, count) => sum + count, 0);

  for (const [referrer, count] of Object.entries(referrerStats)) {
    const parsed = parseReferrer(referrer);
    const percentage = ((count / totalRequests) * 100).toFixed(1) + '%';

    categories[parsed.type].count += count;
    categories[parsed.type].referrers.push({
      referrer,
      domain: parsed.domain,
      platform: parsed.platform,
      count,
      percentage
    });

    if (parsed.searchQuery) {
      categories.search.queries.push({
        query: parsed.searchQuery,
        engine: parsed.platform,
        count,
        percentage
      });
    }
  }

  // Calculate percentages for categories
  for (const category of Object.values(categories)) {
    category.percentage = ((category.count / totalRequests) * 100).toFixed(1) + '%';
    // Sort referrers by count
    category.referrers.sort((a, b) => b.count - a.count);
  }

  // Sort search queries by count
  categories.search.queries.sort((a, b) => b.count - a.count);

  return categories;
}

module.exports = {
  parseReferrer,
  categorizeReferrers,
  SEARCH_ENGINES,
  SOCIAL_PLATFORMS,
  CONTENT_PLATFORMS
};
