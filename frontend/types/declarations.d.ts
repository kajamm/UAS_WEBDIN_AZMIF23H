// frontend/types/declarations.d.ts
// Type declarations untuk modul yang tidak memiliki type definitions

// CSS Modules
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

// SVG
declare module '*.svg' {
  const content: string;
  export default content;
}

// Images
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}
