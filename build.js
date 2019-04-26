const fs = require('fs');
const path = require('path');
const package = require('./package');


const file = fs.readFileSync(path.join(__dirname, 'src', 'analytics-sandbox.html'), 'utf8');
fs.writeFileSync(path.join(__dirname, 'analytics-sandbox.html'), file.replace(/\{\{VERSION\}\}/g, package.version));
