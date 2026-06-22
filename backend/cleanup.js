const fs = require('fs');
const path = require('path');
const pool = require('./config/db');

const cleanup = async () => {
  const uploadsDir = path.join(__dirname, 'uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    console.log('No uploads folder found.');
    process.exit();
  }
  
  const files = fs.readdirSync(uploadsDir);
  const [rows] = await pool.query('SELECT image_url FROM listings WHERE image_url IS NOT NULL');
  const dbImages = rows.map(r => path.basename(r.image_url));
  
  let deleted = 0;
  files.forEach(file => {
    if (!dbImages.includes(file)) {
      fs.unlinkSync(path.join(uploadsDir, file));
      console.log('Deleted orphan:', file);
      deleted++;
    }
  });
  
  console.log(`\nDone! Deleted ${deleted} orphaned images. Kept ${dbImages.length} in use.`);
  process.exit();
};

cleanup().catch(err => { console.error(err); process.exit(1); });