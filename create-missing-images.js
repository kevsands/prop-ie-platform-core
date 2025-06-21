const fs = require('fs');
const https = require('https');
const path = require('path');

// Function to download a placeholder image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// Create missing image files
async function createMissingImages() {
  const images = [
    { path: 'public/images/resources/q1-market-review.jpg', text: 'Q1 Market Review' },
    { path: 'public/images/solutions/developer-hub.jpg', text: 'Developer Hub' }
  ];

  for (const img of images) {
    const fullPath = path.join(__dirname, img.path);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`Creating placeholder for: ${img.path}`);
      
      // Create a data URL for a simple gray rectangle
      const canvas = `<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="800" fill="#808080"/>
        <text x="600" y="400" font-family="Arial" font-size="48" fill="white" text-anchor="middle">${img.text}</text>
      </svg>`;
      
      // Write the SVG file first
      const svgPath = fullPath.replace('.jpg', '.svg');
      fs.writeFileSync(svgPath, canvas);
      
      // For now, just copy the SVG as JPG (browsers will handle it)
      fs.copyFileSync(svgPath, fullPath);
      console.log(`Created: ${img.path}`);
    } else {
      console.log(`Already exists: ${img.path}`);
    }
  }
}

createMissingImages().catch(console.error);