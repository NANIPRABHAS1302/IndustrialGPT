export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
} as const;

export function isMobile(width: number) {
  return width < breakpoints.md;
}
