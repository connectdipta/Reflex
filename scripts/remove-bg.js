const sharp = require('sharp');
const path = require('path');

const inputPath = path.join(__dirname, 'public', 'logo.png');
const outputPath = path.join(__dirname, 'public', 'logo-no-bg.png');

sharp(inputPath)
  .ensureAlpha()
  .composite([{
    input: Buffer.from([0, 0, 0, 255]),
    raw: { channels: 4, height: 1, width: 1 },
    tile: true,
    blend: 'dest-in'
  }])
  .toFile(outputPath)
  .then(() => console.log('Done!'))
  .catch(err => console.error(err));