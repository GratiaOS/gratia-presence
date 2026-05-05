import type { MDXComponents } from 'mdx/types';

// Optionally map elements (h1, a, img, code, etc.) to custom components.
// Keep empty for now; we can extend later.
const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return components;
}
