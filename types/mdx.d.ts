declare module '*.mdx' {
  import type { ComponentType } from 'react';
  // Default export is the compiled React component
  const MDXComponent: ComponentType<any>;
  // Named export injected by remark-mdx-frontmatter (if configured)
  export const frontmatter: any;
  export default MDXComponent;
}
