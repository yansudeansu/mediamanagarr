type Query<T> = (selector: string) => T

export function mmIconSelectors<T>(query: Query<T>) {
  const root = 'svg.lucide'

  return {
    get: () => query(root),
    decorative: () => query(`${root}[aria-hidden="true"][focusable="false"]`),
    size: (size: number) => query(`${root}[width="${size}"][height="${size}"]`),
    stroke: () => query(`${root}[stroke="currentColor"]`),
    strokeWidth: (width: number) => query(`${root}[stroke-width="${width}"]`),
    shapes: () =>
      query(`${root} path, ${root} line, ${root} polyline, ${root} rect, ${root} circle`),
  }
}
