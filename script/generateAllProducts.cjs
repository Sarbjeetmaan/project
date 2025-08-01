// scripts/generateProducts.js

const fs = require('fs');
const path = require('path');

const productDir = path.join(__dirname, '../src/assets/products'); // ⬅️ Ensure your images are here
const outputFile = path.join(__dirname, '../src/assets/allProducts.js'); // ⬅️ Output file

const MAX_IMAGES_PER_PRODUCT = 4;
let id = 1;
let entries = [];

// Helper: generate random price
function getRandomPrice(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const categories = fs.readdirSync(productDir).filter(f =>
  fs.statSync(path.join(productDir, f)).isDirectory()
);

categories.forEach(category => {
  const files = fs
    .readdirSync(path.join(productDir, category))
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .sort();

  if (files.length === 0) return;

  for (let i = 0; i < files.length; i += MAX_IMAGES_PER_PRODUCT) {
    const chunk = files.slice(i, i + MAX_IMAGES_PER_PRODUCT);
    const imageURLs = chunk.map(file => `/products/${category}/${file}`);
    const mainImage = imageURLs[0];
    const name = chunk[0].replace(/\.(jpg|jpeg|png|webp)/i, '').replace(/_/g, ' ');

    const new_price = getRandomPrice(999, 2499);
    const old_price = new_price + getRandomPrice(500, 2000);

    entries.push(`  {
  id: ${id},
  name: '${name}',
  image: '${mainImage}',
  images: ${JSON.stringify(imageURLs)},
  category: '${category}',
  new_price: ${new_price},
  old_price: ${old_price}
}`);
    id++;
  }
});

const output = `const allProducts = [\n${entries.join(',\n')}\n];\n\nexport default allProducts;\n`;
fs.writeFileSync(outputFile, output);
console.log('✅ allProducts.js generated successfully!');
