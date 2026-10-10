const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const candidates = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
];

const browserPath = candidates.find(p => fs.existsSync(p));
console.log('Browser path:', browserPath);

if (!browserPath) {
  console.log('No local browser found');
  process.exit(1);
}

const targetDir = path.resolve('screenshots');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

function capture(url, outName, width = 1280, height = 800) {
  const outFile = path.join(targetDir, outName);
  const cmd = `"${browserPath}" --headless --disable-gpu --virtual-time-budget=3000 --run-all-compositor-stages-before-draw --screenshot="${outFile}" --window-size=${width},${height} "${url}"`;
  console.log('Running:', cmd);
  execSync(cmd, { stdio: 'inherit' });
  console.log(`Captured ${outName} (${fs.statSync(outFile).size} bytes)`);
}

capture('http://localhost:3000/', 'hero.png', 1280, 800);
capture('http://localhost:3000/', 'hero_mobile_360.png', 360, 740);
capture('http://localhost:3000/login', 'login.png', 1280, 800);
capture('http://localhost:3000/app/live-inspection', 'live_inspection.png', 1280, 800);
capture('http://localhost:3000/inspection', 'landing_section.png', 1280, 800);
