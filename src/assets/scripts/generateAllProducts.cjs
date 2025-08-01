const fs = require('fs');
const path = require('path');

const productDir = path.join(__dirname, '../products');
const categories = fs.readdirSync(productDir).filter(f =>
  fs.statSync(path.join(productDir, f)).isDirectory()
);

let id = 1;
let imports = '';
let entries = [];

const MAX_IMAGES_PER_PRODUCT = 4;

// Price generator
function getRandomPrice(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

categories.forEach(category => {
  const files = fs
    .readdirSync(path.join(productDir, category))
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .sort(); // ensures consistent order

  if (files.length === 0) return;

  for (let i = 0; i < files.length; i += MAX_IMAGES_PER_PRODUCT) {
    const chunk = files.slice(i, i + MAX_IMAGES_PER_PRODUCT);

    const varNames = [];
    chunk.forEach((file, index) => {
      const variableName = `p${id}_${index}`;
      const importPath = `../products/${category}/${file}`;
      imports += `import ${variableName} from '${importPath}';\n`;
      varNames.push(variableName);
    });

    const mainImageName = chunk[0]
      .replace(/\.(jpg|jpeg|png|webp)/i, '')
      .replace(/_/g, ' ');

    const new_price = getRandomPrice(999, 2499);
    const old_price = new_price + getRandomPrice(500, 2000);

    entries.push(`  {
    id: ${id},
    name: '${mainImageName}',
    image: ${varNames[0]},
    images: [${varNames.join(', ')}],
    category: '${category}',
    new_price: ${new_price},
    old_price: ${old_price}
  }`);

    id++;
  }
});

const output = `${imports}\nconst allProducts = [\n${entries.join(',\n')}\n];\n\nexport default allProducts;\n`;

fs.writeFileSync(path.join(__dirname, '../allProducts.js'), output);
console.log('✅ allProducts.js generated successfully!');
