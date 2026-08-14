declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const content: { readonly [key: string]: string };
  export default content;
}

declare module 'next' {
  export type NextConfig = any;
  export type Metadata = any;
  export type Viewport = any;
}

declare module 'next/link' {
  import React from 'react';
  const Link: React.ComponentType<any>;
  export default Link;
}

declare module 'next/navigation' {
  export function usePathname(): string;
  export function useRouter(): any;
  export function useSearchParams(): any;
  export function redirect(url: string): void;
}

declare module 'next/image' {
  import React from 'react';
  const Image: React.ComponentType<any>;
  export default Image;
}
