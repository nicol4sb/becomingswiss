# Becoming Swiss - Simple Logging Setup

A React application for Swiss citizenship services with basic server-side logging.

## Quick Start

```bash
# Install dependencies
npm install

# Build the React app
npm run build

# Start the server
npm run server
```

## Logging & Analysis

The server creates logs in the `logs/` directory:

- `access.log` - Apache-style HTTP access logs (perfect for grepping)
- `error.log` - Error logs only  
- `combined.log` - All logs in JSON format


### Useful Commands

```bash
# Follow logs in real-time
npm run logs:access

# Get log statistics
npm run logs:stats

# View errors
npm run logs:errors

# Clean logs
npm run logs:clean
```

### Useful Grep Commands

```bash
# Count total requests
grep -c "GET\|POST" logs/access.log

# Find requests from specific IP
grep "192.168.1.100" logs/access.log

# Find 404 errors
grep " 404 " logs/access.log

# Find requests to specific path
grep "/api/" logs/access.log

# Count requests by hour
grep -o "\[.*\]" logs/access.log | cut -d: -f2 | sort | uniq -c

# Find slow requests (>1 second)
grep -E " [0-9]{4,} " logs/access.log

# Find mobile user agents
grep -i "mobile\|android\|iphone" logs/access.log

# Find requests from today
grep "$(date '+%d/%b/%Y')" logs/access.log
```

## Health Check

The server provides a health check endpoint:
- `GET /api/health` - Returns server status and uptime

## Development

```bash
# Run both React app and server
npm run dev

# Or run separately:
npm start          # React app on port 3000
npm run server     # Express server on port 6000
```
