import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const protocolsDir = path.join(process.cwd(), 'app/protocols');
const outputPath = path.join(protocolsDir, 'frontmatters.json');
const supportedLocales = ['es', 'ro', 'en'];

const protocolFolders = fs.readdirSync(protocolsDir).filter((name) => {
  const fullPath = path.join(protocolsDir, name);
  return fs.statSync(fullPath).isDirectory();
});

const result = {};

for (const folder of protocolFolders) {
  result[folder] = {};

  for (const locale of supportedLocales) {
    const mdxPath = path.join(protocolsDir, folder, `content.${locale}.mdx`);
    if (fs.existsSync(mdxPath)) {
      const file = fs.readFileSync(mdxPath, 'utf8');
      const { data } = matter(file);
      result[folder][locale] = data;
    }
  }

  // Fallback to content.mdx if no localized versions exist
  const fallbackPath = path.join(protocolsDir, folder, 'content.mdx');
  if (Object.keys(result[folder]).length === 0 && fs.existsSync(fallbackPath)) {
    const file = fs.readFileSync(fallbackPath, 'utf8');
    const { data } = matter(file);
    // Use default locale (es) as fallback
    result[folder]['es'] = data;
  }
}

fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
console.log('Protocol frontmatters extracted:', Object.keys(result));
console.log('Locales found:',
  Object.entries(result).map(([protocol, langs]) =>
    `${protocol}: ${Object.keys(langs).join(', ')}`
  ).join('\n')
);
