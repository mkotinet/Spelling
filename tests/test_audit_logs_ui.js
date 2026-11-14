const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('--- Running User Logs & Admin Audit UI Tests ---');

const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const styleCss = fs.readFileSync(path.join(__dirname, '..', 'style.css'), 'utf8');
const appJs = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

// 1. Verify HTML markup
assert(indexHtml.includes('id="userActivityHistorySection"'), 'index.html must have userActivityHistorySection');
assert(indexHtml.includes('id="userLogsContainer"'), 'index.html must have userLogsContainer');
assert(indexHtml.includes('id="btnOpenAdminLogs"'), 'index.html must have btnOpenAdminLogs');
assert(indexHtml.includes('id="modalAdminLogs"'), 'index.html must have modalAdminLogs');

// 2. Verify CSS styles
assert(styleCss.includes('.log-item-row'), 'style.css must have .log-item-row');
assert(styleCss.includes('.log-badge'), 'style.css must have .log-badge');

// 3. Verify app.js methods
assert(appJs.includes('openAdminLogsModal'), 'app.js must implement openAdminLogsModal');
assert(appJs.includes('fetchUserLogs'), 'app.js must implement fetchUserLogs');

console.log('✅ User Logs & Admin Audit UI Static Tests Passed!');
