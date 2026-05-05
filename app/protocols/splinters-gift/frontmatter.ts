import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Utility to extract frontmatter from MDX file
export function getSplintersGiftFrontmatter() {
  const mdxPath = path.join(process.cwd(), 'app/protocols/splinters-gift/content.mdx');
  const file = fs.readFileSync(mdxPath, 'utf8');
  const { data } = matter(file);
  return data;
}

// Example usage:
// const fm = getSplintersGiftFrontmatter();
// console.log(fm.title, fm.summary, fm.tags, fm.updated);
