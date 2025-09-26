const fs = require('fs');
const path = require('path');
const winston = require('winston');
const { parseReferrer, categorizeReferrers } = require('./referrer-utils');

// Analytics data storage paths
const ANALYTICS_DIR = __dirname;
const ANALYTICS_FILE = path.join(ANALYTICS_DIR, 'data.json');
const DAILY_ANALYTICS_FILE = path.join(ANALYTICS_DIR, 'daily-data.json');

// Initialize analytics data structure
let analyticsData = {
  totalRequests: 0,
  uniqueIPs: new Set(),
  browsers: {},
  operatingSystems: {},
  referrers: {},
  pages: {},
  hourlyStats: {},
  dailyStats: {},
  lastUpdated: new Date().toISOString()
};

let dailyAnalytics = {};

// Load existing analytics data
function loadAnalyticsData(logger) {
  try {
    if (fs.existsSync(ANALYTICS_FILE)) {
      const fileData = JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf8'));
      // Handle both old format (direct data) and new format (with metadata)
      const data = fileData.data || fileData;
      analyticsData = {
        ...data,
        uniqueIPs: new Set(data.uniqueIPs || [])
      };
      if (logger) logger.info('Analytics data loaded from file');
    }
  } catch (error) {
    if (logger) logger.error('Error loading analytics data:', error);
  }

  try {
    if (fs.existsSync(DAILY_ANALYTICS_FILE)) {
      const rawDailyData = JSON.parse(fs.readFileSync(DAILY_ANALYTICS_FILE, 'utf8'));
      // Reconstruct daily analytics with proper Set objects
      dailyAnalytics = {};
      for (const [date, dayData] of Object.entries(rawDailyData)) {
        dailyAnalytics[date] = {
          ...dayData,
          uniqueIPs: new Set(dayData.uniqueIPs || [])
        };
      }
      if (logger) logger.info('Daily analytics data loaded from file');
    }
  } catch (error) {
    if (logger) logger.error('Error loading daily analytics data:', error);
  }
}

// Save analytics data to file with pretty formatting
function saveAnalyticsData(logger) {
  try {
    const dataToSave = {
      ...analyticsData,
      uniqueIPs: Array.from(analyticsData.uniqueIPs)
    };
    
    // Save with pretty formatting and metadata
    const formattedData = {
      metadata: {
        version: "1.0.0",
        lastUpdated: new Date().toISOString(),
        totalRecords: analyticsData.totalRequests,
        uniqueVisitors: analyticsData.uniqueIPs.size
      },
      data: dataToSave
    };
    
    // Convert daily analytics Sets to arrays for JSON serialization
    const dailyDataToSave = {};
    for (const [date, dayData] of Object.entries(dailyAnalytics)) {
      dailyDataToSave[date] = {
        ...dayData,
        uniqueIPs: Array.from(dayData.uniqueIPs)
      };
    }
    
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(formattedData, null, 2));
    fs.writeFileSync(DAILY_ANALYTICS_FILE, JSON.stringify(dailyDataToSave, null, 2));
  } catch (error) {
    if (logger) logger.error('Error saving analytics data:', error);
  }
}

// Parse user agent to extract browser and OS info
function parseUserAgent(userAgent) {
  const browser = {
    name: 'Unknown',
    version: 'Unknown'
  };
  const os = {
    name: 'Unknown',
    version: 'Unknown'
  };

  if (userAgent.includes('Chrome')) {
    browser.name = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
    if (match) browser.version = match[1];
  } else if (userAgent.includes('Firefox')) {
    browser.name = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
    if (match) browser.version = match[1];
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser.name = 'Safari';
    const match = userAgent.match(/Version\/(\d+\.\d+)/);
    if (match) browser.version = match[1];
  } else if (userAgent.includes('Edge')) {
    browser.name = 'Edge';
    const match = userAgent.match(/Edge\/(\d+\.\d+)/);
    if (match) browser.version = match[1];
  }

  if (userAgent.includes('Windows')) {
    os.name = 'Windows';
    if (userAgent.includes('Windows NT 10.0')) os.version = '10';
    else if (userAgent.includes('Windows NT 6.3')) os.version = '8.1';
    else if (userAgent.includes('Windows NT 6.1')) os.version = '7';
  } else if (userAgent.includes('Mac OS X')) {
    os.name = 'macOS';
    const match = userAgent.match(/Mac OS X (\d+[._]\d+)/);
    if (match) os.version = match[1].replace('_', '.');
  } else if (userAgent.includes('Linux')) {
    os.name = 'Linux';
  } else if (userAgent.includes('Android')) {
    os.name = 'Android';
    const match = userAgent.match(/Android (\d+\.\d+)/);
    if (match) os.version = match[1];
  } else if (userAgent.includes('iOS')) {
    os.name = 'iOS';
    const match = userAgent.match(/OS (\d+[._]\d+)/);
    if (match) os.version = match[1].replace('_', '.');
  }

  return { browser, os };
}

// Analytics tracking middleware
function createAnalyticsMiddleware(logger) {
  return function analyticsMiddleware(req, res, next) {
    const now = new Date();
    const hour = now.getHours();
    const date = now.toISOString().split('T')[0];
    const userAgent = req.get('User-Agent') || 'Unknown';
    const ip = req.ip || req.connection.remoteAddress || 'Unknown';
    const referrer = req.get('Referer') || 'Direct';
    const page = req.path;

    // Parse user agent
    const { browser, os } = parseUserAgent(userAgent);
    const browserKey = `${browser.name} ${browser.version}`;
    const osKey = `${os.name} ${os.version}`;

    // Update analytics data
    analyticsData.totalRequests++;
    analyticsData.uniqueIPs.add(ip);
    analyticsData.lastUpdated = now.toISOString();

    // Browser stats
    analyticsData.browsers[browserKey] = (analyticsData.browsers[browserKey] || 0) + 1;

    // OS stats
    analyticsData.operatingSystems[osKey] = (analyticsData.operatingSystems[osKey] || 0) + 1;

    // Referrer stats (store both original and parsed)
    analyticsData.referrers[referrer] = (analyticsData.referrers[referrer] || 0) + 1;

    // Page stats
    analyticsData.pages[page] = (analyticsData.pages[page] || 0) + 1;

    // Hourly stats
    if (!analyticsData.hourlyStats[hour]) {
      analyticsData.hourlyStats[hour] = 0;
    }
    analyticsData.hourlyStats[hour]++;

    // Daily stats
    if (!analyticsData.dailyStats[date]) {
      analyticsData.dailyStats[date] = 0;
    }
    analyticsData.dailyStats[date]++;

    // Daily detailed analytics
    if (!dailyAnalytics[date]) {
      dailyAnalytics[date] = {
        totalRequests: 0,
        uniqueIPs: new Set(),
        browsers: {},
        operatingSystems: {},
        pages: {},
        hourlyStats: {}
      };
    }

    dailyAnalytics[date].totalRequests++;
    dailyAnalytics[date].uniqueIPs.add(ip);
    dailyAnalytics[date].browsers[browserKey] = (dailyAnalytics[date].browsers[browserKey] || 0) + 1;
    dailyAnalytics[date].operatingSystems[osKey] = (dailyAnalytics[date].operatingSystems[osKey] || 0) + 1;
    dailyAnalytics[date].pages[page] = (dailyAnalytics[date].pages[page] || 0) + 1;
    dailyAnalytics[date].hourlyStats[hour] = (dailyAnalytics[date].hourlyStats[hour] || 0) + 1;

    // Save data every 10 requests to avoid too frequent file writes
    if (analyticsData.totalRequests % 10 === 0) {
      saveAnalyticsData(logger);
    }

    next();
  };
}

// Format time for better readability
function formatTime(hour) {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${period}`;
}

// Format date for better readability
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// Generate analytics response with enhanced formatting
function generateAnalyticsResponse(logger, options = {}) {
  try {
    // Save current data before serving
    saveAnalyticsData(logger);

    const { format = 'detailed', limit = 10 } = options;

    // Get top browsers (limit to specified number)
    const topBrowsers = Object.entries(analyticsData.browsers)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([browser, count]) => ({ 
        browser, 
        count,
        percentage: ((count / analyticsData.totalRequests) * 100).toFixed(1) + '%'
      }));

    // Get top operating systems (limit to specified number)
    const topOperatingSystems = Object.entries(analyticsData.operatingSystems)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([os, count]) => ({ 
        os, 
        count,
        percentage: ((count / analyticsData.totalRequests) * 100).toFixed(1) + '%'
      }));

    // Get top pages (limit to specified number)
    const topPages = Object.entries(analyticsData.pages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([page, count]) => ({ 
        page, 
        count,
        percentage: ((count / analyticsData.totalRequests) * 100).toFixed(1) + '%'
      }));

    // Enhanced referrer analysis
    const referrerCategories = categorizeReferrers(analyticsData.referrers);
    
    // Get top referrers (limit to specified number)
    const topReferrers = Object.entries(analyticsData.referrers)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([referrer, count]) => {
        const parsed = parseReferrer(referrer);
        return { 
          referrer, 
          domain: parsed.domain,
          category: parsed.category,
          count,
          percentage: ((count / analyticsData.totalRequests) * 100).toFixed(1) + '%'
        };
      });

    // Get hourly distribution with formatted times
    const hourlyDistribution = Object.entries(analyticsData.hourlyStats)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([hour, count]) => ({ 
        hour: parseInt(hour), 
        time: formatTime(parseInt(hour)),
        count,
        percentage: ((count / analyticsData.totalRequests) * 100).toFixed(1) + '%'
      }));

    // Get daily stats (last 30 days) with formatted dates
    const dailyStats = Object.entries(analyticsData.dailyStats)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .slice(-30)
      .map(([date, count]) => ({ 
        date, 
        formattedDate: formatDate(date),
        count,
        percentage: ((count / analyticsData.totalRequests) * 100).toFixed(1) + '%'
      }));

    // Base response structure
    const response = {
      metadata: {
        generatedAt: new Date().toISOString(),
        format: format,
        version: "1.0.0"
      },
      summary: {
        totalRequests: analyticsData.totalRequests,
        uniqueVisitors: analyticsData.uniqueIPs.size,
        lastUpdated: analyticsData.lastUpdated,
        averageRequestsPerVisitor: (analyticsData.totalRequests / analyticsData.uniqueIPs.size).toFixed(2)
      },
      topBrowsers,
      topOperatingSystems,
      topPages,
      topReferrers,
      referrerCategories,
      hourlyDistribution,
      dailyStats
    };

    // Return different formats based on options
    if (format === 'minimal') {
      return {
        metadata: response.metadata,
        summary: response.summary,
        topBrowsers: response.topBrowsers.slice(0, 5),
        topPages: response.topPages.slice(0, 5),
        referrerCategories: {
          direct: referrerCategories.direct,
          search: referrerCategories.search,
          social: referrerCategories.social
        }
      };
    } else if (format === 'summary') {
      return {
        metadata: response.metadata,
        summary: response.summary,
        topBrowsers: response.topBrowsers.slice(0, 3),
        topOperatingSystems: response.topOperatingSystems.slice(0, 3),
        topPages: response.topPages.slice(0, 3),
        referrerCategories: referrerCategories
      };
    }

    return response;
  } catch (error) {
    if (logger) logger.error('Error generating analytics:', error);
    throw error;
  }
}

module.exports = {
  loadAnalyticsData,
  saveAnalyticsData,
  createAnalyticsMiddleware,
  generateAnalyticsResponse
};
